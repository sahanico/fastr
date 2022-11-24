<template>
  <div v-if="list">
    <div v-if="list.meta">
      <div class="headline red--text pt-2 mt-2 pb-2 mb-2">
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
        <v-col cols="12" md="2" v-if="list.meta && list.meta.searchable">
          <v-text-field
            v-model="queries"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col>
          <div v-if="!bind && list && list.meta">
            <div>
              <v-progress-linear v-show="loading" color="red" indeterminate/>
            </div>
            <v-data-table :headers="listHeaders" :items="listRecords"
                          :sort-by.sync="list.meta.sort.field"
                          :sort-desc.sync="list.meta.sort.mode === 'descending'"
                          class="elevation-1"
                          :search="queries"
                          :items-per-page="7" item-key="items.key">
              <template v-slot:item.actions="{ item }">
                <span v-for="(action, index) in list.meta.actions" :key="index">
                  <v-icon small @click="clickAction(action, item)"
                          :style="{ paddingRight: '5px' }">
                    {{generateIcon(index)}}</v-icon>
                <div v-if="action.type === 'create-form-dialog'">
                  <v-dialog v-model="createFormDialog" width="500" height="100%">
                    <v-card>
                      <create-form :input="item" :form-name="action.createFormDialog"
                                   :name="`create-form-${action.createFormDialog}`"/>
                      <br>
                      <br>
                      <br>
                      <br>
                      <br>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="black" text type="button">
                          Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
                </span>
              </template>
              <template v-slot:[`item.attachments`]="{ item, index }">
                <a v-for="(attachment, index) in item['attachments']" :key="index"
                   @click="downloadAttachment(attachment)" href="javascript:void(0)">
                  {{ attachment.name }}
                </a>
              </template>
            </v-data-table>
          </div>
          <div v-if="bind && list && list.meta" >
            <div>
              <v-progress-linear v-show="loading" color="red" indeterminate />
            </div>
            <v-data-table :sort-by.sync="list.meta.sort.field"
                          :search="queries"
                          :sort-desc.sync="list.meta.sort.mode === 'descending'"
                          :headers="listHeaders" :items="listRecords" class="elevation-1"
                          :items-per-page="7" item-key="items.key">
              <template v-slot:item.actions="{ item }">
                <span v-for="(action, index) in list.meta.actions" :key="index">
                  <v-icon small @click="clickAction(action, item)"
                          :style="{ paddingRight: '5px' }">
                    {{generateIcon(index)}}</v-icon>
                <div v-if="action.type === 'create-form-dialog'">
                  <v-dialog v-model="createFormDialog" width="500" height="100%">
                    <v-card>
                      <create-form :input="item" :form-name="action.createFormDialog"
                                   :name="`create-form-${action.createFormDialog}`"/>
                      <br>
                      <br>
                      <br>
                      <br>
                      <br>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="black" text type="button">
                          Close
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
                </span>
              </template>
              <template v-slot:[`item.${list.meta.routeBy}`]="{ item, index }">
                <a @click="routeTo(index, item)" href="javascript:void(0)">{{
                    item[list.meta.routeBy]
                  }}</a>
              </template>
              <template v-slot:[`item.${updateHeader}`]="{ item, index }">
                test
              </template>
              <template v-slot:[`item.${updateHeader}`]="{ item, index }">
                <fields :item="list.meta.layout[0]" context="update" :form="item"></fields>
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
              <template v-slot:[`item.createdBy`]="{ item, index }">
                <div>
                  {{ item.createdBy }}
                </div>
              </template>

            </v-data-table>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { _ } from 'vue-underscore';
import Fields from '../fields/fields';
import CreateForm from '../forms/create';

