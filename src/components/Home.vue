<!-- src/components/Home.vue -->
<template>
  <div>
    <h2>Welcome, {{ username }}!</h2>
    <button @click="logout" class="btn btn-danger">Logout</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  props: ['username'],
  methods: {
    async logout() {
      try {
        await axios.post('http://127.0.0.1:8000/user/logout');
        this.$router.push('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 50px auto;
  text-align: center;
}
</style>
