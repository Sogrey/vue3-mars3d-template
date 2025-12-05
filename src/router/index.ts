import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/index.vue'

const router = createRouter({
  history: createWebHistory('/vue3-mars3d-template/'),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
    },
  ],
})

export default router
