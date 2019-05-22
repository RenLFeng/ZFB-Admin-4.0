<template>
  <div>
    <el-dialog :title="title" :visible="true" :before-close="hide">
      <p>{{details.settleDateText}}【{{details.partnerName}}】总交易量：{{totalPerformance|normAmount}}元，月结分润：{{totalProfit|normAmount}}元</p>
      <el-table border :data="detailsData" style="width: 100%" size="small">
        <el-table-column v-for=" v in detailTitle" :prop="v.prop" :label="v.title" :key="v.title"></el-table-column>
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
    </el-dialog>
  </div>
</template>
<script>
import { mixins } from '@/core'
import { detailTitle, detailRoleList } from './table.js'
export default {
  name: 'team-receipt-distribution-month-detail',
  mixins: [mixins.pageMixin],
  data() {
    return {
      title: '',
      detailTitle,
      totalPerformance: '',
      totalProfit: '',
      detailsData: []
    }
  },
  props: {
    profitType: {
      type: Number,
      default: null
    },
    details: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    hide() {
      this.$emit('closeDetail')
    },
    getUrl() {
      return 'partnerProfit/detail'
    },
    getPageParams() {
      console.log(this.details)
      return {
        profitType: this.profitType,
        detailIds: this.details.detailIds
      }
    },
    handleRows(rows) {
      this.detailsData = detailRoleList([].concat(rows))
      this.totalPerformance = this.getExtra('totalPerformance')
      this.totalProfit = this.getExtra('totalProfit')
    }
  },
  mounted() {
    this.title = this.profitType === 1 ? '还款分润详情' : '收款分润详情'
    this.loadData()
  }
}
</script>
