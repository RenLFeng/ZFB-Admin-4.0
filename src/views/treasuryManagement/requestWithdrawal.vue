<template>
  <el-dialog
    title="提现申请"
    :visible.sync="requestWithdrawShow"
    width="30%"
    :before-close="requestWithdrawClose"
  >
    <h2>账户余额：{{balance|normAmount}}</h2>
    <div class="amt">提现金额：
      <el-input
        @input="getWithdrawAmt"
        type="number"
        v-model="ruleForm.withdrawAmt"
        style="width:200px"
        placeholder="请输入提现金额"
        size="small"
      />元
    </div>
    <p
      v-show="noteShow"
      style="text-align:center;padding-right:30px;color:#F56C6C;font-size:12px"
    >{{noteText}}</p>
    <div class="bankCardInfo">
      <p>{{bankCardInfo}}</p>
      <p>账户名：{{userName}}</p>
    </div>
    <div style="margin-left: 115px">
      <p>提现说明：</p>
      <p>单笔提现金不小于100元</p>
      <p>最高提现金额最高5万</p>
      <p>手续费单笔2元</p>
      <p>提现处理成功时，会将打款到代理商绑定的银行卡</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="requestWithdrawClose">取 消</el-button>
      <el-button type="primary" @click="submitWithdraw">提交申请</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { post } from '../../store/requestFacade.js'

export default {
  name: 'request-withdrawal',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    balance: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      noteShow: false,
      noteText: '',
      requestWithdrawShow: false,
      userName: '',
      bankCardInfo: '',
      ruleForm: {
        withdrawAmt: ''
      }
    }
  },
  methods: {
    requestWithdrawClose() {
      this.$emit('requestWithdrawClose')
    },
    async deposit() {
      try {
        const res = await post({
          url: 'withdraw/deposit'
        })
        this.userName = res.data.userName
        this.bankCardInfo = res.data.bankCardInfo
      } catch (error) {
        console.log(error)
      }
    },
    getWithdrawAmt() {
      if (this.ruleForm.withdrawAmt === '') {
        this.noteShow = true
        this.noteText = '请输入提现金额'
      } else if (this.ruleForm.withdrawAmt < 100) {
        this.noteShow = true
        this.noteText = '提现金额不小于100'
      } else if (this.ruleForm.withdrawAmt > 50000) {
        this.noteShow = true
        this.noteText = '最高提现金额最高5万'
      } else {
        this.noteShow = false
      }
    },
    submitWithdraw() {
      if (this.ruleForm.withdrawAmt === '') {
        this.noteShow = true
        this.noteText = '请输入提现金额'
      } else if (!this.noteShow) {
        try {
          post({
            url: 'withdraw/backapply',
            data: {
              withdrawAmt: this.ruleForm.withdrawAmt
            }
          }).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.$emit('requestWithdrawClose')
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  },
  mounted() {
    this.requestWithdrawShow = this.flag
    this.deposit()
  }
}
</script>
<style scoped>
h2 {
  margin-top: -30px;
  text-align: center;
}
.amt {
  margin-top: 20px;
  text-align: center;
}
.bankCardInfo {
  height: 50px;
  width: 300px;
  background-color: #409eff;
  margin: 20px auto;
  color: #fff;
  display: flex;
  justify-content: space-around;
  line-height: 50px;
  font-size: 16px;
  font-weight: bold;
}
</style>
