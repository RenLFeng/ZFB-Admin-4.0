<template>
  <div style="position:relative">
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>分润列表</el-breadcrumb-item>
        <el-breadcrumb-item>快捷分润</el-breadcrumb-item>
        <el-breadcrumb-item>省级分润</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="currentTabName" @tab-click="changeTab" type="border-card">
      <el-tab-pane label="还款月结分润" name="quick-province-repay-month">
        <quick-province-month :profitType="1"></quick-province-month>
      </el-tab-pane>
      <el-tab-pane label="收款月结分润" name="quick-province-receipt-month">
        <quick-province-month :profitType="2"></quick-province-month>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import quickProvinceMonth from './quickProvinceMonth'
export default {
  name: 'quick-province-profit-distribution',
  components: {
    quickProvinceMonth
  },
  data() {
    return {
      currentTabName: ''
    }
  },
  computed: {
    tabNames() {
      return [quickProvinceMonth].map(({ name }) => name)
    }
  },
  mounted() {
    this.currentTabName = this.tabNames[0]
  },
  methods: {
    changeTab(tab, event) {
      const { index } = tab
      console.log('click tab:', index)
    }
  }
}
</script>
<style scoped>
.base-tit {
  padding: 10px 0;
}
.distributionOverview {
  position: absolute;
  top: 44px;
  right: 20px;
  color: #666;
  font-size: 14px;
}
</style>
