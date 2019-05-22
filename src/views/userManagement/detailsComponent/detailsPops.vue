<template>
  <div>
    <div class="info">
      <div>
        <el-row>
          <el-col :span="5">
            <p>
              <span class="slogan">手机号码</span>
              <span>{{userInfo.phone}}</span>
            </p>
            <p>
              <span class="slogan">归属机构</span>
              <span>{{userInfo.organName}}</span>
            </p>
            <p>
              <span class="slogan">推荐人</span>
              <span>{{userInfo.inviteOrganName}} {{userInfo.invitePhome}}</span>
            </p>
            <p>
              <span class="slogan">合伙人</span>
              <span>{{userInfo.partnerName}} {{userInfo.partnerPhome}}</span>
            </p>
          </el-col>
          <el-col :span="5">
            <p>
              <span class="slogan">实名认证</span>
              <span>{{userInfo.realNameAuthStatus|cutRealNameStatus}}</span>
            </p>
            <p>
              <span class="slogan">注册时间</span>
              <span>{{userInfo.addDate|cutTime}}</span>
            </p>
            <p>
              <span class="slogan">认证时间</span>
              <span>{{userInfo.certificationDate|cutTime}}</span>
            </p>
            <p v-if="userInfo.onLineActivationDate">
              <span class="slogan">激活时间</span>
              <span>{{userInfo.onLineActivationDate|cutTime}}</span>
            </p>
            <p v-if="userInfo.extensionDate">
              <span class="slogan">完成时间</span>
              <span>{{userInfo.extensionDate|cutTime}}</span>
            </p>
            <p v-if="userInfo.upgradeVipDate">
              <span class="slogan">开通时间</span>
              <span>{{userInfo.upgradeVipDate|cutTime}}</span>
            </p>
          </el-col>
          <el-col :span="5">
            <p>
              <span class="slogan">账户状态</span>
              <span>{{userInfo.organStatus|cutOrganStatus}}</span>
            </p>

            <p>
              <span class="slogan">账户余额</span>
              <span>￥{{userInfo.balance|normAmount}}</span>
            </p>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-tabs v-model="activeName" v-if="userInfo.realNameAuthStatus === 1">
          <el-tab-pane label="认证详情" name="authentication">
            <authentication-details :organId="userInfo.organId" :userId="userInfo.userId"></authentication-details>
          </el-tab-pane>
          <el-tab-pane label="商户详情" v-if="userInfo.isMerchant === 1" name="commercial">
            <commercial-details :organId="userInfo.organId"></commercial-details>
          </el-tab-pane>
          <el-tab-pane label="信用卡" name="creditCard">
            <credit-card-details :organId="userInfo.organId"></credit-card-details>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { queryPermission } from '@/util'
import { post } from '../../../store/requestFacade.js'
import authenticationDetails from './authenticationDetails'
import partnerDetails from './partnerDetails'
import commercialDetails from './commercialDetails'
import creditCardDetails from './creditCardDetails'
export default {
  name: 'details-pops',
  components: {
    authenticationDetails,
    partnerDetails,
    commercialDetails,
    creditCardDetails
  },
  props: {
    detailsData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: 'authentication',
      userInfo: {}
    }
  },
  methods: {
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
    }
  },
  mounted() {
    this.particulars = this.flag
    console.log(this.detailsData)
    this.getUserInfo()
  },
  filters: {
    cutRealNameStatus(realNameAuthStatus) {
      return realNameAuthStatus === 1 ? '已认证' : '未认证'
    },
    cutOrganStatus(status) {
      const statusMap = {
        0: '禁用',
        1: '正常'
      }
      return statusMap[status]
    }
  },
  computed: {
    canResetUserPassword() {
      return queryPermission('ResetUserPassword')
    }
  }
}
</script>
<style scoped>
.info {
  font-size: 14px;
  margin: 0 15px;
}
.torow {
  margin: 15px 15px;
}
.btn {
  margin-top: -20px;
  float: right;
  margin-right: 80px;
}
.slogan {
  font-weight: bold;
  margin-right: 15px;
}
p {
  margin-top: 10px;
}
</style>
