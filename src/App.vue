<template>
  <div id="app">
    <NavBar/>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
  },
  methods: {
    handleLoginSuccess() {
      this.isLoggedIn = true;
      // You might want to fetch user info or other data here
    },
    async logout() {
      try {
        await axios.post('http://127.0.0.1:8000/user/logout');
        this.isLoggedIn = false;
        this.username = '';
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  }
};
</script>

<style>
.container {
  max-width: 800px;
  margin: 50px auto;
  text-align: center;
}
</style>
