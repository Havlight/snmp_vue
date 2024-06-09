<template>
  <div class="container">
    <h1 class="my-4">MAC Table</h1>
    <div class="table-responsive mac-table">
      <table class="table table-striped table-bordered table-hover">
        <thead class="table-dark">
          <tr>
            <th>MAC Address</th>
            <th>Port</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in macTable" :key="index" :class="{'table-success': newMacAddresses.includes(entry.mac)}">
            <td>{{ entry.mac }}</td>
            <td>{{ entry.port }}</td>
            <td>{{ entry.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="newMacAddresses.length > 0" class="alert alert-info mt-4">
      <h4>New MAC Addresses Detected:</h4>
      <ul>
        <li v-for="mac in newMacAddresses" :key="mac">
          {{ mac }}
          <button class="btn btn-sm btn-danger ms-2" @click="removeMacAddress(mac)">Remove</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MacTable',
  data() {
    return {
      macTable: [],
      newMacAddresses: [],
      previousMacTable: []
    };
  },
  methods: {
    async fetchMacTable() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/mac/macTable');
        this.previousMacTable = this.macTable.map(entry => entry.mac); // 保存之前的MAC表
        this.macTable = response.data;
        this.checkForNewMacAddresses();
      } catch (error) {
        console.error('Error fetching MAC table:', error);
      }
    },
    checkForNewMacAddresses() {
      const currentMacAddresses = this.macTable.map(entry => entry.mac);
      this.newMacAddresses = currentMacAddresses.filter(mac => !this.previousMacTable.includes(mac));
    },
    removeMacAddress(mac) {
      this.newMacAddresses = this.newMacAddresses.filter(address => address !== mac);
    }
  },
  mounted() {
    this.fetchMacTable();
    this.interval = setInterval(this.fetchMacTable, 5000); // 每5秒刷新一次数据
  },
  beforeUnmount() {
    clearInterval(this.interval); // 清除定时器
  }
};
</script>

<style scoped>
.mac-table {
  max-width: 70%;
  margin: auto;
}
.table-success {
  background-color: #d4edda;
}
</style>
