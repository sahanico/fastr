<script>
import { Pie } from 'vue-chartjs';

export default {
  name: 'read-pie',
  extends: Pie,
  props: ['name', 'obj', 'chart'],
  data() {
    return {
      data: [],
      labels: [],
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

    const recordLength = this.data.length;
    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const newBackColor = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < recordLength; i++) {
      newBackColor.push(randomColor());
    }
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            backgroundColor: newBackColor,
            data: this.data,
          },
        ],
      },
      {
        legend: {
          position: 'bottom',
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    );
  },
};
</script>
