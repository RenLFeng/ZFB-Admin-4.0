<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>分润列表</el-breadcrumb-item>
        <el-breadcrumb-item>快捷分润</el-breadcrumb-item>
        <el-breadcrumb-item>VIP分润</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="currentTabName" type="border-card">
      <el-tab-pane label="还款日结分润" name="quick-vip-repay-day">
        <quick-vip-day :profitType="1"></quick-vip-day>
      </el-tab-pane>
      <!-- <el-tab-pane label="还款日结分润(未结算)" name="quick-vip-repay-month">
        <quick-vip-day-noset :profitType="1"></quick-vip-day-noset>
      </el-tab-pane>-->
      <el-tab-pane label="收款日结分润" name="quick-vip-receipt-day">
        <quick-vip-day :profitType="2"></quick-vip-day>
      </el-tab-pane>
      <!-- <el-tab-pane label="收款日结分润(未结算)" name="quick-vip-receipt-month">
        <quick-vip-day-noset :profitType="2"></quick-vip-day-noset>
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import quickVipDayNoset from './quickVipDayNoset.vue'
import quickVipDay from './quickVipDay.vue'

export default {
  components: {
    quickVipDayNoset,
    quickVipDay
  },
  name: 'team-profit-distribution',
  data() {
    return {
      currentTabName: ''
    }
  },
  computed: {
    tabNames() {
      return [quickVipDay].map(({ name }) => name)
    }
  },
  mounted() {
    this.currentTabName = this.tabNames[0]
  },
  methods: {}
}
</script>

<style lang="css" scoped>
.base-tit {
  padding: 10px 0;
}
</style>