export default {
  components: {
    Fields,
    CreateForm,
  },
  props: ['designName', 'obj', 'input', 'filter', 'list'],
  data() {
    return {
      queries: '',
      createdDialog: false,
      createFormDialog: false,
      listHeaders: [],
      updateHeader: '',
      recordsList: [],
      records: [],
      objects: [],
      bind: false,
      recordToDelete: null,
      importOptions: [{ title: 'csv' }],
      loading: true,
    };
  },
  computed: {
    listRecords() {
      const listRecs = [];
      let mainAccountId = '';
      if (!this.recordsList[0]) return [];
      const object = _.findWhere(this.objects, { name: this.recordsList[0].object });
      if (!object) return [];
      _.each(this.recordsList, (record) => {
        const updatedRecord = record;
        // eslint-disable-next-line no-underscore-dangle
        updatedRecord.data._id = record._id;
        _.each(object.fields, (field) => {
          if (field.type === 'object_array') {
            // eslint-disable-next-line no-underscore-dangle
            const recObject = _.findWhere(this.objects, { name: field.meta.object });
            const fieldData = updatedRecord.data[field.name];
            // updatedRecord.data[field.name] = [];
            _.each(fieldData, (data) => {
              const rec = _.findWhere(this.records, { _id: data });
              if (rec && rec.data) {
                updatedRecord.data[field.name].push(rec.data[recObject.primaryField]);
              }
            });
          }
          if (field.type === 'object') {
            // eslint-disable-next-line no-underscore-dangle
            const recObject = _.findWhere(this.objects, { name: field.meta.object });
            const fieldData = updatedRecord.data[field.name];
            // updatedRecord.data[field.name] = [];
            const rec = _.findWhere(this.records, { _id: fieldData });
            if (rec && rec.data) {
              updatedRecord.data[field.name] = rec.data[recObject.primaryField];
            }
            if (typeof fieldData === 'string') {
              mainAccountId = (fieldData);
            }
          }
          if (field.type === 'attachment') {
            const fieldData = updatedRecord.data[field.name];
            _.each(fieldData, (data) => {
              updatedRecord.data[field.name].push(data.name);
            });
          }
        });
        listRecs.push({ id: record.id, ...updatedRecord.data, mainAccountId });
      });
      return listRecs;
    },
  },
  methods: {
    generateIcon(index) {
      if (this.list.meta.actions < 1) return '';
      if (this.list.meta.actions[index].icon === 'approve') {
        return ' mdi-check-decagram ';
      } else if (this.list.meta.actions[index].icon === 'download') {
        return ' mdi-download ';
      } else if (this.list.meta.actions[index].icon === 'pay') {
        return ' mdi-credit-card ';
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
        this.showCreateFormDialog();
      }
    },
    showCreateFormDialog() {
      this.createFormDialog = true;
    },
    async runProcess(processName, item) {
      const process = await this.$store.dispatch('getDesignByName', {
        name: processName,
      });

      // check if any process inputs are a feeder selection with this object type
      const { inputs } = process.meta;

      const input = _.findWhere(inputs, { feeder: 'selection' });

      const data = await this.$store.dispatch('runProcess', {
        process: processName,
        pool: [{
          name: input.name,
          label: input.label,
          source: 'list',
          type: 'object',
          meta: this.list.object,
          data: item,
        }],
        inputs: [this.list.meta.inputs],
      });
      await this.$store.dispatch('downloadAttachment', {
        path: data.file,
        name: `${input.label}.pdf`,
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
  async created() {
    this.list = await this.$store.dispatch('getDesignByName', {
      name: this.designName,
    });

    this.objects = await this.$store.dispatch('getAllObjects');
    this.records = await this.$store.dispatch('getAllRecords');
    if (this.filter || this.adminFilter) {
      this.recordsList = await this.$store.dispatch('getRecordsByObjectWithFilter', {
        object: this.list.object,
        filter: this.filter,
        adminFilter: this.list.meta.adminFilter,
        system: this.$store.state.system,
        input: this.input,
      });
    } else {
      this.recordsList = await this.$store.dispatch('getRecordsByObject', {
        object: this.list.object,
      });
    }
    _.each(this.list.meta.layout, (item) => {
      this.listHeaders.push({
        value: item.value.name,
        text: item.value.label,
      });
      if (item.value.context === 'update') {
        this.updateHeader = item.value.name;
      }
    });
    this.listHeaders.push({ text: 'Actions', value: 'actions', sortable: false });
    this.bind = this.list.meta.bindTo;
    this.loading = false;
  },
};
</script>
