<template>
  <div>
    <p
      v-if="type === 3"
    >机构总交易量：{{totalPerformance|normAmount}}元，机构总分润：{{totalProfit|normAmount}}元 分公司月结分润：{{totalUpProfit|normAmount}}元</p>
    <p
      v-if="type === 5"
    >合伙人总交易量：{{totalPerformance|normAmount}}元，合伙人总分润：{{totalProfit|normAmount}}元 分公司月结分润：{{totalUpProfit|normAmount}}元</p>
    <p
      v-if="type === 6"
    >VIP总交易量：{{totalPerformance|normAmount}}元，VIP总分润：{{totalProfit|normAmount}}元 分公司月结分润：{{totalUpProfit|normAmount}}元</p>
    <el-table border :data="partnertableData" style="width: 100%" size="small">
      <el-table-column v-for="v in tableTitleList" :prop="v.prop" :label="v.title" :key="v.label"></el-table-column>
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
import { organTitle, partnerTitle, vipTitle, detailParseRoleList } from '../table.js'
export default {
  name: 'partner-table',
  mixins: [mixins.pageMixin],
  props: {
    profitType: {
      type: Number,
      default: null
    },
    provinceDetailData: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      tableTitleList: '',
      partnertableData: [],
      totalUpProfit: '',
      totalProfit: '',
      totalPerformance: ''
    }
  },
  methods: {
    getUrl() {
      return 'onlineProfit/provinceProfitDetail'
    },
    getPageParams() {
      return {
        profitType: this.profitType,
        profitLevel: this.type,
        date: this.provinceDetailData.settleTimeText,
        organId: this.provinceDetailData.organId
      }
    },
    handleRows(rows) {
      this.partnertableData = detailParseRoleList([].concat(rows))
      this.totalUpProfit = this.getExtra('totalUpProfit')
      this.totalProfit = this.getExtra('totalProfit')
      this.totalPerformance = this.getExtra('totalPerformance')
    }
  },
  mounted() {
    this.tableTitleList = this.type === 3 ? organTitle : this.type === 5 ? partnerTitle : vipTitle
    this.loadData()
  }
}
</script>
