<script>
import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  name: 'read-line',
  props: ['name', 'obj'],
  data() {
    return {
      data: [],
      labels: [],
      records: [],
      chart: [],
    };
  },
  methods: {
    async getData() {
      this.chart = await this.$store.dispatch('getDesignByName', {
        name: this.name,
      });
      this.records = await this.$store.dispatch('getSummaryByObject', {
        object: this.chart.object,
        fields: this.chart.meta.chartFields,
      });
      const chartField = this.chart.meta.chartFields[0].name;
      this.data = Object.values(this.records[chartField]); // todo: fix hardcoded field name
      this.labels = Object.keys(this.records[chartField]);
    },
  },
  async mounted() {
    await this.getData();
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: this.chart.meta.chartFields[0].label,
            // label: this.labels,
            // data: Object.values(this.data),
            data: this.data,
            backgroundColor: 'transparent',
            borderColor: 'rgba(1, 116, 188, 0.50)',
            pointBackgroundColor: 'rgba(171, 71, 188, 1)',
          },
          // // todo : the 2nd dataSet is for testing purposes, delete when done testing
          // {
          //   label: 'Data 2',
          //
          //   data: [25, 35, 76, 87],
          //   backgroundColor: 'transparent',
          //   borderColor: 'rgba(1, 255, 42, 0.50)',
          //   pointBackgroundColor: 'rgba(225, 0, 0, 1)',
          // },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            }],
        },
      },
    );
  },
};
</script>
