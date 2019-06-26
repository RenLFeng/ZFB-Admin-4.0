<template>
  <div>
    <Breadcrumb style="margin:15px 0" item="财务管理,提现管理"></Breadcrumb>
    <el-tabs v-model="currentTabName" type="border-card" v-if="show === 1">
      <el-tab-pane label="机构提现" name="organization-withdrawals">
        <organization-withdrawals @organWithdrawDetail="organWithdrawDetail" :ourbank="ourbank"></organization-withdrawals>
      </el-tab-pane>
      <el-tab-pane label="用户提现" name="user-withdrawals">
        <user-withdrawals @userWithdrawDetail="userWithdrawDetail" :ourbank="ourbank"></user-withdrawals>
      </el-tab-pane>
    </el-tabs>
    <withdrawal-detail :withdrawArg="withdrawArg" v-if="show===2" @goback="goback" :type="type"></withdrawal-detail>
  </div>
</template>

<script>
import organizationWithdrawals from './organizationWithdrawals.vue'
import userWithdrawals from './userWithdrawals.vue'
import withdrawalDetail from './withdrawalDetail'
import { post } from '../../../store/requestFacade.js'
const typeMap = {
  ORGAN: 1,
  USERS: 2
}
export default {
  components: {
    organizationWithdrawals,
    userWithdrawals,
    withdrawalDetail
  },
  name: 'withdrawals-management',
  data() {
    return {
      typeMap: typeMap,
      currentTabName: '',
      show: 1,
      withdrawId: '',
      type: '',
      ourbank: []
    }
  },
  computed: {
    tabNames() {
      return [organizationWithdrawals, userWithdrawals].map(({ name }) => name)
    }
  },
  mounted() {
    this.currentTabName = this.tabNames[0]
    this.getbank()
  },
  methods: {
    goback() {
      this.show = 1
    },
    async getbank() {
      try {
        const res = await post({
          url: 'channel/queryBankTrunk'
        })
        this.ourbank = res.data
      } catch (error) {
        console.log(error)
      }
    },
    organWithdrawDetail(detail) {
      this.show = detail.showWithdrawDetail
      this.withdrawArg = detail
      this.type = typeMap.ORGAN
    },
    userWithdrawDetail(detail) {
      this.type = typeMap.USERS
      this.show = detail.showWithdrawDetail
      this.withdrawArg = detail
    }
  }
}
</script>

<style lang="css" scoped>
</style>
