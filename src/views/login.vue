<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">智付宝台管理后台</div>
      <el-form
        :model="login"
        :rules="login.rules"
        ref="ruleForm"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="login.username" placeholder="请输入用户名">
            <template slot="prepend">
              <i class="el-icon-lx-denglu"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="login.password"
            @keyup.enter.native="dologin"
          >
            <template slot="prepend">
              <i class="el-icon-lx-mima"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="verification">
          <el-input
            placeholder="请输入验证码"
            v-model="login.verification"
            class="verification"
            @keyup.enter.native="dologin"
          >
            <template slot="prepend">
              <i class="el-icon-lx-yanzhengma"></i>
            </template>
          </el-input>
          <img class="varImg" @click="getVerificationCode()" :src="fullVerificationCode" alt>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="dologin">登录</el-button>
        </div>
        <p align="center" style="color:red;font-size:12px">{{login.msg}}</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import actionKeys from '../store/actionKeys.js'
import storageKeys from '../store/storageKeys.js'
import { createNavigator } from '../navigator.js'
import { platform, provincialLevel, oneStage } from '../router/pages.js'
import { mapActions, mapState } from 'vuex'
import { post } from '../store/requestFacade.js'
import stateKeys from '../store/stateKeys.js'
export default {
  data: function() {
    return {
      login: {
        username: '',
        password: '',
        verification: '',
        verificationCode: '',
        uid: '',
        msg: '',
        rules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          verification: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
        }
      }
    }
  },
  methods: {
    ...mapActions([actionKeys.SET_MENUS, actionKeys.CLEAR_LOGIN]),
    navToHome() {
      const { route } = this[stateKeys.MENUS].find(
        ({ route }) =>
          [platform, provincialLevel, oneStage].findIndex(
            ({ path }) => path.replace('/', '') === route
          ) !== -1
      )
      createNavigator(this).goHome({
        dest: route
      })
    },
    async getVerificationCode() {
      this.login.uid = Math.floor(Math.random() * 10000)
      try {
        const { data } = await post({
          url: 'yzm',
          data: {
            uid: this.login.uid
          }
        })
        this.login.verificationCode = data
      } catch (error) {
        console.log(error)
      }
    },
    async dologin() {
      if (
        this.login.username === '' ||
        this.login.password === '' ||
        this.login.verification === ''
      ) {
        this.$message('请将登录信息填写完整!')
      } else {
        try {
          const res = await post({
            url: 'login',
            data: {
              userAccount: this.login.username,
              userPassword: this.login.password,
              code: this.login.verification,
              uid: this.login.uid
            }
          })
          if (typeof res.data.tree !== 'undefined' && typeof res.data.token !== 'undefined') {
            this[actionKeys.CLEAR_LOGIN]()
            localStorage.setItem(storageKeys.MENUS, JSON.stringify(res.data.tree))
            localStorage.setItem(storageKeys.TOKEN, res.data.token)
            localStorage.setItem(storageKeys.LEVEL, res.data.level)
            localStorage.setItem('username', this.login.username)
            this[actionKeys.SET_MENUS](res.data.tree)
            this.navToHome()
          } else {
            this.$message(res.data)
          }
        } catch (error) {
          this.$message(error.message)
        }
      }
    }
  },
  mounted() {
    this.getVerificationCode()
  },
  computed: {
    fullVerificationCode() {
      return 'data:image/png;base64,' + this.login.verificationCode
    },
    ...mapState([stateKeys.MENUS])
  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.png);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -140px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.verification {
  width: 60%;
}
.varImg {
  float: right;
  height: 40px;
  width: 35%;
  cursor: pointer;
}
</style>
