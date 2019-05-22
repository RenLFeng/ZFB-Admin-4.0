<template>
  <el-dialog title="修改密码" :visible.sync="showchangePw" width="30%" :before-close="handleClose">
    <el-form :model="changePasswd" ref="pwdForm" :rules="rules">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model="changePasswd.oldPassword"
          type="password"
          maxlength="16"
          style="width:300px"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="changePasswd.newPassword"
          type="password"
          maxlength="16"
          style="width:300px"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="changePasswd.confirmPassword"
          type="password"
          maxlength="16"
          style="width:300px"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="clean">取 消</el-button>
      <el-button type="primary" @click="updatePwdBtn('pwdForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { post } from '../store/requestFacade.js'
import storageKeys from '../store/storageKeys.js'
import { createNavigator } from '../navigator.js'
export default {
  name: 'change-password',
  props: {
    toshowPd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showchangePw: false,
      changePasswd: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }]
      }
    }
  },
  computed: {
    confirmPwdValid() {
      return this.changePasswd.newPassword !== this.changePasswd.confirmPassword
    }
  },
  methods: {
    clean() {
      this.$emit('showchangpw', this.showchangePw)
    },
    handleClose() {
      this.$emit('showchangpw', this.showchangePw)
    },
    // 点击确定
    updatePwdBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.confirmPwdValid) {
            this.$message({
              message: '确认密码与新不一致',
              type: 'error'
            })
          } else {
            this.updatePwd()
          }
        } else {
          return false
        }
      })
    },
    // 修改密码接口
    async updatePwd() {
      try {
        const res = await post({
          url: 'permissionManager/userEditPassword',
          data: {
            oldPassword: this.changePasswd.oldPassword,
            newPassword: this.changePasswd.newPassword
          }
        })
        this.$message({
          message: res.msg,
          type: 'success'
        })
        setTimeout(() => {
          this.loginout()
        }, 3000)
      } catch (err) {
        console.log(err)
      }
    },
    // 退出登录
    async loginout() {
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
    }
  },
  mounted() {
    this.showchangePw = this.toshowPd
  }
}
</script>
<style scoped>
</style>
