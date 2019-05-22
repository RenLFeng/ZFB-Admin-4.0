<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item="交易管理,快捷交易,消费查询"></Breadcrumb>
      <span class="totalMoney">消费总金额：{{totalAmount|normAmount}}元</span>
    </div>
    <div class="screenBatch">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            v-model="startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="实际消费开始时间"
            style="width:230"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="实际消费结束时间"
            style="width:230"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="planId" placeholder="计划单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="userName" clearable placeholder="会员姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="useraccount" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable placeholder="机构名称" v-model="organName" v-if="level!==levelMap.ORGAN"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="partnerName" placeholder="推荐人名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="bank" placeholder="银行名称">
            <el-option
              v-for="(item ,index) in ourbank"
              :key="index"
              :label="item.btName"
              :value="item.btName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="status" placeholder="状态" style="width:110px">
            <el-option v-for="m in getStatus" :key="m.value" :label="m.value" :value="m.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="repaymenteData" border style="width: 100%" size="small">
      <el-table-column
        v-for="m in table"
        :key="m.title"
        :prop="m.prop"
        :label="m.title"
        :width="m.width"
      ></el-table-column>
    </el-table>
    <div style="padding: 16px; background: white; overflow: hidden;">
      <div style="float: right;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="paging.currentPage"
          :page-size="paging.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paging.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { levelMap } from '../../../server/level.js'
import { payParseRoleList, payTable } from './table.js'
import { filterUerLeveL } from '../../../util'
import { mixins, date } from '@/core'
import { post } from '../../../store/requestFacade'
export default {
  mixins: [mixins.pageMixin, date.dateHorizon],
  name: 'repayments',
  data() {
    return {
      table: filterUerLeveL(payTable),
      levelMap: levelMap,
      level: '',
      startTime: '',
      endTime: '',
      planId: '',
      status: '',
      bank: '',
      ourbank: '',
      useraccount: '',
      organName: '',
      userName: '',
      partnerName: '',
      repaymenteData: [],
      totalAmount: '',
      getStatus: [
        {
          id: 1,
          value: '未消费'
        },
        {
          id: 3,
          value: '消费失败'
        },
        {
          id: 4,
          value: '已消费'
        }
      ]
    }
  },
  methods: {
    // 获取表格数据
    getUrl() {
      return 'online/query'
    },
    getPageParams() {
      return {
        startedAt: this.startTime,
        shouldEndAt: this.endTime,
        type: 1,
        planId: this.planId,
        status: this.status,
        useraccount: this.useraccount,
        btName: this.bank,
        userName: this.userName,
        oneOrganName: this.organName,
        partnerName: this.partnerName
      }
    },
    handleRows(rows) {
      this.repaymenteData = payParseRoleList([].concat(rows))
      this.totalAmount = this.getExtra('totalAmount')
    },
    async getbank() {
      try {
        const res = await post({
          url: 'channel/queryBankTrunk'
        })
        this.ourbank = res.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.loadData()
    this.getbank()
    this.level = localStorage.getItem('level')
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  margin: 15px 0;
}
.totalMoney {
  float: right;
  margin-right: 50px;
  font-size: 15px;
  color: #606266;
}
</style>
