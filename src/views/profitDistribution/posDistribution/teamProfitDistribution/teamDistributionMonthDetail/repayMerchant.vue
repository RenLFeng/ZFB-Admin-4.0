<template>
  <div>
    <p style="padding-bottom:15px">本月个人业绩:{{performance|normAmount}}元, 本月日结分润:{{profit|normAmount}}元</p>
    <el-table
      size='small'
      border
      :data="merchatData"
      style="width: 100%"
    >
      <el-table-column
        prop="serialNum"
        label="序号"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="organName"
        label="商户"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="statisticsAmt"
        label="交易金额(元)"
        align="center"
      >
        <template slot-scope="scope">
          <p>{{scope.row.statisticsAmt|normAmount}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="monthProfit"
        label="合伙人日结分润(元)"
        align="center"
      >
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
        >
        </el-pagination>
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
  name: 'repay-merchat',
  mixins: [mixins.pageMixin],
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
  data() {
    return {
      performance: '',
      profit: '',
      merchatData: []
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
        organType: organType.MERCHANT,
        date: this.date
      }
    },
    handleRows(rows) {
      this.merchatData = [].concat(rows).map((item, index) => {
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
