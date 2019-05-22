<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>分润列表</el-breadcrumb-item>
        <el-breadcrumb-item>设备分润</el-breadcrumb-item>
        <el-breadcrumb-item>合伙人分润</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs
      v-model="currentTabName"
      @tab-click="changeTab"
      type="border-card"
    >
      <el-tab-pane
        label="还款月结分润"
        name="team-repay-distribution-month"
      >
        <team-distribution-month :type="type.REPAY"></team-distribution-month>
      </el-tab-pane>
      <el-tab-pane
        label="还款日结分润"
        name="team-repay-distribution-day"
      >
        <team-distribution-day :type="type.REPAY"></team-distribution-day>
      </el-tab-pane>
      <el-tab-pane
        label="收款月结分润"
        name="team-receipt-distribution-month"
      >
        <team-distribution-month :type="type.RECEIPT"></team-distribution-month>
      </el-tab-pane>
      <el-tab-pane
        label="收款日结分润"
        name="team-receipt-distribution-day"
      >
        <team-distribution-day :type="type.RECEIPT"></team-distribution-day>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import teamDistributionMonth from './teamDistributionMonth.vue'
import teamDistributionDay from './teamDistributionDay.vue'

const dealType = {
  REPAY: 2,
  RECEIPT: 1
}

export default {
  components: {
    teamDistributionMonth,
    teamDistributionDay
  },
  name: 'team-profit-distribution',
  data() {
    return {
      currentTabName: '',
      type: dealType
    }
  },
  computed: {
    tabNames() {
      return [teamDistributionMonth, teamDistributionDay].map(({ name }) => name)
    }
  },
  mounted() {
    this.currentTabName = this.tabNames[0]
  },
  methods: {
    changeTab(tab, event) {
      // const { index } = tab
      // console.log('click tab:', index)
    }
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  padding: 15px;
}
</style>
