<template>
  <div style="position:relative">
    <div class="base-tit">
      <Breadcrumb item="分润列表,快捷分润,机构分润"></Breadcrumb>
    </div>
    <el-tabs v-model="currentTabName" type="border-card">
      <el-tab-pane label="还款月结分润" name="quick-org-repay-distribution-month">
        <quick-org-distribution-month :profitType="1"></quick-org-distribution-month>
      </el-tab-pane>
      <el-tab-pane label="收款月结分润" name="quick-org-receipt-distribution-month">
        <quick-org-distribution-month :profitType="2"></quick-org-distribution-month>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import quickOrgDistributionMonth from './quickOrgDistributionMonth'

export default {
  components: {
    quickOrgDistributionMonth
  },
  name: 'quick-org-distribution',
  data() {
    return {
      currentTabName: ''
    }
  },
  computed: {
    tabNames() {
      return [quickOrgDistributionMonth].map(({ name }) => name)
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
