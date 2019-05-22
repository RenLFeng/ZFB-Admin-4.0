<template>
  <div>
    <div v-if="userShow=== 1">
      <div class="base-tit">
        <Breadcrumb item="用户管理,所有用户"></Breadcrumb>
      </div>
      <div>
        <el-tabs v-model="currentTabName" @tab-click="changeTab" type="border-card">
          <el-tab-pane v-if="canallUser" label="所有用户" name="all-user">
            <all-user @todetails="todetails"></all-user>
          </el-tab-pane>
          <el-tab-pane v-if="canofflineTeam" label="合伙人" name="offline-team">
            <offline-team
              @todetails="todetails"
              @toMerchant="toMerchant"
              @toTeam="toTeam"
              :organId="organId"
            ></offline-team>
          </el-tab-pane>
          <el-tab-pane v-if="canofflineMerchant" label="设备商户" name="offline-merchant">
            <offline-merchant @todetails="todetails" :merchant="merchant"></offline-merchant>
          </el-tab-pane>
          <!-- 
          <el-tab-pane label="VIP" name="vip" v-if="canVip">
            <online-vip @todetails="todetails"></online-vip>
          </el-tab-pane>

          <el-tab-pane label="线上用户" name="online-user" v-if="canonlineMerchant">
            <online-user @todetails="todetails"></online-user>
          </el-tab-pane>
          -->
        </el-tabs>
      </div>
    </div>
    <div v-if="userShow === 2">
      <div class="base-tit">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" icon="el-icon-arrow-left" @click="toback">返回</el-button>
      </div>
      <el-tabs v-model="userInfoType" type="card" style="background-color: #fff;height:750px">
        <el-tab-pane label="基本信息" name="details-pops">
          <detailsPops :detailsData="detailsData"/>
        </el-tab-pane>
        <el-tab-pane label="账户信息" v-if="userInfo.isPartner||userInfo.onlineVip" name="second">
          <div class="balance">
            <h4
              style="display: inline-block;margin-right:60px"
            >账户余额：{{userInfo.balance|normAmount}}元</h4>
          </div>
          <account-info
            v-if="userInfoType === 'second'"
            :organId="userInfo.organId"
            :type="typeMap.USERS"
            :isPartner="userInfo.isPartner"
            :onlineVip="userInfo.onlineVip"
          ></account-info>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import allUser from './allUser.vue'
import offlineTeam from './offlineTeam.vue'
import offlineMerchant from './offlineMerchant.vue'
import onlineVip from './onlineVip.vue'
import onlineUser from './userOnline.vue'
import detailsPops from './detailsComponent/detailsPops'
import accountInfo from '../../components/accountInfo'
import { queryPermission } from '@/util'
import { post } from '../../store/requestFacade.js'

const typeMap = {
  USERS: 2
}
export default {
  name: 'user-management',
  components: {
    allUser,
    offlineTeam,
    offlineMerchant,
    onlineVip,
    onlineUser,
    detailsPops,
    accountInfo
  },
  data() {
    return {
      currentTabName: '',
      userInfoType: 'details-pops',
      merchant: {},
      organId: '',
      userShow: 1,
      userInfo: {},
      detailsData: {},
      typeMap
    }
  },
  methods: {
    todetails(row) {
      this.userShow = 2
      this.detailsData = row
      this.getUserInfo()
    },
    changeTab(tab, event) {
      const { index } = tab
      if (index === '2') {
        this.merchant.organId = null
      }
      if (index === '1') {
        this.organId = ''
      }
    },
    // 获取用户详情
    async getUserInfo() {
      try {
        const res = await post({
          url: 'userManagement/userInfo',
          data: {
            organId: this.detailsData.organId
          }
        })
        this.userInfo = res.data
      } catch (err) {
        console.log(err)
      }
    },
    toTeam(getOrganId) {
      this.organId = String(getOrganId)
    },
    toMerchant(merchant) {
      this.merchant = merchant
      if (this.merchant.toggle) this.currentTabName = this.tabNames[2]
    },
    toback() {
      this.userInfoType = 'details-pops'
      this.userShow = 1
    }
  },
  computed: {
    canallUser() {
      return queryPermission('allUser') // 所有用户
    },
    canofflineTeam() {
      return queryPermission('offlineTeam') // 合伙人
    },
    canofflineMerchant() {
      return queryPermission('offlineMerchant') // 所有用户
    },
    canVip() {
      return queryPermission('vip') // VIP
    },
    canonlineMerchant() {
      return queryPermission('onlineMerchant') // 线上yonghu
    },
    tabNames() {
      return [allUser, offlineTeam, offlineMerchant, onlineVip].map(({ name }) => name)
    }
  },
  mounted() {
    this.currentTabName = this.tabNames[0]
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
}
</style>
