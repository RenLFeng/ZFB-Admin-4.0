<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>分润列表</el-breadcrumb-item>
        <el-breadcrumb-item>快捷分润</el-breadcrumb-item>
        <el-breadcrumb-item>合伙人分润</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="currentTabName" type="border-card">
      <el-tab-pane label="还款月结分润" name="quick-Partner-month">
        <quick-Partner-month :profitType="1"></quick-Partner-month>
      </el-tab-pane>
      <!-- <el-tab-pane label="还款日结明细" name="quick-Partner-day">
        <quick-Partner-day></quick-Partner-day>
      </el-tab-pane>-->
      <el-tab-pane label="收款月结分润" name="quick-Partner-months">
        <quick-Partner-month :profitType="2"></quick-Partner-month>
      </el-tab-pane>
      <!-- <el-tab-pane label="收款日结明细" name="quick-Partner-days">
        <quick-Partner-day></quick-Partner-day>
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import quickPartnerMonth from './quickPartnerMonth.vue'
import quickPartnerDay from './quickPartnerDay.vue'

export default {
  components: {
    quickPartnerMonth,
    quickPartnerDay
  },
  name: 'quick-partner-distribution',
  data() {
    return {
      currentTabName: ''
    }
  },
  computed: {
    tabNames() {
      return [quickPartnerMonth, quickPartnerDay].map(({ name }) => name)
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
