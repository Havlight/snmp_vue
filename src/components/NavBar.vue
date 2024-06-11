<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Network Management</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="page in pages" :key="page">
            <router-link class="nav-link" :to="`/${page}`">{{ page }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      pages: [
        'login',
        'search',
        'rate-limit',
        'mac-table',
        'port-status',
        'port-traffic',
        // 'history',
        'lost-monitor',
        'client-limit'
      ]
    };
  }
};
</script>

<style>
.navbar {
  margin-bottom: 20px;
}
</style>
