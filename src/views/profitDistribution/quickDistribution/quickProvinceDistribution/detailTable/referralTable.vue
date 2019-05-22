<template>
  <div>
    <p>奖励总数：{{total}}人，推荐奖励：{{totalProfit}}元</p>
    <el-table border :data="referraltableData" style="width: 100%" size="small">
      <el-table-column v-for="v in referralTitle" :prop="v.prop" :label="v.title" :key="v.label"></el-table-column>
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
import { referralTitle, referralParseRoleList } from '../table.js'
export default {
  name: 'referral-table',
  mixins: [mixins.pageMixin],
  data() {
    return {
      referralTitle,
      referraltableData: [],
      total: '',
      totalProfit: ''
    }
  },
  props: {
    settleTimeText: {
      type: String,
      default: null
    },
    organId: {
      type: Number,
      default: null
    }
  },
  methods: {
    getUrl() {
      return 'recommend/query'
    },
    getPageParams() {
      return {
        date: this.settleTimeText,
        organId: this.organId
      }
    },
    handleRows(rows) {
      this.partnertableData = referralParseRoleList([].concat(rows))
      this.total = this.getExtra('total')
      this.totalProfit = this.getExtra('totalProfit')
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>