<template>
  <div>
    <el-dialog :title="title" :visible="true" :before-close="hide">
      <p
        style="padding-bottom:15px"
      >{{date}}【{{provinceDetailData.organName}}】总分润:{{totalData.totalProfit|normAmount}} 元, 总交易量: {{totalData.totalPerformance|normAmount}} 元</p>
      <el-table border size="small" :data="detailsData">
        <el-table-column property="userAccount" label="机构编号"></el-table-column>
        <el-table-column property="userName" label="机构名称"></el-table-column>
        <el-table-column property="tradeAmt" label="本月交易量(元)">
          <template slot-scope="scope">{{scope.row.performance|normAmount}}</template>
        </el-table-column>
        <el-table-column
          property="provinceAmt"
          label="押金扣除分润(元)"
          v-if="dealType===dealTypeMap.REPAY"
        >
          <template slot-scope="scope">{{scope.row.depositProfit|normAmount}}</template>
        </el-table-column>
        <el-table-column property="provinceAmt" label="省级月结分润(元)">
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
    </el-dialog>
  </div>
</template>
<script>
import { mixins } from '@/core'
import { post } from '../../../../store/requestFacade.js'
const dealTypeMap = {
  REPAY: 2,
  RECEIPT: 1
}
export default {
  name: 'province-distribution-detail',
  mixins: [mixins.pageMixin],
  props: {
    provinceDetailData: {
      type: Object,
      default: () => {}
    },
    dealType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      title: '',
      detailsData: [],
      dealTypeMap: dealTypeMap,
      totalData: ''
    }
  },
  computed: {
    date: function() {
      return this.SettlementTime(this.provinceDetailData.addDate)
    },
    addDate: function() {
      return this.SetTime(this.provinceDetailData.addDate)
    }
  },
  methods: {
    hide() {
      this.$emit('closeDetail')
    },
    getUrl() {
      return 'statisticsMonth/provinceDetail'
    },
    getPageParams() {
      return {
        type: this.dealType,
        organId: this.provinceDetailData.organId,
        date: this.addDate,
        organLevel: 3 // 2=省级，3=一级机构，4=直属合伙人，9=二级机构
      }
    },
    handleRows(rows) {
      this.detailsData = [].concat(rows)
    },
    SettlementTime(addDate) {
      if (!addDate) return ''
      const time = new Date(addDate)
      let y = time.getFullYear()
      let MM = time.getMonth() + 1
      if (MM < 10) {
        return y + '年0' + MM + '月'
      }
      return y + '年' + MM + '月'
    },
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
    async getAllData() {
      try {
        const res = await post({
          url: 'organProfit/accountProfit',
          data: {
            organId: this.provinceDetailData.organId,
            date: this.addDate,
            type: this.dealType
          }
        })
        this.totalData = res.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.getAllData()
    this.loadData()
    const typeMap = {
      1: '收款',
      2: '还款'
    }
    this.title = `${typeMap[this.dealType]}分润详情`
  }
}
</script>
