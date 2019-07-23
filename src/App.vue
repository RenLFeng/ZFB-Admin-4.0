<template>
 <a-locale-provider :locale="locale">
    <div id="app">
        <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>

import storageKeys from './store/storageKeys.js'
import actionKeys from './store/actionKeys.js'
import { createNavigator } from './navigator.js'
// import { platform, provincialLevel, oneStage } from './router/pages.js'
import stateKeys from './store/stateKeys.js'
import { mapState, mapActions } from 'vuex'
import { init } from '../src/store/requestFacade'



import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

function tap(x) {
  return x
}
export default {
  data() {
    return {
      locale: zhCN,
      currentVersion: '8.0',
      newVersion: '8.0'
    }
  },
  computed: {
    ...mapState([stateKeys.MENUS])
  },
  methods: {
    ...mapActions([actionKeys.SET_MENUS]),
    // navToHome() {
    //   const { route } = this[stateKeys.MENUS].find(
    //     ({ route }) =>
    //       [platform, provincialLevel, oneStage].findIndex(
    //         ({ path }) => path.replace('/', '') === route
    //       ) !== -1
    //   )
    //   createNavigator(this).goHome({
    //     dest: route
    //   })
    // }
  },
  mounted() {
    init({
      navigator: createNavigator(this),
      tips: this.$message
    })
    if (localStorage.getItem(tap(storageKeys.MENUS))) {
      this[actionKeys.SET_MENUS](JSON.parse(localStorage.getItem(storageKeys.MENUS)))
      // this.navToHome()
    } else {
      createNavigator(this).goLogin()
    }
    // 版本
    if (!localStorage.getItem('versions')) {
      localStorage.setItem('versions', this.currentVersion)
    } else if (localStorage.getItem('versions') !== this.newVersion) {
      // localStorage.removeItem(storageKeys.MENUS)
      // localStorage.removeItem(storageKeys.TOKEN)
      // localStorage.removeItem(storageKeys.LEVEL)
      localStorage.clear()
      createNavigator(this).goLogin()
      localStorage.setItem('versions', this.newVersion)
    }
  }
}
</script>

<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
