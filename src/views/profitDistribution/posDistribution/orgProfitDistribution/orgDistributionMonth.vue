<template>
  <div>
    <div class="distributionOverview">
      <span>机构总交易量: {{totalPerformance|normAmount}} 元</span>
      <span>机构总分润: {{totalProfit|normAmount}} 元</span>
      <span>高级合伙人总分润: {{totalCountProfit|normAmount}} 元</span>
      <span>合伙人总分润: {{partnerProfit|normAmount}} 元</span>
      <span>机构月结分润： {{afterProfit|normAmount}} 元</span>
    </div>
    <div class="searchBox">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item v-if="Number(level) !== 9">
          <el-input clearable v-model="organNumber" placeholder="机构编号"></el-input>
        </el-form-item>
        <el-form-item v-if="Number(level) !== 9">
          <el-input clearable v-model=" organName" placeholder="机构名称"></el-input>
        </el-form-item>

        <el-form-item v-if="Number(level) === 1">
          <el-input clearable v-model="upOrganName" placeholder="上级机构名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable placeholder="结算状态" v-model="settlementStatus">
            <el-option label="未结算" value="0"></el-option>
            <el-option label="已结算" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="settlementMonth"
            type="month"
            value-format="yyyy-MM"
            placeholder="结算月份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border :data="orgData" style="width: 100%" size="small">
      <el-table-column
        v-for="(v,i) in TableList"
        :prop="v.prop"
        :label="v.title"
        :key="i"
        :width="v.width"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="dealType===2&&canOrgRepayDetail || dealType===1&&canOrgReceiptDetail"
            @click="clickDistributionDetail(scope.row)"
          >分润详情</el-button>
        </template>
      </el-table-column>
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
    <org-distribution-detail
      v-if="detailShow"
      @closeDetail="closeDetail"
      :dealType="dealType"
      :organDetailData="organDetailData"
    ></org-distribution-detail>
  </div>
</template>

<script>
import { queryPermission } from '@/util'
import orgDistributionDetail from './orgDistributionDetail'
import { mixins } from '@/core'
import { levelMap } from '../../../../server/level.js'
import { TableTitle, ParseRoleList } from './table.js'
import { filterUerLeveL } from '../../../../util'

const dealTypeMap = {
  REPAY: 2,
  RECEIPT: 1
}
export default {
  name: 'org-repay-distribution-month',
  mixins: [mixins.pageMixin],
  components: {
    orgDistributionDetail
  },
  computed: {
    canOrgRepayDetail() {
      return queryPermission('orgRepayDistributionMonthDetail')
    },
    canOrgReceiptDetail() {
      return queryPermission('orgReceiptDistributionMonthDetail')
    }
  },
  data() {
    return {
      level: '',
      TableList: [],
      levelMap: levelMap,
      organNumber: '',
      organName: '',
      upOrganName: '',
      settlementStatus: '',
      settlementMonth: '',
      orgData: [],
      detailShow: false,
      totalPerformance: '',
      totalProfit: '',
      partnerProfit: '',
      afterProfit: '',
      organDetailData: '',
      totalCountProfit: ''
    }
  },
  props: {
    dealType: {
      type: Number,
      default: null
    }
  },
  methods: {
    search() {
      this.loadData(true)
    },
    getUrl() {
      return 'organProfit/organQuery'
    },
    getPageParams() {
      return {
        type: this.dealType,
        organAccount: this.organNumber,
        organName: this.organName,
        upOrganName: this.upOrganName,
        status: this.settlementStatus,
        date: this.settlementMonth
      }
    },
    handleRows(rows) {
      this.orgData = ParseRoleList(rows)
      this.totalPerformance = this.getExtra('totalPerformance')
      this.totalProfit = this.getExtra('totalProfit')
      this.partnerProfit = this.getExtra('partnerProfit')
      this.afterProfit = this.getExtra('afterProfit')
      this.totalCountProfit = this.getExtra('totalCountProfit')
    },
    clickDistributionDetail(row) {
      this.detailShow = true
      this.organDetailData = row
    },
    closeDetail() {
      this.detailShow = false
    },
    SettlementTime(addDate) {
      if (!addDate) return ''
      const time = new Date(addDate)
      let y = time.getFullYear()
      let MM = time.getMonth() + 1
      if (MM < 10) {
        return y + '-0' + MM
      }
      return y + '-' + MM
    },
    settlement(row, column) {
      const statusMap = {
        0: '未结算',
        1: '已结算'
      }
      return statusMap[row.status]
    }
  },
  mounted() {
    this.loadData()
    this.level = localStorage.getItem('level')
    if (this.dealType === dealTypeMap.RECEIPT) {
      this.TableList = filterUerLeveL(TableTitle).filter(v => v.type !== 'REPAY')
    } else {
      this.TableList = filterUerLeveL(TableTitle)
    }
  }
}
</script>

<style lang="css" scoped>
.distributionOverview {
  text-align: right;
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}
span {
  margin-right: 15px;
}
</style>
