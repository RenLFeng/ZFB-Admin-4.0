import Vue from 'vue'

Vue.directive('forceInput', {
  bind(el) {
    // el.style.border = '1px red solid'
    el.innerHTML = `*` + el.innerHTML
  }
})
