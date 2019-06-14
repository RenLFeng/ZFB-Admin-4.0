<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChange">
      <!-- <i class="el-icon-menu"></i> -->
      <img src="../assets/img/logo-icon.png" alt class="logoIcon">
    </div>
    <div class="logo">{{headTitle}}</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <i class="el-icon-bell"></i>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../assets/img/img.jpg">
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <change-password v-if="showPd" :toshowPd="showPd" @showchangpw="showchangpw"></change-password>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import actionKeys from '../store/actionKeys.js'
import stateKeys from '../store/stateKeys.js'
import storageKeys from '../store/storageKeys.js'
import { post } from '../store/requestFacade.js'
import { createNavigator } from '../navigator.js'
import changePassword from './changePassword'
import { getDataFormlocalStorage } from '../util'
export default {
  components: {
    changePassword
  },
  data() {
    return {
      fullscreen: false,
      name: '',
      message: 0,
      showPd: false,
      headTitle: '智付宝管理平台'
    }
  },
  computed: {
    ...mapState([stateKeys.MENU_VISIBILITY]),
    username() {
      let username = localStorage.getItem('username')
      return username || this.name
    }
  },
  methods: {
    ...mapActions([actionKeys.TOGGLE_MENU]),
    // 用户名下拉菜单选择事件
    async handleCommand(command) {
      if (command === 'loginout') {
        try {
          await post({
            url: 'logout'
          })
          localStorage.removeItem(storageKeys.MENUS)
          localStorage.removeItem(storageKeys.TOKEN)
          localStorage.removeItem(storageKeys.LEVEL)
          localStorage.removeItem('username')
          createNavigator(this).goLogin()
        } catch (error) {
          console.log(error)
        }
      } else if (command === 'changePassword') {
        this.showPd = true
      }
    },
    // 修改密码
    showchangpw() {
      this.showPd = false
    },
    // 侧边栏折叠
    collapseChange() {
      this[actionKeys.TOGGLE_MENU]()
    }
  },
  mounted() {
    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
    if (process.env.NODE_ENV !== 'production') {
      const level = Number(getDataFormlocalStorage('level'))
      const levelName =
        level === 1 ? '平台' : level === 2 ? '分公司' : level === 3 ? '子公司' : '高级合伙人'
      this.headTitle = `智付宝管理平台【${process.env.NODE_ENV}】【${
        process.env.VUE_APP_HOST
      }】【 ${levelName} 】`
    }
  }
}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background-color: #20a0ff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 100%;
}
.collapse-btn:hover {
  background-color: #20a0ff;
}
.header .logo {
  float: left;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.logoIcon {
  width: 32px;
  height: 32px;
}
</style>
