<template>
  <div style="margin: 20px" v-if="list">
    <div v-if="list.meta">
      <div class="headline red--text pt-2 mt-2 pb-2 mb-2">
        {{ list ? list.label : '' }}
      </div>
      <v-container>
        <v-row>
          <v-col cols="1" offset="10">
            <div align="right" v-if="list.meta.import">
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
          <div v-if="list && list.meta">
            <div>
              <v-progress-linear v-show="loading" color="red" indeterminate/>
            </div>
            <v-data-table :headers="listHeaders"
                          class="elevation-1"
                           item-key="items.key">
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
  props: ['designName'],
  data() {
    return {
      list: {},
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

  async created() {
    this.list = await this.$store.dispatch('getDesignByName', {
      name: this.designName,
    });


    _.each(this.list.meta.layout, (item) => {
      this.listHeaders.push({
        value: item.value.name,
        text: item.value.label,
      });
    });
    this.listHeaders.push({ text: 'Actions', value: 'actions', sortable: false });
    this.bind = this.list.meta.bindTo;
    this.loading = false;
  },
};
</script>
