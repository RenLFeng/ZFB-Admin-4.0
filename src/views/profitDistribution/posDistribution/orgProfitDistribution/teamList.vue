<template>
  <div>
    <el-table border :data="detailsData">
      <el-table-column property="userName" label="合伙人" width="200"></el-table-column>
      <el-table-column property="tradeAmt" label="本月交易额(元)">
        <template slot-scope="scope">{{scope.row.performance|normAmount}}</template>
      </el-table-column>
      <!-- <el-table-column property="provinceAmt" label="活动扣除分润(元)" v-if="dealType===dealTypeMap.REPAY">
        <template slot-scope="scope">{{scope.row.depositProfit|normAmount}}</template>
      </el-table-column> -->
      <el-table-column property="provinceAmt" label="机构月结分润(元)">
        <template slot-scope="scope">{{scope.row.profit|normAmount}}</template>
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
const dealTypeMap = {
  REPAY: 2,
  RECEIPT: 1
}
export default {
  name: 'team-list',
  mixins: [mixins.pageMixin],
  props: {
    dealType: {
      type: Number,
      default: null
    },
    organDetailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dealTypeMap: dealTypeMap,
      detailsData: []
    }
  },
  computed: {
    date: function() {
      return this.SettlementTime(this.organDetailData.addDate)
    },
    addDate: function() {
      return this.SetTime(this.organDetailData.addDate)
    }
  },
  methods: {
    SetTime(addDate) {
      if (!addDate) return ''
      const time = new Date(addDate)
      let y = time.getFullYear()
      let MM = time.getMonth() + 1
      if (MM < 10) {
        return y + '-0' + MM
      }
      return y + '-' + MM
    },
    getUrl() {
      return 'statisticsMonth/organDetail'
    },
    getPageParams() {
      return {
        type: this.dealType,
        organId: this.organDetailData.organId,
        date: this.addDate,
        organLevel: 4 // 2=分公司，3=子公司，4=直属合伙人，9=高级合伙人
      }
    },
    handleRows(rows) {
      this.detailsData = [].concat(rows)
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>