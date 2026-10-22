import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Page from '../views/Page.vue'
import Admin from '../views/Admin.vue'
import Login from '../views/Login.vue'
import api from '../api/client'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About},
  { path: '/page', name: 'Page', component: Page},
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresRoot: true } },
  { path: '/login', name: 'Login', component: Login }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresRoot) return true
  try {
    const res = await api.get('/auth/session')
    if (res.data?.data?.type === 'root') return true
  } catch (error) {
    // 未登录或网络异常都回到登录页
  }
  return { path: '/login', query: { redirect: to.fullPath } }
})

export default router
