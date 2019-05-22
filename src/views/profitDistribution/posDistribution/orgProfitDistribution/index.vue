<template>
  <div style="position:relative ">
    <div class="base-tit">
      <Breadcrumb item="分润列表,设备分润,机构分润"></Breadcrumb>
    </div>
    <el-tabs v-model="currentTabName" @tab-click="changeTab" type="border-card">
      <el-tab-pane label="还款月结分润" name="org-repay-distribution-month">
        <org-distribution-month :dealType="dealType.REPAY"></org-distribution-month>
      </el-tab-pane>

      <el-tab-pane label="收款月结分润" name="org-receipt-distribution-month">
        <org-distribution-month :dealType="dealType.RECEIPT"></org-distribution-month>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import orgDistributionMonth from './orgDistributionMonth'

const dealType = {
  REPAY: 2,
  RECEIPT: 1
}

export default {
  components: {
    orgDistributionMonth
  },
  name: 'org-profit-distribution',
  data() {
    return {
      currentTabName: '',
      dealType: dealType
    }
  },
  computed: {
    tabNames() {
      return [orgDistributionMonth].map(({ name }) => name)
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
