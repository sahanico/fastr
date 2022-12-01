<template>
  <v-container v-if="list">
    <v-dialog v-model="createFormDialog" width="500" height="100%">
      <v-card>
        <v-container>
          <create-form :input="selectedItem" :form-name="selectedAction.createFormDialog"
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
        <v-row>
          <v-col cols="1" offset="10" v-if="list.meta.import">
            <div align="right" >
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
    <v-container>
      <v-row>
        <v-col  cols="12" md="2" v-if="list.meta && list.meta.searchable">
          <v-text-field
            v-model="queries"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col>
          <v-data-table :headers="listHeaders"
                        :items="formattedRecords"
                        :search="queries"
                        item-key="items.key">
            <template v-slot:item.actions="{ item }">
        <span v-for="(action, index) in item.actions" :key="index">
          <v-icon small @click="clickAction(action, item)"
                  :style="{ paddingRight: '5px' }">
            {{generateIcon(action)}}
          </v-icon>
        </span>
            </template>
            <template v-slot:[`item.${list.meta.routeBy}`]="{ item, index }">
              <a @click="routeTo(index, item)" href="javascript:void(0)">{{
                  item[list.meta.routeBy]
                }}</a>
            </template>
            <template v-slot:[`item.attachments`]="{ item, index }">
              <a v-for="(attachment, index) in item['attachments']" :key="index"
                 @click="downloadAttachment(attachment)" href="javascript:void(0)">
                {{ attachment.name }}
              </a>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { _ } from 'vue-underscore';
import CreateForm from '../forms/create';

export default {
  components: {
    CreateForm,
  },
  props: ['designName', 'input'],
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
    }
  },
  computed: {
    formattedRecords() {
      if (!this.list) return [];
      let accountId = '';
      const object = _.findWhere(this.objects, { name: this.list.object })
      const recs = [];
      _.each(this.records, record => {
        _.each(object.fields, field => {

          if (field.type === 'object_array') {
            const fieldObject = _.findWhere(this.objects, { name: field.meta.object });
            const fieldData = record.data[field.name]
            _.each(fieldData, data => {
              const rec = _.findWhere(this.records, { _id: data });
              if (rec && rec.data) {
                record.data[field.name].push(rec.data[fieldObject.primaryField])
              }
            })
          }
          if (field.type === 'object') {
            const fieldObject = _.findWhere(this.objects, { name: field.meta.object });
            const fieldData = record.data[field.name]
            const rec = _.findWhere(this.records, { _id: fieldData });
            if (rec && rec.data) {
              record.data[field.name] = rec.data[fieldObject.primaryField];
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
        })
        console.log('record: ', record);
        if (record.actions) {
          recs.push({ id: record.id, ...record.data, accountId, actions: record.actions });
        } else {
          recs.push({ id: record.id, ...record.data, accountId, actions: [] });
        }
      })
      return recs;
    }
  },
  methods: {
    generateIcon(action) {
      console.log('action: ', action);
      if(action.icon === 'pay') {
        return ' mdi-credit-card ';
      } else if (action.icon === 'download') {
        return ' mdi-download ';
      } else if (action.icon === 'approve') {
        return ' mdi-check-decagram ';
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
        params: { design, name: this.list.meta.create, input: this.input },
      });
      this.$forceUpdate();
    },
    async clickAction(action, item) {
      if (action.type === 'process') {
        await this.runProcess(action.process, item);
      } else if (action.type === 'create-form-dialog') {
        this.selectedAction = action;
        this.selectedItem = item;
        this.createFormDialog = true;
      }
    },
    async runProcess(processName, item) {
      const process = await this.$store.dispatch('getDesignByName', {
        name: processName,
      });

      const { pool } = process.meta;

      const variable = _.findWhere(pool, { feeder: 'input' });

      console.log('variable: ', variable);

      const data = await this.$store.dispatch('runProcess', {
        process: processName,
        pool: [{...variable, data: item}],
      });
      await this.$store.dispatch('downloadAttachment', {
        path: data.file,
        name: `${variable.label}.pdf`,
      });
    },
    async routeTo(idx, listItem) {
      // eslint-disable-next-line no-underscore-dangle
      const design = await this.$store.dispatch('getDesignByName', {
        name: this.bind,
      });
      if (listItem.mainAccountId !== listItem.account) {
        // eslint-disable-next-line no-param-reassign
        listItem.account = listItem.mainAccountId;
        // eslint-disable-next-line no-param-reassign
        delete listItem.mainAccountId;
      } else {
        // eslint-disable-next-line no-param-reassign
        delete listItem.mainAccountId;
      }
      await this.$router.push({
        name: 'DashboardRead',
        // eslint-disable-next-line no-underscore-dangle
        params: { design, name: this.bind, input: listItem, inputId: listItem._id },
      });
      this.$forceUpdate();
    },
  },
  async created () {
    this.list = await this.$store.dispatch('getDesignByName', { name: this.designName })
    console.log('list: ', this.list);
    console.log('input: ', this.input);
    this.objects = await this.$store.dispatch('getAllObjects');
    this.records = await this.$store.dispatch(
      'getRecordsForList',
      {
        list: this.designName,
        system: this.$store.state.system,
        input: { object: this.list.object, data: this.input }
      }
    );
    console.log('this.record: ', this.records);
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
  }
}
</script>
