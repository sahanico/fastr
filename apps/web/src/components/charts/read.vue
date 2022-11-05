<template>
  <div>
    <div class="headline red--text pt-2 mt-2 pb-2 mb-2">
      {{ this.label }}
    </div>
    <div>
      <v-progress-circular style="margin-left: 50%" v-show="loading" color="red" indeterminate />
    </div>
    <div v-if="getType === 'pie'">
    <read-pie :name="name" :obj="obj" :chart="chart" :ht="parseInt(ht)" />
    </div>
    <div v-if="getType === 'bar'">
      <read-bar :name="name" :obj="obj" :ht="parseInt(ht)" />
    </div>
    <div v-if="getType === 'line'">
      <read-line :name="name" :obj="obj" :ht="parseInt(ht)" />
    </div>
  </div>
</template>

<script>
import ReadPie from '../charts/read-pie';
import ReadBar from '../charts/read-bar';
import ReadLine from '../charts/read-line';

export default {
  name: 'read',
  components: {
    ReadPie,
    ReadBar,
    ReadLine,
  },
  props: ['name', 'obj', 'ht', 'label'],
  data() {
    return {
      chart: [],
      getType: '',
      loading: true,
    };
  },
  async created() {
    this.chart = await this.$store.dispatch('getDesignByName', {
      name: this.name,
    });
    this.getType = this.chart.meta.chartType;
  },
  watch: {
    getType() {
      this.loading = false;
    },
  },
};

</script>

