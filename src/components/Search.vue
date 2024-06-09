<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">OID Search</h2>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-md-8">
            <input v-model="oid" placeholder="Enter OID" class="form-control" />
          </div>
          <div class="col-md-4">
            <div class="d-flex justify-content-around">
              <button @click="searchWalk" class="btn btn-primary">Walk</button>
              <button @click="searchGet" class="btn btn-secondary">Get</button>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-4">
            <input v-model.number="begin" placeholder="Begin" class="form-control" />
          </div>
          <div class="col-md-4">
            <input v-model.number="end" placeholder="End" class="form-control" />
          </div>
          <div class="col-md-4 d-flex justify-content-around">
            <button @click="searchTable" class="btn btn-success">Search Table</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
    <div v-if="searchResult.length" class="mt-4">
      <h3 class="text-center mb-3">Search Results</h3>
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>OID</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in searchResult" :key="index">
            <td>{{ item.oid }}</td>
            <td>{{ item.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Search',
  setup() {
    const oid = ref('');
    const begin = ref(1);
    const end = ref(5);
    const searchResult = ref([]);
    const errorMessage = ref('');

    const searchWalk = async () => {
      try {
        errorMessage.value = '';
        const response = await axios.get(`http://127.0.0.1:8000/api/search/walk/${oid.value}`);
        searchResult.value = response.data;
      } catch (error) {
        errorMessage.value = 'Not found';
        console.error('Error fetching Walk data:', error);
      }
    };

    const searchGet = async () => {
      try {
        errorMessage.value = '';
        const response = await axios.get(`http://127.0.0.1:8000/api/search/get/${oid.value}`);
        searchResult.value = [response.data];
      } catch (error) {
        errorMessage.value = 'Not found';
        console.error('Error fetching Get data:', error);
      }
    };

    const searchTable = async () => {
      try {
        errorMessage.value = '';
        const response = await axios.get(`http://127.0.0.1:8000/api/search/table/${oid.value}/${begin.value}/${end.value}`);
        searchResult.value = response.data.flat();
      } catch (error) {
        errorMessage.value = 'Not found';
        console.error('Error fetching Table data:', error);
      }
    };

    return {
      oid,
      begin,
      end,
      searchResult,
      errorMessage,
      searchWalk,
      searchGet,
      searchTable,
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
.card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.btn {
  width: 100%;
  margin: 5px 0;
}
.table {
  margin-top: 20px;
}
</style>
