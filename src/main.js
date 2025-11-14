import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'   // 引入中文语言包

import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// axios.defaults.withCredentials = true //设置自动发送cookie

const app = createApp(App).use(router).use(ElementPlus,{locale: zhCn,}).mount('#app')