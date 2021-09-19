import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index'
import * as echarts from 'echarts'
import axios from 'axios'
import 'echarts/theme/vintage'
import 'echarts/theme/dark'
import './assets/font/iconfont.css'
import './assets/css/base.css'

axios.defaults.baseURL = 'http://localhost:8888/api';

let app = createApp(App);
app.config.globalProperties.$echarts = echarts;
app.config.globalProperties.$axios = axios;
app.use(router).use(echarts).use(store).mount('#app');