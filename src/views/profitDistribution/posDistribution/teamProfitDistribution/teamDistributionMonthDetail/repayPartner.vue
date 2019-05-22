<template>
  <div>
    <p style="padding-bottom:15px">本月团队业绩:{{performance|normAmount}}元, 本月月结分润:{{profit|normAmount}}元</p>
    <el-table size="small" border :data="partnerData" style="width: 100%">
      <el-table-column prop="serialNum" label="序号" align="center"></el-table-column>
      <el-table-column prop="organName" label="合伙人" align="center"></el-table-column>
      <el-table-column prop="partnerNumber" label="下级合伙人数(个)" align="center"></el-table-column>
      <el-table-column prop="merchantNumber" label="商户数(个)" align="center"></el-table-column>
      <el-table-column prop="statisticsAmt" label="本月交易额(元)" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.statisticsAmt|normAmount}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="monthProfit" label="合伙人月结分润(元)" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.monthProfit|normAmount}}</p>
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
  </div>
</template>
<script>
import { mixins } from '@/core'

const organType = {
  MERCHANT: 1,
  PARTNER: 2
}

export default {
  name: 'repay-partner',
  mixins: [mixins.pageMixin],
  data() {
    return {
      profit: '',
      performance: '',
      partnerData: []
    }
  },
  props: {
    type: {
      type: Number,
      default: null
    },
    teamMonthDetailData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    date() {
      return this.SettlementTime(this.teamMonthDetailData.addDate)
    }
  },
  methods: {
    getUrl() {
      return 'statisticsMonth/detail'
    },
    getPageParams() {
      return {
        statisticsType: this.type,
        organId: this.teamMonthDetailData.organId,
        organType: organType.PARTNER,
        date: this.date
      }
    },
    handleRows(rows) {
      this.partnerData = [].concat(rows).map((item, index) => {
        return Object.assign({}, item, { serialNum: index + 1 })
      })
      this.performance = this.getExtra('performance')
      this.profit = this.getExtra('profit')
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
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>
