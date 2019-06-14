<template>
  <div>
    <div class="activity">
      <h3>
        设备型号&nbsp;&nbsp;&nbsp;
        <el-select v-model="brandId" style="width:100px" size="small" @change="toggle">
          <el-option
            v-for="item in ModelData"
            :key="item.brandId"
            :label="item.brandSubName"
            :value="item.brandId"
          ></el-option>
        </el-select>
        当前活动：{{enableRuleName?enableRuleName: '无'}}
      </h3>
      <el-button type="primary" plain size="small" v-if="!enableRuleName" @click="open('open')">开启活动</el-button>
      <el-button
        type="warning"
        plain
        size="small"
        v-if="enableRuleName"
        @click="open('toggle')"
      >切换活动</el-button>
      <el-button type="danger" plain size="small" v-if="enableRuleName" @click="close">关闭活动</el-button>
      <div class="operation">
        <el-button type="primary" plain icon="el-icon-plus" size="small" @click="addCashPledge">活动规则</el-button>
      </div>
    </div>
    <el-table :data="cashPledgeData" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline>
            <el-row class="expand" :gutter="20">
              <el-col :span="12" style="textAlign:left">
                <el-tag>活动阶段</el-tag>
                <div v-for="(v,i) in props.row.depositStagePO" :key="i">
                  <el-form-item :label="'累计还款阶段'+(i+1)">
                    <span>{{v.totalTradeAmt}}</span>
                  </el-form-item>
                  <el-form-item>万</el-form-item>
                  <el-form-item label="返现金额">{{v.returnAmt}}</el-form-item>
                  <el-form-item>元</el-form-item>
                </div>
              </el-col>
              <el-col :span="4" style="textAlign:left">
                <el-tag>活动分润扣除规则</el-tag>
                <br>
                <el-form-item label="活动分润扣除总额" prop="feeSum">
                  <span>万{{props.row.feeSum}}</span>
                </el-form-item>
                <br>
                <el-tag>活动分润扣除分配规则</el-tag>
                <br>
                <el-form-item
                  v-for="(v,i) in props.row.depositDeductPO"
                  :key="i"
                  :label="feeMap[v.organLevel]"
                >
                  <span>万{{v.deductPercent}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        v-for="v in TableTitle"
        :prop="v.prop"
        :label="v.title"
        :width="v.width"
        :key="v.title"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            plain
            size="small"
            @click="edit(scope.row)"
            v-if="scope.row.ruleStatus === 2"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <open-activity
      v-if="activityShow"
      :cashPledgeData="cashPledgeData"
      :type="type"
      :brandId="brandId"
      @handleClose="handleClose"
      @updata="updata"
      :enableRuleNameId="enableRuleNameId"
    ></open-activity>
  </div>
</template>
<script>
import { post } from '../../../../store/requestFacade.js'
import { TableTitle, ParseRoleList } from './table.js'
import openActivity from './openActivity'

const feeMap = {
  2: '分公司还款分润',
  3: '一级还款分润',
  5: '合伙人还款分润',
  9: '二级还款分润'
}
export default {
  name: 'cash-pledge',
  data() {
    return {
      TableTitle,
      feeMap,
      activityShow: false,
      type: '',
      brandId: '',
      enableRuleNameId: '',
      ModelData: [],
      enableRuleName: '',
      cashPledgeData: [],
      depositStagePO: [],
      depositDeductPO: []
    }
  },
  components: {
    openActivity
  },
  methods: {
    // 获取设备型号
    async getModel() {
      try {
        const res = await post({
          url: 'posBrand/queryBrand'
        })
        this.ModelData = res.data.rows
        this.brandId = this.ModelData[0].brandId
      } catch (err) {
        console.log(err)
      }
    },
    toggle() {
      this.getDepositPosAll()
    },
    edit(row) {
      this.$emit('addCashPledge', row)
    },
    addCashPledge() {
      this.$emit('addCashPledge')
    },
    // 获取数据
    async getDepositPosAll() {
      try {
        const res = await post({
          url: 'depositUser/depositRuleList',
          data: {
            brandId: this.brandId
          }
        })
        this.cashPledgeData = ParseRoleList(res.data.rows)
        this.enableRuleName = res.data.enableRuleName
        this.enableRuleNameId = res.data.enableRuleNameId
      } catch (error) {}
    },
    open(type) {
      this.activityShow = true
      this.type = type
    },
    handleClose() {
      this.activityShow = false
    },
    updata() {
      this.activityShow = false
      this.getDepositPosAll()
    },
    // 关闭活动
    async close() {
      try {
        await this.$confirm(`是否确定关闭当前押金活动【${this.enableRuleName}】`, '关闭活动')
        this.ruleEnd()
      } catch (error) {}
    },
    async ruleEnd() {
      try {
        const res = await post({
          url: 'depositUser/ruleEnd',
          data: {
            ruleId: this.enableRuleNameId
          }
        })
        this.$message.success(res.data)
        this.getDepositPosAll()
      } catch (error) {
        console.log(error)
      }
    }
  },
  async mounted() {
    await this.getModel()
    this.getDepositPosAll()
  }
}
</script>
<style scoped>
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  text-align: left;
}
.activity {
  background-color: #fff;
  padding: 20px 15px 15px 15px;
}
h3 {
  padding: 40px 0;
}
.operation {
  float: right;
  background-color: #fff;
  text-align: right;
  padding: 0 15px 15px 15px;
}
.tishi {
  font-size: 14px;
  color: #606266;
  margin: 10px 20px;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
