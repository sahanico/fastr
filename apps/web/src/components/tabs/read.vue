<template>
  <div>
    <v-tabs v-if="tab && tab.meta" color="red" v-model="tabContent" background-color="#f5f5f5">
      <v-tab v-for="(item, index) in tabs" :key="index"
             style="background-color: #f5f5f5;">
        {{ item.label }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabContent">
      <v-tab-item v-for="(item, index) in tabs" :key="index">
        <div>
          <dashboard-read-tab :name="`read-tab-${item.name}`" style="background-color: #f5f5f5"
                          :inputId="inputId"
                          :design="item.design"
                          :input="input">
          </dashboard-read-tab>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import { _ } from 'vue-underscore';
import DashboardReadTab from '../dashboards/read-tab';

export default {
  components: { DashboardReadTab },
  props: ['designName', 'obj', 'input', 'inputId'],
  data() {
    return {
      tabContent: null,
      tab: {},
      designs: [],
    };
  },
  computed: {
    tabs() {
      return _.map(this.tab.meta.layout, (item) => {
        const design = _.findWhere(this.designs, { name: item.value.name });
        return {
          label: item.value.label,
          name: item.value.name,
          design,
        };
      });
    },
  },
  methods: {
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
    this.tab = await this.$store.dispatch('getDesignByName', { name: this.designName });
    this.designs = await this.$store.dispatch('getAllDesigns');
  },
};
</script>

