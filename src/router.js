import { createRouter, createWebHistory } from 'vue-router';
import Search from './components/Search.vue';
import RateLimit from './components/RateLimit.vue';
import MacTable from './components/MacTable.vue';
import PortStatus from './components/PortStatus.vue';
import PortTraffic from './components/PortTraffic.vue';
// import History from './components/History.vue';
import LostMonitor from './components/LostMonitor.vue';
import ClientLimit from './components/ClientLimit.vue';

const routes = [
  { path: '/search', component: Search },
  { path: '/rate-limit', component: RateLimit },
  { path: '/mac-table', component: MacTable },
  { path: '/port-status', component: PortStatus },
  { path: '/port-traffic', component: PortTraffic },
  // { path: '/history', component: History },
  { path: '/lost-monitor', component: LostMonitor },
  { path: '/client-limit', component: ClientLimit },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
