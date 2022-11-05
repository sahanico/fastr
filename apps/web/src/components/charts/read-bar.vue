<script>
import { Bar } from 'vue-chartjs';

export default {
  name: 'read-bar',
  // props: ['labels', 'data', 'chartData', 'options'],
  props: ['name', 'obj'],
  extends: Bar,
  data() {
    return {
      data: [],
      labels: [],
      records: [],
      chart: [],
      title: '',
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
      this.data = Object.values(this.records[chartField]);
      this.labels = Object.keys(this.records[chartField]);
      this.title = this.chart.label;
    },
  },
  async created() {
    await this.getData();
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: 'Devices',
            backgroundColor: '#f87979',
            // // data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
            // data: Object.values(this.data),
            data: this.data,
          },
          // todo : the 2nd dataSet is for testing purposes, delete when done testing
          // {
          //   label: 'Data two',
          //   backgroundColor: 'cornflowerblue',
          //   // // data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
          //   // data: Object.values(this.data),
          //   data: [25, 35, 10],
          // },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          // yAxes: [{
          //   ticks: {
          //     min: 0,
          //     max: 300,
          //     stepSize: 100,
          //     reverse: false,
          //     beginAtZero: true
          //   }
          // }]
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                min: 0,
              },
            }],
        },
      },
    );
  },
};
</script>

