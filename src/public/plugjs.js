import axios from 'axios'

if (process.env.NODE_ENV === 'production') {
  console.log('process.env.VUE_APP_HOST: ', process.env.VUE_APP_HOST)
  axios.defaults.baseURL = process.env.VUE_APP_HOST
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
export default {
  install: function(Vue) {
    Object.defineProperty(Vue.prototype, '$axios', { value: axios })
  }
}
