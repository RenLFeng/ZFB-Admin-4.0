<template>
  <div>
    <div class="searchBox">
      <div class="distributionOverview">
        <span>分公司总交易量: {{totalPerformance|normAmount}} 元</span>
        <span>分公司总分润: {{totalProfit|normAmount}} 元</span>
        <span>机构总分润: {{partnerProfit|normAmount}} 元</span>
        <span>分公司月结分润： {{afterProfit|normAmount}} 元</span>
      </div>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item v-if="level === levelMap.PLATFORM">
          <el-input clearable v-model="organNumber" placeholder="分公司编号"></el-input>
        </el-form-item>
        <el-form-item v-if="level === levelMap.PLATFORM">
          <el-input clearable v-model="organName" placeholder="分公司名称"></el-input>
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
    <el-table border :data="provinceMonthData" style="width: 100%" size="small">
      <el-table-column v-for="(v,i) in TableList" :prop="v.prop" :label="v.title" :key="i"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="dealType===2&&canRepayDetail || dealType===1&&canReceiptDetail"
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
    <province-distribution-detail
      v-if="detailShow"
      @closeDetail="closeDetail"
      :dealType="dealType"
      :provinceDetailData="provinceDetailData"
    />
  </div>
</template>
<script>
import { queryPermission } from '@/util'
import { mixins } from '@/core'
import provinceDistributionDetail from './provinceDistributionDetail'
import { levelMap } from '../../../../server/level.js'
import { TableTitle, ParseRoleList } from './table.js'
import { filterUerLeveL } from '../../../../util'
const dealTypeMap = {
  REPAY: 2,
  RECEIPT: 1
}
export default {
  name: 'province-distribution-month',
  mixins: [mixins.pageMixin],
  components: {
    provinceDistributionDetail
  },
  computed: {
    canReceiptDetail() {
      return queryPermission('provinceReceiptDistributionMonthDetail')
    },
    canRepayDetail() {
      return queryPermission('provinceRepayDistributionMonthDetail')
    }
  },
  props: {
    dealType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      level: '',
      levelMap: levelMap,
      TableList: [],
      organNumber: '',
      organName: '',
      settlementStatus: '',
      settlementMonth: '',
      provinceMonthData: [],
      detailShow: false,
      totalPerformance: '',
      totalProfit: '',
      partnerProfit: '',
      afterProfit: '',
      provinceDetailData: ''
    }
  },
  methods: {
    search() {
      this.loadData(true)
    },
    clickDistributionDetail(row) {
      this.provinceDetailData = row
      this.detailShow = true
    },
    closeDetail() {
      this.detailShow = false
    },
    getUrl() {
      return 'organProfit/provinceQuery'
    },
    getPageParams() {
      return {
        type: this.dealType,
        organAccount: this.organNumber,
        organName: this.organName,
        status: this.settlementStatus,
        date: this.settlementMonth
      }
    },
    handleRows(rows) {
      this.provinceMonthData = ParseRoleList(rows)
      this.totalPerformance = this.getExtra('totalPerformance')
      this.totalProfit = this.getExtra('totalProfit')
      this.partnerProfit = this.getExtra('partnerProfit')
      this.afterProfit = this.getExtra('afterProfit')
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
<style scoped>
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
