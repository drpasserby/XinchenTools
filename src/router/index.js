import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Page from '../views/Page.vue'
import Admin from '../views/Admin.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About},
  { path: '/page', name: 'Page', component: Page},
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/login', name: 'Login', component: Login }
]

const router = createRouter({
  history: createWebHistory('/tools2/'),
  routes
})


export default router