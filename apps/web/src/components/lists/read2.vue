<template>
  <v-container v-if="list">
    <v-dialog v-model="createFormDialog" width="500" height="100%">
      <v-card>
        <v-container>
          <create-form :input="selectedItem" :form-name="selectedAction.createFormDialog" :inDialog="true"
                       :name="`create-form-${selectedAction.createFormDialog}`"/>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text type="button">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="list.meta">
      <div class="headline red--text pt-2 mt-2">
        {{ list.meta.showLabel ? list.label : '' }}
      </div>
      <v-container>
        <v-row v-if="list.meta.inputBoilerPlate">
          <v-col>
            <div class="headline red--text pt-2 mt-2" v-if="input && input.data">
              <!-- fix hardcoding -->
              {{ `${input.data.first_name} ${input.data.last_name}` }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="1" offset="10" v-if="list.meta.import">
            <div align="right">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="red darken-2" dark v-bind="attrs" v-on="on">
                    Import
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(item, index) in importOptions" :key="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
          <v-col cols="1">
            <div align="right" v-if="list.meta">
              <div v-if="list.meta.create">
                <v-btn color="red darken-2" dark style="align: right;"
                       @click="routeToCreateDashboard">
                  Create
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container v-if="list.meta">
      <v-row>
        <v-col cols="12" md="2" v-if="list.meta.searchable">
          <v-text-field
            v-model="queries"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col>
          <div>
            <v-progress-linear v-show="loading" color="red" indeterminate/>
          </div>
          <v-data-table :headers="listHeaders"
                        :items="formattedRecords"
                        :search="queries"
                        :items-per-page="8"
                        :sort-by="list.meta.sort.field"
                        :sort-desc="list.meta.sort.mode === 'descending'"
                        item-key="items.key">
            <template v-slot:item.actions="{ item }">
              <span v-for="(action, index) in item.actions" :key="index">
                <template>
                  <div>
                    <v-tooltip top style="background-color: red">
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" color="red" icon>
                           <v-icon small @click="clickAction(action, item)"
                                   :style="{ paddingRight: '5px' }">
                            {{ generateIcon(action) }}
                          </v-icon> {{ action.label }}
                        </v-btn>
                      </template>
                      <span>{{ action.label }}</span>
                    </v-tooltip>
                  </div>
                </template>
              </span>
            </template>
            <template v-slot:[`item.${list.meta.routeBy}`]="{ item, index }">
              <a @click="routeTo(index, item)" href="javascript:void(0)">{{
                  item[list.meta.routeBy]
                }}</a>
            </template>
            <template v-slot:[`item.attachments`]="{ item, index }">
              <v-chip dense v-if="attachment.name"
                      truncate v-for="(attachment, index) in item['attachments']" :key="index">
                <a @click="downloadAttachment(attachment)" href="javascript:void(0)">
                  {{ attachment ?
                  attachment.name ?
                    attachment.name.length > 20 ?
                      `...${attachment.name.slice(-20)}` :
                      attachment.name :
                    '' :
                  '' }}
                </a>
              </v-chip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import _ from 'underscore';
import CreateForm from '../forms/create';

export default {
  components: {
    CreateForm,
  },
  props: ['designName', 'input', 'inputId'],
  data() {
    return {
      list: {},
      objects: [],
      records: [],
      listHeaders: [],
      createFormDialog: false,
      selectedAction: {},
      selectedItem: null,
      importOptions: [{ title: 'csv' }],
      bind: null,
      queries: '',
      loading: true,
    };
  },
  computed: {
    formattedRecords() {
      if (!this.list) return [];
      let accountId = '';
      const object = _.findWhere(this.objects, { name: this.list.object });
      const recs = [];
      const clonedRecords = JSON.parse(JSON.stringify(this.records));
      _.each(clonedRecords, record => {
        _.each(object.fields, field => {

          if (field.type === 'object_array') {
            if (record.data[field.name] && record.data[field.name].text) {
              record.data[field.name] = record.data[field.name].text;
            } else {
              const fieldObject = _.findWhere(this.objects, { name: field.meta.object });
              const fieldData = record.data[field.name];
              _.each(fieldData, data => {
                const rec = _.findWhere(clonedRecords, { _id: data });
                if (rec && rec.data) {
                  record.data[field.name].push(rec.data[fieldObject.primaryField]);
                }
              });
            }
          }
          if (field.type === 'object') {
            if (record.data[field.name] && record.data[field.name].text) {
              record.data[field.name] = record.data[field.name].text;
            } else {
              const fieldObject = _.findWhere(this.objects, { name: field.meta.object });
              const fieldData = record.data[field.name];
              const rec = _.findWhere(clonedRecords, { _id: fieldData });
              if (rec && rec.data) {
                record.data[field.name] = rec.data[fieldObject.primaryField];
              }
            }
          }
          if (field.type === 'date' || field.type === 'date_time' || field.type === 'user') {
            if (record.data[field.name] && record.data[field.name].text) {
              record.data[field.name] = record.data[field.name].text;
            }
          }
          if (typeof fieldData === 'string') {
            accountId = (fieldData);
          }
          if (field.type === 'attachment') {
            const fieldData = record.data[field.name];
            _.each(fieldData, (data) => {
              record.data[field.name].push(data.name);
            });
          }
        });
        if (record.actions) {
          recs.push({ id: record.id, ...record.data, accountId, actions: record.actions });
        } else {
          recs.push({ id: record.id, ...record.data, accountId, actions: [] });
        }
      });
      return recs;
    },
  },
  methods: {
    generateIcon(action) {
      if (action.icon === 'pay') {
        return ' mdi-credit-card ';
      } else if (action.icon === 'download') {
        return ' mdi-download ';
      } else if (action.icon === 'approve') {
        return ' mdi-check-decagram ';
      } else if (action.icon === 'cancel') {
        return ' mdi-cancel ';
      } else if (action.icon === 'archive') {
        return ' inventory ';
      }
      return ' mdi-check-decagram ';
    },
    async downloadAttachment(attachment) {
      this.pathName = await this.$store.dispatch('downloadAttachment', {
        path: attachment.path,
        name: attachment.name,
      });
    },
    async routeToCreateDashboard() {
      const design = await this.$store.dispatch('getDesignByName', {
        name: this.list.meta.create,
      });
      await this.$router.push({
        name: 'DashboardRead',
        params: { design, name: this.list.meta.create, input: this.input, context: 'create' },
      });
      this.$forceUpdate();
    },
    async clickAction(action, item) {
      if (action.type === 'process') {
        await this.runProcess(action.process, item, action);
        location.reload();
      } else if (action.type === 'create-form-dialog') {
        this.selectedAction = action;
        this.selectedItem = item;
        this.createFormDialog = true;
      }
    },
    async runProcess(processName, item, action) {
      const process = await this.$store.dispatch('getDesignByName', {
        name: processName,
      });

      const { pool } = process.meta;

      const variable = _.findWhere(pool, { feeder: 'input' });

      const data = await this.$store.dispatch('runProcess', {
        process: processName,
        pool: [{ ...variable, data: item, _id: item.id }],
      });
      // only download when process is a download process
      if (action.icon === 'download') {
        await this.$store.dispatch('downloadAttachment', {
          path: data.file,
          name: `${variable.label}.pdf`,
        });
      }
    },
    async routeTo(idx, listItem) {
      // eslint-disable-next-line no-underscore-dangle
      const design = await this.$store.dispatch('getDesignByName', {
        name: this.bind,
      });
      const record = _.findWhere(this.records, { id: listItem.id });
      await this.$router.push({
        path: `/dashboard/read/${this.bind}/${record.id}`,
        name: 'DashboardReadWithInput',
        // eslint-disable-next-line no-underscore-dangle
        params: { design, name: this.bind, input: record, inputId: record.id },
      });
      this.$forceUpdate();
    },
  },
  async created() {
    this.list = await this.$store.dispatch('getDesignByName', { name: this.designName });
    if (!this.input && this.inputId) {
      this.input = await this.$store.dispatch('getRecordByObjectID', { id: this.inputId });
    }
    this.objects = await this.$store.dispatch('getAllObjects');
    this.records = await this.$store.dispatch(
      'getRecordsForList',
      {
        list: this.designName,
        system: this.$store.state.system,
        input: { object: this.list.object, data: this.input },
      },
    );
    _.each(this.list.meta.layout, (item) => {
      this.listHeaders.push({
        value: item.value.name,
        text: item.value.label,
      });
      if (item.value.context === 'update') {
        this.updateHeader = item.value.name;
      }
    });
    if (this.list.meta.actions.length > 0) {
      this.listHeaders.push({ text: 'Actions', value: 'actions', sortable: false });
    }
    this.bind = this.list.meta.bindTo;
    this.loading = false;
  },
};
</script>
