
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Sales from '../views/Sales.vue'
import Statistics from '../views/Statistics.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/dashboard', component: Dashboard, name: 'Dashboard' },
  { path: '/ventas', component: Sales, name: 'Sales' },
  { path: '/estadisticas', component: Statistics, name: 'Statistics' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router