<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item='交易管理,设备交易,消费查询'></Breadcrumb>
      <span class="totalMoney">消费总金额：{{totalAmount|normAmount}}元</span>
    </div>
    <div class="screenBatch">
      <el-form
        :inline="true"
        :model="searchData"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-date-picker
            v-model="searchData.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="实际消费开始时间"
            style="width:200px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchData.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="实际消费结束时间"
            style="width:200px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            v-model="searchData.planId"
            placeholder="计划单号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            v-model="searchData.useraccount"
            placeholder="手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            v-model="searchData.status"
            placeholder="状态"
            style="width:110px"
          >
            <el-option
              label="未消费"
              value="1"
            ></el-option>
            <el-option
              label="已消费"
              value="4"
            ></el-option>
            <el-option
              label="消费失败"
              value="3"
            ></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item>
          <el-input
            clearable
            v-model="searchData.organName"
            v-if="level!==levelMap.ORGAN"
            placeholder="机构名称"
            style="width:230px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            v-model="searchData.partner"
            placeholder="合伙人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            v-model="searchData.userName"
            placeholder="会员姓名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            v-model="searchData.bankName"
            placeholder="银行名称"
            style="width:110px"
          >
            <el-option
              v-for="(item,index) in ourbank"
              :key="index"
              :label="item.btName"
              :value="item.btName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:150px">
          <el-button
            type="primary"
            @click="loadData(true)"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="paymentsData"
      border
      style="width: 100%"
      size="small"
    >
      <el-table-column
        v-for="(v,i) in payTableList"
        :prop="v.prop"
        :label="v.title"
        :width="v.width"
        :key="i"
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
import { mixins } from '@/core'
import { post } from '../../../store/requestFacade.js'
import { levelMap } from '../../../server/level.js'
import { payParseRoleList, payTable } from './table.js'
import { filterUerLeveL } from '../../../util'
export default {
  mixins: [mixins.pageMixin],
  name: 'payments',
  data() {
    return {
      level: '',
      ourbank: '',
      payTableList: filterUerLeveL(payTable),
      levelMap: levelMap,
      searchData: {
        planId: '',
        status: '',
        useraccount: '',
        startTime: '',
        endTime: '',
        userName: '',
        bankName: '',
        organName: '',
        partner: ''
      },
      paymentsData: [],
      totalAmount: ''
    }
  },
  methods: {
    // 获取表格数据
    getUrl() {
      return 'taskinfo/query'
    },
    getPageParams() {
      return {
        startedAt: this.searchData.startTime,
        shouldEndAt: this.searchData.endTime,
        type: 1,
        planId: this.searchData.planId,
        status: this.searchData.status,
        useraccount: this.searchData.useraccount,
        userName: this.searchData.userName,
        btName: this.searchData.bankName,
        oneOrganName: this.searchData.organName,
        partnerName: this.searchData.partner
      }
    },
    // 状态
    status(row, column) {
      const statuMap = {
        1: '未消费',
        2: '执行中',
        3: '消费失败',
        4: '已消费'
      }
      return statuMap[row.status]
    },
    planStatus(row, column) {
      const statuMap = {
        1: '执行中',
        2: '暂停中',
        3: '异常结束',
        4: '正常结束'
      }
      return statuMap[row.planStatus]
    },
    handleRows(rows) {
      this.paymentsData = payParseRoleList(rows)
      this.totalAmount = this.getExtra('totalAmount')
    },
    // 获取银行列表
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
    this.getbank()
    this.loadData()
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
