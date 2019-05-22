<template>
  <div>
    <el-dialog
      :title="title"
      :visible="true"
      :before-close="hide"
    >
      <p style="padding-bottom:15px">{{date}}【{{teamMonthDetailData.organName}}】总分润: {{totalData.totalProfit|normAmount}} 元, 总交易量: {{totalData.totalPerformance|normAmount}} 元</p>
      <el-tabs
        v-model="currentTabName"
        @tab-click="changeTab"
        type="border-card"
      >
        <el-tab-pane
          label="合伙人"
          name="repay-partner"
        >
          <repay-partner
            :type="type"
            :teamMonthDetailData="teamMonthDetailData"
          ></repay-partner>
        </el-tab-pane>

        <el-tab-pane
          label="商户"
          name="repay-merchant"
        >
          <repay-merchant
            :type="type"
            :teamMonthDetailData="teamMonthDetailData"
          ></repay-merchant>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import repayPartner from './repayPartner'
import repayMerchant from './repayMerchant'
import {post} from '../../../../../store/requestFacade.js'
export default {
  name: 'team-distribution-month-detail',
  components: {
    repayPartner,
    repayMerchant
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
  data() {
    return {
      currentTabName: '',
      title: '',
      totalData: ''
    }
  },
  computed: {
    tabNames() {
      return [repayPartner, repayMerchant].map(({ name }) => name)
    },
    date() {
      return this.SettlementTime(this.teamMonthDetailData.addDate)
    },
    addDate: function() {  
      return this.SetTime(this.teamMonthDetailData.addDate)
    }
  },
  mounted() {
    this.getAllData()
    console.log(this.teamMonthDetailData);
    this.currentTabName = this.tabNames[0]
    const typeMap = {
      1: '收款',
      2: '还款'
    }
    this.title = `${typeMap[this.type]}分润详情`
  },
  methods: {
    changeTab(tab, event) {
    },
    hide() {
      this.$emit('closeDetail')
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
          url: 'partnerProfit/accountProfit',
          data: {
            organId: this.teamMonthDetailData.organId,
            date: this.addDate,
            statisticsType: this.type
          }
        })
        this.totalData = res.data
      } catch (error) { 
        console.log(error)
      }
    }
  }
}
</script>
