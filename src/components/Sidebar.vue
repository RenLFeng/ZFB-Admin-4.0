<template>
  <div class="sidebar">
    <el-menu
      :default-active="onRoutes"
      :collapse="showMenu"
      class="vertical-menu"
      unique-opened
      router
    >
      <div>
        <section v-for="(L1, code) in menuList" :key="code">
          <el-menu-item :index="L1.route" v-if="L1.children.length==0">
            <i :class="L1.icon"></i>
            <span slot="title">{{L1.name}}</span>
          </el-menu-item>
          <el-submenu :index="L1.route" v-else>
            <template slot="title">
              <i :class="L1.icon"></i>
              <span slot="title">{{L1.name}}</span>
            </template>
            <section :index="L2.route" v-for="(L2,code) in L1.children" :key="code">
              <el-menu-item :index="L2.route" v-if="L2.children.length==0">{{L2.name}}</el-menu-item>
              <el-submenu :index="L2.route" v-else>
                <span slot="title">{{L2.name}}</span>
                <el-menu-item
                  :index="L3.route"
                  v-for="(L3,code) in L2.children"
                  :key="code"
                >{{L3.name}}</el-menu-item>
              </el-submenu>
            </section>
          </el-submenu>
        </section>
      </div>
    </el-menu>
  </div>
</template>

<script>
import stateKeys from '../store/stateKeys.js'
import { parseJSON } from '../util'
import YxjMenu from '@/components/YxjMenu.vue'
import { mapState } from 'vuex'
import Menu from '../store/Menu'
export default {
  components: {
    YxjMenu
  },
  data() {
    return {
      isCollapse: true
    }
  },
  computed: {
    ...mapState([stateKeys.MENU_VISIBILITY, stateKeys.MENUS]),
    showMenu() {
      return this[stateKeys.MENU_VISIBILITY]
    },
    onRoutes() {
      return this.$route.path.replace('/', '')
    },
    menuList() {
      const rawMenu = Menu.buildFromArray(parseJSON(localStorage.getItem('yxjmenu'))).filter(
        Boolean
      )
      const indexPage = rawMenu.filter(v => v.name === '首页')
      const rest = rawMenu.filter(v => v.name !== '首页')
      const menu = [...indexPage, ...rest]
      return menu
    },
    levelOneMenu() {
      return this.menuList.filter(v => v.children.length === 0)
    }
  },
  mounted() {}
}
</script>

<style>
.sidebar > ul {
  height: 100%;
  overflow-y: scroll;
}
.sidebar > ul::-webkit-scrollbar {
  width: 0px;
}

.vertical-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu--collapse .el-submenu__icon-arrow {
  opacity: 0;
}

.el-menu--collapse .el-submenu__title > span {
  opacity: 0;
}
</style>
