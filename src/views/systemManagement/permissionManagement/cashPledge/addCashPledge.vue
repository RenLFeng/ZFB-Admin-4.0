<template>
  <div>
    <div class="backBtn">
      <el-button plain icon="el-icon-arrow-left" @click="goBack">返回</el-button>
      <el-button plain type="primary" @click="submitForm('ruleForm')">保存配置</el-button>
    </div>
    <el-tag>基本信息</el-tag>
    <el-form :model="addCashPledgeData" :rules="rules" ref="ruleForm" label-width="135px" inline>
      <el-form-item label="设备型号" prop="brandId">
        <el-select v-model="addCashPledgeData.brandId" placeholder="选择设备型号">
          <el-option
            v-for="item in ModelData"
            :key="item.brandId"
            :label="item.brandSubName"
            :value="item.brandId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="addCashPledgeData.ruleName"></el-input>
      </el-form-item>
      <el-form-item label="服务费" prop="depositAmt">
        <el-input type="number" v-model="addCashPledgeData.depositAmt"></el-input>
      </el-form-item>
      <el-form-item>元</el-form-item>
      <el-form-item label="累计还款" prop="totalTradeAmt">
        <el-input type="number" v-model="addCashPledgeData.totalTradeAmt"></el-input>
      </el-form-item>
      <el-form-item>万</el-form-item>
      <el-form-item label="活动期限" prop="depositCycle">
        <el-input type="number" v-model="addCashPledgeData.depositCycle"></el-input>
      </el-form-item>
      <el-form-item>天</el-form-item>
      <el-row class="expand" :gutter="20">
        <el-col :span="12">
          <el-tag>活动阶段</el-tag>
          <div v-for="(v,i) in addCashPledgeData.depositStagePO" :key="i">
            <el-form-item :label="v.label+(i+1)" prop="depositStagePO">
              <el-input type="number" v-model="v.totalTradeAmt" @blur="estimate(v.totalTradeAmt,i)"></el-input>
              <p class="error">{{v.errText}}</p>
            </el-form-item>
            <el-form-item>万</el-form-item>

            <el-form-item label="返现金额">
              <el-input type="number" v-model="v.returnAmt"></el-input>
            </el-form-item>
            <el-form-item>元</el-form-item>
            <el-form-item v-if="i === addCashPledgeData.depositStagePO.length - 1">
              <el-button type="text" icon="el-icon-delete" @click="DelDeposit"></el-button>
            </el-form-item>
          </div>
          <p style="textAlign: center;margin:20px 0">
            <el-button plain icon="el-icon-plus" size="small" @click="addDeposit">添加</el-button>
          </p>
        </el-col>
        <el-col :span="12">
          <el-tag>活动分润扣除规则</el-tag>
          <br>
          <el-form-item label="活动分润扣除总额" prop="feeSum">
            <span>万</span>
            <el-input type="number" v-model="addCashPledgeData.feeSum" style="width: 150px"></el-input>
          </el-form-item>
          <br>
          <el-tag>活动分润扣除分配规则</el-tag>
          <br>
          <el-form-item
            :label="v.label"
            v-for="(v,i) in addCashPledgeData.depositDeductPO"
            :key="i"
            prop="depositDeductPO"
          >
            <span>万</span>
            <el-input type="number" v-model="v.deductPercent" style="width: 150px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { post, postJOSN } from '../../../../store/requestFacade.js'
