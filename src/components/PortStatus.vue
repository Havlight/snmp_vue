<template>
  <div class="container">
    <h1 class="my-4">Port Status</h1>
    <div class="table-responsive port-status-table">
      <table class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>Port</th>
            <th>Status</th>
            <th>Expected Status</th>
            <th>Toggle Expected Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in portStatus" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ entry.value }}</td>
            <td>{{ expectedPortStatus[index]?.value }}</td>
            <td>
              <button
                class="btn btn-primary"
                @click="toggleExpectedStatus(index + 1, expectedPortStatus[index]?.value)">
                Toggle
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PortStatus',
  data() {
    return {
      portStatus: [],
      expectedPortStatus: [],
    };
  },
  methods: {
    async fetchPortStatus() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/portStatus/State');
        this.portStatus = response.data;
      } catch (error) {
        console.error('Error fetching port status:', error);
      }
    },
    async fetchExpectedPortStatus() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/portStatus/expectedState');
        this.expectedPortStatus = response.data;
      } catch (error) {
        console.error('Error fetching expected port status:', error);
      }
    },
    async fetchAllPortStatus() {
      await this.fetchPortStatus();
      await this.fetchExpectedPortStatus();
    },
    async toggleExpectedStatus(port, currentStatus) {
      const newStatus = currentStatus == 1 ? 2 : 1;
      try {
        await axios.put(`http://127.0.0.1:8000/api/portStatus/expectedState/${port}/${newStatus}`);
        this.fetchExpectedPortStatus();
      } catch (error) {
        console.error('Error toggling expected status:', error);
      }
    }
  },
  mounted() {
    this.fetchAllPortStatus();
    this.interval = setInterval(this.fetchAllPortStatus, 5000); // 每5秒刷新一次数据
  },
  beforeUnmount() {
    clearInterval(this.interval); // 清除定时器
  }
};
</script>

<style scoped>
.port-status-table {
  max-width: 80%;
  margin: auto;
}
</style>
