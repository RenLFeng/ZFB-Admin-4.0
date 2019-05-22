<template>
  <div style="position:relative">
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>分润列表</el-breadcrumb-item>
        <el-breadcrumb-item>设备分润</el-breadcrumb-item>
        <el-breadcrumb-item>分公司分润</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs
      v-model="currentTabName"
      @tab-click="changeTab"
      type="border-card"
    >
      <el-tab-pane
        label="还款月结分润"
        name="province-distribution-month"
      >
        <province-distribution-month :dealType="dealType.REPAY"></province-distribution-month>
      </el-tab-pane>

      <el-tab-pane
        label="收款月结分润"
        name="province-receipt-distribution-month"
      >
        <province-distribution-month :dealType="dealType.RECEIPT"></province-distribution-month>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import provinceDistributionMonth from './provinceDistributionMonth.vue'

const dealType = {
  REPAY: 2,
  RECEIPT: 1
}

export default {
  components: {
    provinceDistributionMonth
  },
  name: 'province-receipt-distribution',
  data() {
    return {
      currentTabName: '',
      dealType: dealType
    }
  },
  computed: {
    tabNames() {
      return [provinceDistributionMonth].map(({ name }) => name)
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

<style lang="css" scoped>
.base-tit {
  padding: 15px;
}
.distributionOverview {
  position: absolute;
  top: 44px;
  right: 20px;
  color: #666;
  font-size: 14px;
}
</style>
