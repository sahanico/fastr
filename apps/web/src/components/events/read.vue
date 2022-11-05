<template>
  <div style="margin: 20px">
    <div class="headline red--text pt-2 mt-2 pb-2 mb-2">
      {{ this.design.value.label }}
    </div>
    <div v-if="!bind">
      <v-data-table :headers="listHeaders" :items="records"
                    class="elevation-1" v-bind:pagination.sync="pagination"
                    hide-actions :items-per-page="7"
                    item-key="items.key">
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="runProcess(item)"> mdi-check-decagram</v-icon>
        </template>
      </v-data-table>
    </div>
    <div v-if="bind">
      <v-data-table :headers="listHeaders" :items="records" class="elevation-1"
                    :items-per-page="5">
        <template v-slot:[`item.${design.value.meta.routeBy}`]="{ item, index }">
          <a @click="routeTo(index, item)" href="javascript:void(0)">{{
              item[design.value.meta.routeBy] }}</a>
        </template>
        <template v-slot:[`item.${design.value.meta.routeBy}`]="{ item, index }">
          <a @click="routeTo(index, item)" href="javascript:void(0)">{{
              item[design.value.meta.routeBy] }}</a>
        </template>
      </v-data-table>
    </div>
  </div>
</template>
<script>
import { _ } from 'vue-underscore';
import Fields from '../fields/fields';

export default {
  components: {
    Fields,
  },
  props: ['design', 'name', 'obj', 'input'],
  data() {
    return {
      list: {},
      createdDialog: false,
      listHeaders: [],
      updateHeader: '',
      recordsList: [],
      bind: false,
      pagination: { sortBy: 'column1', descending: true, rowsPerPage: -1 },
    };
  },
  computed: {
    records() {
      const data = [];
      _.each(this.recordsList, (item) => {
        data.push(item.data);
      });
      return data;
    },
    bindTo() {
      return this.design.value.meta.bindTo;
    },
  },
  methods: {
    runProcess() {
      this.$store.dispatch('runProcess', {
        process: this.design.value.meta.process[0],
        variables: ['aaabbb'],
      });
    },
    async routeTo(idx, listItem) {
      let getId = '';
      _.each(this.recordsList, (recordList) => {
        if (recordList.data === listItem) {
          getId = recordList.id;
        }
      });

      const dashBoard = await this.$store.dispatch('getDashboardByName', {
        name: this.bind,
      });
      await this.$router.push({
        name: 'DashboardRead',
        params: { dashboard: dashBoard, name: this.bind, input: listItem, inputId: getId },
      });
      this.$forceUpdate();
    },
  },
  async created() {
    this.list = await this.$store.dispatch('getDesignByName', {
      name: this.name,
    });
    if (this.list.meta.conditions) {
      this.recordsList = await this.$store.dispatch('getRecordsByObject', {
        object: this.obj,
        conditions: this.list.meta.conditions,
      });
    } else {
      this.recordsList = await this.$store.dispatch('getRecordsByObject', {
        object: this.obj,
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
  },
};
</script>

