<template>
  <div>
    <el-dialog :title="title" :visible="true" :before-close="hide">
      <p>{{organDetailData.settleTimeText}}【{{organDetailData.organName}}】总交易量：{{organDetailData.performance}}元，月结分润：{{organDetailData.monthProfit}}元</p>
      <el-tabs v-model="activeName">
        <el-tab-pane label="下级机构总分润" name="first">
          <profit-table :profitType="profitType" :organDetailData="organDetailData" :type="4"></profit-table>
        </el-tab-pane>
        <el-tab-pane label="合伙人总分润" name="second">
          <profit-table :profitType="profitType" :organDetailData="organDetailData" :type="5"></profit-table>
        </el-tab-pane>
        <el-tab-pane label="VIP总分润" name="third">
          <profit-table :profitType="profitType" :organDetailData="organDetailData" :type="6"></profit-table>
        </el-tab-pane>
        <!-- <el-tab-pane label="推荐奖励" name="fourth" v-if="profitType===1">
          <referral-table :date="organDetailData.settleTimeText" :organId="organDetailData.organId"></referral-table>
        </el-tab-pane>-->
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import { mixins } from '@/core'
import profitTable from './profitTable.vue'
import referralTable from '../quickProvinceDistribution/detailTable/referralTable'
export default {
  name: 'quick-province-repay-detail',
  mixins: [mixins.pageMixin],
  components: {
    profitTable,
    referralTable
  },
  props: {
    profitType: {
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
      title: '',
      activeName: 'first'
    }
  },
  methods: {
    hide() {
      this.$emit('closeDetail')
    }
  },
  mounted() {
    this.title = this.profitType === 1 ? '还款分润详情' : '收款分润详情'
  }
}
</script>