<template>
  <div>
    <div v-if="hasChildren">
      <el-submenu :index="index">
        <div slot="title">
          <i :class="menu.icon"></i><span v-if="!showMenu" class="menuTxt" slot="title">{{ menu.name }}</span>
        </div>
        <div v-for="(subMenu, index) in menu.children" :key="index">
          <yxj-menu :menu="subMenu" :level="nextLevel" :index="index+'' "></yxj-menu>
          <!-- <div v-if="hasChildren">
            <el-submenu :index="index">
              <div slot="title">
                <i :class="menu.icon"></i><span v-if="!showMenu" class="menuTxt" slot="title">{{ menu.name }}</span>
              </div>
            </el-submenu>
          </div> -->
        </div>
      </el-submenu>
    </div>
    <div v-else>
        <el-menu-item
          :index="menu.route">
          <i :class="menu.icon"></i><span slot="title">{{ menu.name }}</span>
        </el-menu-item>
    </div>
  </div>
</template>

<script>
import stateKeys from '../store/stateKeys.js'
import Menu from '@/store/Menu.js'
import { mapState } from 'vuex'
/**
 * 该组件本身是一个菜单项，内部可以递归展示菜单项
 */
export default {
  name: 'yxj-menu',
  props: {
    level: {
      type: Number,
      default: () => 0
    },
    menu: {
      type: Menu,
      default: () => null
    },
    index: {
      type: String,
      default: () => '0'
    }
  },
  computed: {
    ...mapState([stateKeys.MENU_VISIBILITY, stateKeys.MENUS]),
    showMenu() {
      return this[stateKeys.MENU_VISIBILITY]
    },
    hasChildren() {
      return this.menu.children && this.menu.children.length
    },
    nextLevel() {
      return this.level + 1
    }
  }
}
</script>

<style scoped>
</style>
