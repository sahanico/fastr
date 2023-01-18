<template>
  <div style="margin: 20px; background-color: #f5f5f5">
    <template>
      <v-tabs color="red" v-model="tab" background-color="#f5f5f5">
        <v-tab v-for="(item, index) in tabs" :key="index" style="background-color: #f5f5f5">{{
            item.tab
          }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in tabs" :key="item.tab">
          <dashboard-read :name="item.content" style="background-color: #f5f5f5"
                          :inputId.sync="inputId"
                          :dashboard="design.value.meta.layout[item.index].value"
                          :input.sync="input">
          </dashboard-read>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </div>
</template>
<script>
import { _ } from 'vue-underscore';
import DashboardRead from '../dashboards/read-tab';

export default {
  components: { DashboardRead },
  props: ['design', 'name', 'obj', 'input', 'inputId', 'id'],
  data() {
    return {
      tab: 0,
    };
  },
  computed: {
    tabs() {
      return _.map(this.design.value.meta.layout, (item, index) => ({
        tab: item.value.label,
        content: item.value.name,
        index,
      }));
    },
  },
  methods: {
    async routeTo(idx, listItem) {
      //   var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
      // => 2
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

};
</script>

