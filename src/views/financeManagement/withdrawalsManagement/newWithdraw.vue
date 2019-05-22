<template>
  <div>
    <el-dialog
      width="25%"
      title="新增提现"
      :visible="true"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <el-form
        label-width="80px"
        size="small"
        :model="selectedOrgan"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item
          label="选择机构"
          prop="organ"
        >
          <el-select
            v-model="selectedOrgan.organ"
            filterable
            placeholder="请选择"
            @change="getRelatedInfo(selectedOrgan.organ)"
          >
            <el-option
              v-for="item in organOption"
              :key="item.organId"
              :label="item.organName+'('+item.useraccount+')'"
              :value="item.organId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户余额">
          <span>{{selectedOrgan.balance|normAmount}} 元</span>
        </el-form-item>
        <el-form-item label="储蓄卡">
          <span>{{selectedOrgan.btName}}</span>
        </el-form-item>
        <el-form-item label="收款人">
          <span>{{selectedOrgan.payee}}</span>
        </el-form-item>
        <el-form-item
          label="提现金额"
          prop="withdrawAmt"
        >
          <el-input
            clearable
            v-model="selectedOrgan.withdrawAmt"
            style="width:215px"
            type="number"
          ></el-input>
          <el-button
            type="primary"
            plain
            @click="getAll"
            style="position:absolute;right:35px"
          >全部提现</el-button>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="close">取 消</el-button>
        <el-button
          type="primary"
          @click="toWithdraw('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  data() {
    const checkAmt = (rule, value, callback) => {
      console.log(Number(value))
      console.log(Number(this.selectedOrgan.withdrawAmt))
      if (value === '') {
        callback(new Error('请输入提现金额'))
      } else if (value > this.selectedOrgan.balance || this.selectedOrgan.balance === 0) {
        callback(new Error('账户余额不足'))
      } else if (Number(value) < 100) {
        callback(new Error('提现金额需100元以上'))
      } else {
        callback()
      }
    }
    return {
      organOption: [],
      selectedOrgan: {
        organ: '',
        balance: '',
        btName: '',
        payee: '',
        withdrawAmt: ''
      },
      rules: {
        organ: [{ required: true, message: '请选择机构', trigger: 'change' }],
        withdrawAmt: [{ required: true, validator: checkAmt, trigger: 'blur' }]
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    getRelatedInfo(id) {
      if (this.selectedOrgan.withdrawAmt) {
        this.selectedOrgan.withdrawAmt = ''
      }
      for (let i = 0; i < this.organOption.length; i++) {
        if (this.organOption[i].organId === id) {
          Object.keys(this.organOption[i]).forEach(key => {
            this.$set(this.selectedOrgan, key, this.organOption[i][key])
          })
        }
      }
    },
    getAll() {
      if (this.selectedOrgan.balance) {
        this.selectedOrgan.withdrawAmt = this.selectedOrgan.balance
      }
    },
    toWithdraw(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.withdraw()
        } else {
          return false
        }
      })
    },
    async withdraw() {
      try {
        const res = await post({
          url: 'withdraw/add',
          data: {
            organId: this.selectedOrgan.organId,
            withdrawAmt: this.selectedOrgan.withdrawAmt
          }
        })
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$emit('fresh')
      } catch (err) {
        console.log(err)
      }
    },
    // 机构列表
    async getOrganList() {
      try {
        const res = await post({
          url: 'withdraw/getOrganList'
        })
        this.organOption = res.data
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.getOrganList()
  }
}
</script>

