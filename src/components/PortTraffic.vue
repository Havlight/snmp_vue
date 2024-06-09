<template>
  <div class="container">
    <h1 class="my-4">Port Traffic</h1>
    <div class="table-responsive port-traffic-table">
      <table class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
        <tr>
          <th>Port</th>
          <th>In Rate (bytes/s)</th>
          <th>Out Rate (bytes/s)</th>
          <th>Show Chart</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(entry, index) in portTraffic" :key="index">
          <td>{{ entry.port }}</td>
          <td>{{ entry.in_rate }}</td>
          <td>{{ entry.out_rate }}</td>
          <td>
            <button @click="toggleChart(entry.port)" class="btn btn-primary">
              {{ selectedPort === entry.port ? 'Hide Chart' : 'Show Chart' }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="container">
      <!-- 其他部分保持不變 -->
      <div class="row">
        <div class="col" v-if="selectedPort !== null">
          <h2>Port {{ selectedPort }} inrate</h2>
          <canvas ref="inrateChart"></canvas>
        </div>
        <div class="col" v-if="selectedPort !== null">
          <h2>Port {{ selectedPort }} outrate</h2>
          <canvas ref="outrateChart"></canvas>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'PortTraffic',
  data() {
    return {
      portTraffic: [],
      selectedPort: null,
    };
  },
  methods: {
    async fetchPortTraffic() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/portTraffic/rate');
        this.portTraffic = response.data;
        if (this.selectedPort !== null) {
          this.updateChartData();
        }
      } catch (error) {
        console.error('Error fetching port traffic:', error);
      }
    },
    updateChartData() {
      const selectedPortData = this.portTraffic.find(entry => entry.port === this.selectedPort);
      if (!selectedPortData) return;

      // 更新inrate圖表
      const inrateChartCtx = this.$refs.inrateChart.getContext('2d');
      if (this.inrateChart) {
        // 更新資料
        this.inrateChart.data.labels.push(this.inrateChart.data.labels.length + 1); // 使用索引作為標籤
        this.inrateChart.data.datasets[0].data.push(selectedPortData.in_rate); // 新增新的in_rate資料
        this.inrateChart.update(); // 更新圖表
      } else {
        // 初始化圖表
        this.inrateChart = new Chart(inrateChartCtx, {
          type: 'line',
          data: {
            labels: [1], // 初始標籤
            datasets: [{
              label: 'In Rate (bytes/s)',
              data: [selectedPortData.in_rate], // 初始in_rate資料
              borderColor: 'blue',
              borderWidth: 1
            }]
          }
        });
      }

      // 更新outrate圖表
      const outrateChartCtx = this.$refs.outrateChart.getContext('2d');
      if (this.outrateChart) {
        // 更新資料
        this.outrateChart.data.labels.push(this.outrateChart.data.labels.length + 1); // 使用索引作為標籤
        this.outrateChart.data.datasets[0].data.push(selectedPortData.out_rate); // 新增新的out_rate資料
        this.outrateChart.update(); // 更新圖表
      } else {
        // 初始化圖表
        this.outrateChart = new Chart(outrateChartCtx, {
          type: 'line',
          data: {
            labels: [1], // 初始標籤
            datasets: [{
              label: 'Out Rate (bytes/s)',
              data: [selectedPortData.out_rate], // 初始out_rate資料
              borderColor: 'red',
              borderWidth: 1
            }]
          }
        });
      }
    },
    toggleChart(port) {
      if (this.selectedPort === port) {
        this.selectedPort = null;
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }
      } else {
        this.selectedPort = port;
      }
    },
  },
  mounted() {
    this.fetchPortTraffic();
    this.interval = setInterval(this.fetchPortTraffic, 1000); // 每秒刷新一次数据
  },
  beforeUnmount() {
    clearInterval(this.interval); // 清除定时器
  }
};
</script>

<style scoped>
.port-traffic-table {
  max-width: 80%;
  margin: auto;
}
</style>
