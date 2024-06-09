<template>
  <div>
    <h2>Rate Limit Global State</h2>
    <table class="table table-bordered table-striped">
      <thead>
      <tr>
        <th>Global State</th>
        <th>Toggle State</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{ globalState }}</td>
        <td>
          <button @click="toggleGlobalState" class="btn btn-primary">
            Toggle State
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <h2>Port Rate Limit Table</h2>
    <table class="table table-bordered table-striped">
      <thead>
      <tr>
        <th>Port</th>
        <th>State</th>
        <th>In Rate</th>
        <th>Out Rate</th>
        <th>Toggle State</th>
        <th>Change In Rate</th>
        <th>Change Out Rate</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(port, index) in portTable" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ port.state }}</td>
        <td>{{ port.inRate }}</td>
        <td>{{ port.outRate }}</td>
        <td>
          <button @click="togglePortState(index + 1, port.state)" class="btn btn-primary">
            Toggle State
          </button>
        </td>
        <td>
          <input v-model="inRates[index]" placeholder="Enter new in rate"/>
          <button @click="changeInRate(index + 1, inRates[index])" class="btn btn-secondary">
            Set In Rate
          </button>
        </td>
        <td>
          <input v-model="outRates[index]" placeholder="Enter new out rate"/>
          <button @click="changeOutRate(index + 1, outRates[index])" class="btn btn-secondary">
            Set Out Rate
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import {ref, onMounted, onUnmounted} from 'vue';

export default {
  name: 'RateLimit',
  setup() {
    const globalState = ref(null);
    const portTable = ref([]);
    const inRates = ref([]);
    const outRates = ref([]);

    const fetchGlobalState = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/portLimit/globalState');
        globalState.value = response.data.value;
      } catch (error) {
        console.error('Error fetching global state:', error);
      }
    };

    const fetchPortTable = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/portLimit/table');
        portTable.value = response.data.map((port) => ({
          state: port[0].value,
          inRate: port[1].value,
          outRate: port[2].value,
        }));
        inRates.value = portTable.value.map(port => port.inRate);
        outRates.value = portTable.value.map(port => port.outRate);
      } catch (error) {
        console.error('Error fetching port table:', error);
      }
    };

    const toggleGlobalState = async () => {
      try {
        const newValue = globalState.value === "1" ? "2" : "1";
        await axios.put(`http://127.0.0.1:8000/api/portLimit/globalState/${newValue}`);
        await fetchGlobalState();
      } catch (error) {
        console.error('Error toggling global state:', error);
      }
    };

    const togglePortState = async (port, currentState) => {
      try {
        const newValue = currentState === "1" ? "2" : "1";
        await axios.put(`http://127.0.0.1:8000/api/portLimit/table/${port}/${newValue}`);
        await fetchPortTable();
      } catch (error) {
        console.error(`Error toggling state for port ${port}:`, error);
      }
    };

    const changeInRate = async (port, newRate) => {
      try {
        alert(newRate)
        await axios.put(`http://127.0.0.1:8000/api/portLimit/inRate/${port}/${newRate}`);
        await fetchPortTable();
      } catch (error) {
        console.error(`Error changing in rate for port ${port}:`, error);
      }
    };

    const changeOutRate = async (port, newRate) => {
      try {
        alert(newRate)
        await axios.put(`http://127.0.0.1:8000/api/portLimit/outRate/${port}/${newRate}`);
        await fetchPortTable();
      } catch (error) {
        console.error(`Error changing out rate for port ${port}:`, error);
      }
    };

    onMounted(() => {
      fetchGlobalState();
      fetchPortTable();
      const interval = setInterval(() => {
        fetchGlobalState();
        fetchPortTable();
      }, 3000);
      onUnmounted(() => clearInterval(interval));
    });

    return {
      globalState,
      portTable,
      inRates,
      outRates,
      toggleGlobalState,
      togglePortState,
      changeInRate,
      changeOutRate,
    };
  }
};
</script>

<style scoped>
.table {
  width: 80%;
  margin: auto;
  margin-bottom: 20px;
}
</style>
