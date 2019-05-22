<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="activeName" style="margin-left:15px">
      <el-tab-pane label="分润配置" name="systemFee">
        <sysem-fee></sysem-fee>
      </el-tab-pane>
      <el-tab-pane label="押金配置" name="cashPledge" v-if="candepositConfig">
        <cash-pledge @addCashPledge="addCashPledge" v-if="addCashPledgeShow===1"></cash-pledge>
        <add-cash-pledge
          @goBack="goBack"
          v-if="addCashPledgeShow===2"
          :cashPledgedetail="cashPledgedetail"
        ></add-cash-pledge>
      </el-tab-pane>
      <el-tab-pane label="开通合伙人配置" name="partnerConfig">
        <partner-config></partner-config>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { queryPermission } from '@/util'
import sysemFee from './systemFee/sysemFee'
import partnerConfig from './PartnerConfig/index'
import cashPledge from './cashPledge/cashPledgement'
import addCashPledge from './cashPledge/addCashPledge'
export default {
  name: 'system-setting',
  components: {
    sysemFee,
    partnerConfig,
    cashPledge,
    addCashPledge
  },
  data() {
    return {
      activeName: 'systemFee',
      systemFeeActive: 'provincial',
      addCashPledgeShow: 1,
      cashPledgedetail: {}
    }
  },
  methods: {
    addCashPledge(row) {
      this.cashPledgedetail = row
      this.addCashPledgeShow = 2
    },
    goBack() {
      this.addCashPledgeShow = 1
    }
  },
  computed: {
    candepositConfig() {
      return queryPermission('depositConfig')
    }
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