const feeMap = {
  2: '分公司还款分润',
  3: '一级还款分润',
  5: '合伙人还款分润',
  9: '二级还款分润'
}
export default {
  name: 'add-cash-pledge',
  props: {
    cashPledgedetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const checkStockNumber = (rule, value, callback) => {
      value = Number(value)
      if (!value) {
        return callback(new Error('请输入累计还款金额'))
      } else if (!Number.isInteger(value) || value < 1) {
        callback(new Error('累计还款金额只能为正整数'))
      } else {
        callback()
      }
    }
    const depositCycleNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入活动期限'))
      } else if (value.length > 4) {
        callback(new Error('活动期限长度最多为4'))
      } else {
        callback()
      }
    }
    return {
      ModelData: [],
      addCashPledgeData: {
        brandId: '',
        ruleName: '',
        depositAmt: '',
        totalTradeAmt: '',
        depositCycle: '',
        feeSum: '',
        depositStagePO: [
          { label: '累计还款阶段', totalTradeAmt: null, returnAmt: null, errText: '' },
          { label: '累计还款阶段', totalTradeAmt: null, returnAmt: null, errText: '' },
          { label: '累计还款阶段', totalTradeAmt: null, returnAmt: null, errText: '' }
        ],
        depositDeductPO: [
          { label: '分公司还款分润', organLevel: 2, deductPercent: null },
          { label: '一级还款分润', organLevel: 3, deductPercent: null },
          { label: '二级还款分润', organLevel: 9, deductPercent: null },
          { label: '合伙人还款分润', organLevel: 5, deductPercent: null }
        ]
      },
      rules: {
        brandId: { required: true, message: '请选择设备型号', trigger: 'change' },
        ruleName: { required: true, message: '请输入规则名称', trigger: 'blur' },
        depositAmt: { required: true, message: '请输入活动金额', trigger: 'blur' },
        totalTradeAmt: { required: true, validator: checkStockNumber, trigger: 'blur' },
        depositCycle: { required: true, validator: depositCycleNumber, trigger: 'blur' },
        feeSum: { required: true, message: '请输入活动分润扣除总额', trigger: 'blur' },
        depositStagePO: { required: true, message: '请输入累计还款金额', trigger: 'blur' },
        depositDeductPO: { required: true, message: '请输入活动分配规则', trigger: 'blur' }
      }
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    async getModel() {
      try {
        const res = await post({
          url: 'posBrand/queryBrand'
        })
        this.ModelData = res.data.rows
      } catch (err) {
        console.log(err)
      }
    },
    estimate(value, i) {
      value = Number(value)
      if (!value) {
        this.addCashPledgeData.depositStagePO[i].errText = '请输入累计还款金额'
      } else if (!Number.isInteger(value) || value < 1) {
        this.addCashPledgeData.depositStagePO[i].errText = '累计还款金额只能为正整数'
      } else {
        this.addCashPledgeData.depositStagePO[i].errText = ''
      }
    },
    addDeposit() {
      const addData = {
        label: '累计还款阶段',
        errText: ''
      }
      if (this.addCashPledgeData.depositStagePO.length === 10) {
        this.$message('累计还款阶段最多只能有10个')
      } else {
        this.addCashPledgeData.depositStagePO.push(addData)
      }
    },
    DelDeposit() {
      if (this.addCashPledgeData.depositStagePO.length === 1) {
        this.$message('累计还款阶段不可为空')
      } else {
        this.addCashPledgeData.depositStagePO = this.addCashPledgeData.depositStagePO.slice(0, -1)
      }
    },
    // 点击保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addRule()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async addRule() {
      this.addCashPledgeData.depositStagePO = this.addCashPledgeData.depositStagePO.map((v, i) => ({
        ...v,
        stageOrder: i + 1
      }))
      let totalTradeAmtSum = 0
      for (let i = 0; i < this.addCashPledgeData.depositStagePO.length; i++) {
        totalTradeAmtSum += Number(this.addCashPledgeData.depositStagePO[i].totalTradeAmt)
      }
      let returnAmtSum = 0
      for (let i = 0; i < this.addCashPledgeData.depositStagePO.length; i++) {
        returnAmtSum += Number(this.addCashPledgeData.depositStagePO[i].returnAmt)
      }
      let deductPercentSum = 0
      for (let i = 0; i < this.addCashPledgeData.depositDeductPO.length; i++) {
        deductPercentSum += Number(this.addCashPledgeData.depositDeductPO[i].deductPercent)
      }
      if (totalTradeAmtSum !== Number(this.addCashPledgeData.totalTradeAmt)) {
        this.$message.error('累计还款阶段金额合计必须等于累计还款金额')
      } else if (returnAmtSum !== Number(this.addCashPledgeData.depositAmt)) {
        this.$message.error('累计还款阶段返现金额合计必须等于活动金额')
      } else if (deductPercentSum !== Number(this.addCashPledgeData.feeSum)) {
        this.$message('活动分润扣除分配合计必须等于活动分润扣除总额')
      } else {
        try {
          const res = await postJOSN({
            url: this.cashPledgedetail ? 'depositUser/updateRule' : 'depositUser/addRule',
            data: {
              ruleId: this.addCashPledgeData.ruleId,
              brandId: this.addCashPledgeData.brandId,
              ruleName: this.addCashPledgeData.ruleName,
              depositAmt: this.addCashPledgeData.depositAmt,
              totalTradeAmt: this.addCashPledgeData.totalTradeAmt,
              depositCycle: this.addCashPledgeData.depositCycle,
              depositStagePO: this.addCashPledgeData.depositStagePO,
              depositDeductPO: this.addCashPledgeData.depositDeductPO,
              feeSum: this.addCashPledgeData.feeSum
            }
          })
          this.$message.success(res.data)
          this.$emit('goBack')
        } catch (error) {
          console.log(error)
        }
      }
    }
  },
  mounted() {
    this.getModel()
    if (this.cashPledgedetail) {
      this.cashPledgedetail.depositDeductPO = this.cashPledgedetail.depositDeductPO.map(v => ({
        ...v,
        label: feeMap[v.organLevel]
      }))
      this.cashPledgedetail.depositStagePO = this.cashPledgedetail.depositStagePO.map(v => ({
        ...v,
        label: '累计还款阶段'
      }))
      console.log(this.cashPledgedetail)
      this.addCashPledgeData = this.cashPledgedetail
    }
  }
}
</script>
<style scoped>
.backBtn {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
}
.tishi {
  font-size: 14px;
  color: #606266;
  margin: 10px 20px;
}
.error {
  position: absolute;
  margin-top: -8px;
  color: #f56c6c;
  font-size: 12px;
}
</style>

