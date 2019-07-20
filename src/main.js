import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import ElementUI from 'element-ui'
import YxjMenu from '@/components/YxjMenu.vue'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/icon.css'
import axios from 'axios'
import PlugJs from './public/plugjs'
import './components/dynamicImport'
import * as GobalFilters from './public/filters/index'
import 'ant-design-vue/dist/antd.css'
import { from } from '_array-flatten@2.1.2@array-flatten';

import {get,post,postWithFile} from './store/requestFacade';
import Api from './store/Api';
Vue.prototype.get = get; 
Vue.prototype.post = post; 
Vue.prototype.postWithFile = postWithFile; 
Vue.prototype.Api = Api; 
Vue.config.productionTip = false;
Object.keys(GobalFilters).forEach(key => Vue.filter(key, GobalFilters[key]))

axios.interceptors.request.use(
  config => {
    const userToken = localStorage.getItem('token')
    if (userToken) {
      config.headers.token = userToken
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

Vue.use(ElementUI)
Vue.use(PlugJs)
Vue.config.productionTip = false

// 时间戳转换
Vue.filter('cutTime', function(dataTime) {
  if (!dataTime) return ''
  let date = new Date(dataTime)
  let y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? '0' + MM : MM
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let m = date.getMinutes()
  m = m < 10 ? '0' + m : m
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m
})
// 金额转换
Vue.filter('normAmount', function(amount) {
  if (!amount) return '0.00'
  var intPart = amount + ''
  var floatPart = '.00'
  var amountValue = intPart.split('.')
  if (amountValue.length === 2) {
    floatPart = amountValue[1].toString() // 拿到小数部分
    var numPart = amountValue[0].toString() // 拿到整数部分
    if (floatPart.length === 1) {
      // 补0,
      return numPart + '.' + floatPart + '0'
    } else if (floatPart.length > 2) {
      return numPart + '.' + floatPart.slice(0, 2)
    } else {
      return numPart + '.' + floatPart
    }
  }
  return amountValue + floatPart
})
Vue.component(YxjMenu.name, YxjMenu)

new Vue({
  PlugJs,
  router: createRouter(),
  store: createStore(),
  render: h => h(App)
}).$mount('#app')
