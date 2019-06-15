<template>
  <div>
    <el-card class="box-card tradeForm" body-style="padding:0">
      <div slot="header" class="clearfix">
        <span style="display:inline-block;width:500px">总收益：{{profitAllData.monthProfit|normAmount}}元</span>
      </div>
      <el-row class="Options">
        <el-form label-width="130px" label-position="left">
          <el-col :span="10">
            <el-form-item label="设备还款分润" v-if="type !== typeMap.USERS||isPartner">
              <span>总共{{profitAllData.monthRepaymentProfitCount}}个月，还款总分润{{profitAllData.monthRepaymentProfit|normAmount}}元</span>
            </el-form-item>
            <el-form-item label="设备收款分润" v-if="type !== typeMap.USERS||isPartner">
              <span>总共{{profitAllData.monthCollectionProfitCount}}个月，收款总分润{{profitAllData.monthCollectionProfit|normAmount}}元</span>
            </el-form-item>
            <!-- <el-form-item label="快捷还款分润">
              <span>总共{{profitAllData.monthRepaymentProfitCountVip?profitAllData.monthRepaymentProfitCountVip:0}}个月，还款总分润{{profitAllData.monthRepaymentProfitVip|normAmount}}元</span>
            </el-form-item>-->
            <!-- <el-form-item label="快捷收款分润">
              <span>总共{{profitAllData.monthCollectionProfitCountVip?profitAllData.monthCollectionProfitCountVip:0}}个月，收款总分润{{profitAllData.monthCollectionProfitVip|normAmount}}元</span>
            </el-form-item>-->
            <el-form-item
              v-if="type !== typeMap.USERS&&accountinfo.organLevel !== Number(levelMap.SECONDORGAN)"
              label="返现奖励"
            >
              <span>总共{{profitAllData.cashTimes}}个商户激活，总收益{{profitAllData.cashReward|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item v-if="aboutDev" label="平台购机">
              <span>总共{{profitAllData.purchaseFrequency}}笔购机订单，总收益{{profitAllData.purchaseProfit|normAmount}}元</span>
            </el-form-item>
            <el-form-item v-if="aboutDev" label="激活奖励">
              <span>总共{{profitAllData.activationTimes}}个商户激活，总收益{{profitAllData.activateRevenue|normAmount}}元</span>
            </el-form-item>
            <!-- <el-form-item v-if="type === typeMap.USERS" label="推荐奖励">
              <span>总共{{profitAllData.onlineInviteCount?profitAllData.onlineInviteCount: 0}}个用户认证，总收益{{profitAllData.onlineInviteAmt|normAmount}}元</span>
            </el-form-item>-->

            <el-form-item label="开通合伙人奖励" v-if="type !== typeMap.USERS||isPartner">
              <span>总共{{openParnterData.openPartnerCount}}个商户开通合伙人，总收益{{openParnterData.openPartnerAmt|normAmount}}元</span>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <el-card class="box-card tradeForm" body-style="padding:0">
      <div slot="header" class="clearfix">
        <span>余额总提现：{{profitAllData.monthCashInfoAllSum|normAmount}}元 &nbsp;&nbsp;共{{profitAllData.monthCashInfoAllcount}}笔提现</span>
        <el-date-picker
          type="month"
          placeholder="选择月份"
          size="small"
          v-model="monthWithdraw"
          @change="getdata"
          format="yyyy 年 MM 月"
          value-format="yyyy-MM"
          :picker-options="pickerOptions"
          class="getDate"
          :clearable="false"
        ></el-date-picker>
      </div>
      <el-form label-width="130px" label-position="left">
        <el-row class="Options">
          <el-col :span="10">
            <el-form-item label="余额提现">
              <span>本月总共提现{{monthCashData|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <span style="color:#999;font-size:12px">
            <i class="el-icon-info" style="width:30px"></i> 统计提现到账成功的金额
          </span>
          <el-button size="mini" type="warning" @click="withdrawShow = true" class="btn">提现明细</el-button>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card tradeForm" body-style="padding:0">
      <div slot="header" class="clearfix">
        <span>月度收益： {{monthProfitData.monthProfit|normAmount}}元</span>
        <el-date-picker
          type="month"
          placeholder="选择月份"
          size="small"
          v-model="monthVal"
          @change="getdata"
          format="yyyy 年 MM 月"
          value-format="yyyy-MM"
          :picker-options="pickerOptions"
          class="getDate"
          :clearable="false"
        ></el-date-picker>
      </div>
      <el-form label-width="130px" label-position="left">
        <!-- <el-row class="Options">
          <el-col :span="10">
            <el-form-item label="快捷还款分润">
              <span>{{monthVal}}，还款分润{{monthProfitData.monthRepaymentProfitVip|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <span style="color:#999;font-size:12px">
            <i class="el-icon-info" style="width:30px"></i> 每月15号结算上个月的分润
          </span>
        </el-row>-->
        <!-- <el-row class="Options">
          <el-col :span="10">
            <el-form-item label="快捷收款分润">
              <span>{{monthVal}}，收款分润{{monthProfitData.monthCollectionProfitVip|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <span style="color:#999;font-size:12px">
            <i class="el-icon-info" style="width:30px"></i> 每月15号结算上个月的分润
          </span>
        </el-row>-->
        <el-row class="Options" v-if="type !== typeMap.USERS||isPartner">
          <el-col :span="10">
            <el-form-item label="设备还款分润">
              <span>{{monthVal}}，还款分润{{monthProfitData.monthRepaymentProfit|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <span style="color:#999;font-size:12px">
            <i class="el-icon-info" style="width:30px"></i> 每月15号结算上个月的分润
          </span>
          <el-button
            size="mini"
            type="warning"
            @click="shareBenefit(dealTypeMap.REPAY)"
            class="btn"
          >收益明细</el-button>
        </el-row>
        <el-row class="Options" v-if="type !== typeMap.USERS||isPartner">
          <el-col :span="10">
            <el-form-item label="设备收款分润">
              <span>{{monthVal}}，收款分润{{monthProfitData.monthCollectionProfit|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <span style="color:#999;font-size:12px">
            <i class="el-icon-info" style="width:30px"></i> 每月15号结算上个月的分润
          </span>
          <el-button
            size="mini"
            type="warning"
            @click="shareBenefit(dealTypeMap.RECEIPT)"
            class="btn"
          >收益明细</el-button>
        </el-row>
        <el-row class="Options" v-if="aboutDev">
          <el-col :span="10">
            <el-form-item label="平台购机">
              <span>{{monthProfitData.purchaseFrequency}}笔已结算购机订单,收益{{monthProfitData.purchaseProfit|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <span style="color:#999;font-size:12px">
            <i class="el-icon-info" style="width:30px"></i> 只统计已确认收货并完成结算的购机订单
          </span>
          <el-button size="mini" type="warning" @click="upgrade(1)" class="btn">收益明细</el-button>
        </el-row>
        <el-row class="Options" v-if="aboutDev">
          <el-col :span="10">
            <el-form-item label="激活奖励">
              <span>{{monthProfitData.activationTimes}}个商户激活,收益{{monthProfitData.activateRevenue|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <el-button size="mini" type="warning" @click="upgrade(2)" class="btn">收益明细</el-button>
        </el-row>
        <!-- <el-row class="Options" v-if="type !== typeMap.USERS&&accountinfo.organLevel !== 9">
          <el-col :span="10">
            <el-form-item label="返现奖励">
              <span>{{monthProfitData.cashTimes}}个商户激活,收益{{monthProfitData.cashReward|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <span style="color:#999;font-size:12px">
            <i class="el-icon-info" style="width:30px"></i> 只有【YXJ-002】型号的设备激活享受返现奖励
          </span>
          <el-button size="mini" type="warning" @click="upgrade(3)" class="btn">收益明细</el-button>
        </el-row> -->
        <!-- <el-row class="Options" v-if="type === typeMap.USERS">
          <el-col :span="10">
            <el-form-item label="推荐奖励">
              <span>{{monthProfitData.onlineInviteCount}}个用户完成累计10000元还款,收益{{monthProfitData.onlineInviteAmt|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <el-button size="mini" type="warning" @click="recommend" class="btn">收益明细</el-button>
        </el-row>-->

        <el-row class="Options" v-if="type !== typeMap.USERS||isPartner">
          <el-col :span="10">
            <el-form-item label="开通合伙人奖励">
              <span>{{openParnterData.monthOpenCount}}个商户开通合伙人,收益{{openParnterData.monthOpenAmt|normAmount}}元</span>
            </el-form-item>
          </el-col>
          <el-button size="mini" type="warning" @click="upgrade(4)" class="btn">收益明细</el-button>
        </el-row>
      </el-form>
    </el-card>
    <!-- 收益详情 -->
    <earnings-details
      v-if="earningsShow"
      :flag="earningsShow"
      @handleClose="handleClose"
      :earningstype="earningstype"
      :monthVal="monthVal"
      :organId="organId"
    ></earnings-details>
    <!-- 提现详情 -->
    <withdraw-details
      v-if="withdrawShow"
      :flag="withdrawShow"
      @withdrawClose="withdrawClose"
      :monthWithdraw="monthWithdraw"
      :organId="organId"
    ></withdraw-details>
    <recommend-details
      v-if="recommendShow"
      @recommendClose="recommendClose"
      :monthVal="monthVal"
      :organId="organId"
    ></recommend-details>
    <!-- 分润 -->
    <team-distribution-month-detail
      v-if="teamDetailShow"
      @closeDetail="teamCloseDetail"
      :type="dealType"
      :teamMonthDetailData="teamMonthDetailData"
    />
    <province-distribution-detail
      v-if="provincedetailShow"
      @closeDetail="provincecloseDetail"
      :dealType="dealType"
      :provinceDetailData="provinceDetailData"
    />
    <org-distribution-detail
      v-if="orgdetailShow"
      @closeDetail="orgCloseDetail"
      :dealType="dealType"
      :organDetailData="organDetailData"
    />
  </div>
</template>
<script>
import { queryPermission } from '@/util'
import { post } from '../store/requestFacade.js'
// 弹窗组件
import earningsDetails from '../views/treasuryManagement/earningsDetails'
import withdrawDetails from '../views/treasuryManagement/withdrawDetails'
import recommendDetails from './recommendDetails'
import teamDistributionMonthDetail from '../views/profitDistribution/posDistribution/teamProfitDistribution/teamDistributionMonthDetail/repayIndex' // 设备合伙人分润弹窗
import orgDistributionDetail from '../views/profitDistribution/posDistribution/orgProfitDistribution/orgDistributionDetail' // 设备机构分润弹窗
import provinceDistributionDetail from '../views/profitDistribution/posDistribution/provinceProfitDistribution/provinceDistributionDetail' // 设备分公司分润弹窗
import { levelMap } from '../server/level.js'

const dealTypeMap = {
  REPAY: 2,
  RECEIPT: 1
}
const typeMap = {
  USERS: 2
}
export default {
  name: 'treasury-management',
  components: {
    earningsDetails,
    withdrawDetails,
    recommendDetails,
    teamDistributionMonthDetail,
    orgDistributionDetail,
    provinceDistributionDetail
  },
  props: {
    organId: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      levelMap: levelMap,
      dealTypeMap: dealTypeMap,
      typeMap: typeMap,
      dealType: '',
      monthVal: '',
      isPartner: '',
      monthWithdraw: '',
      earningsShow: false,
      withdrawShow: false,
      teamDetailShow: false,
      orgdetailShow: false,
      provincedetailShow: false,
      recommendShow: false,
      accountinfo: {},
      earningstype: '',
      pickerOptions: '',
      monthProfitData: {},
      openParnterData: {},
      monthCashData: '',
      profitAllData: {},
      teamMonthDetailData: {
        organId: '',
        addDate: '',
        organName: ''
      },
      provinceDetailData: {
        organId: '',
        addDate: '',
        organName: ''
      },
      organDetailData: {
        organId: '',
        addDate: '',
        organName: '',
        organType: ''
      }
    }
  },
  methods: {
    getdata() {
      this.monthProfit()
      this.monthCash()
      this.openParnter()
    },
    handleClose() {
      this.earningsShow = false
    },
    upgrade(row) {
      this.earningsShow = true
      this.earningstype = row
    },
    withdrawClose() {
      this.withdrawShow = false
    },
    recommend() {
      this.recommendShow = true
    },
    recommendClose() {
      this.recommendShow = false
    },
    // 获取账户信息
    async accountInfo() {
      try {
        const res = await post({
          url: 'organAccount/AccountInfo',
          data: {
            organId: this.organId ? this.organId : ''
          }
        })
        this.accountinfo = res.data
        this.isPartner = res.data.isPartner
        this.pickerOptions = {
          disabledDate(time) {
            return (
              time.getTime() > Date.now() - 8.64e6 ||
              time.getTime() < res.data.addDate - 86400000 * 90
            )
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取月度收益
    async monthProfit() {
      try {
        const res = await post({
          url:
            this.type === typeMap.USERS
              ? 'organAccount/partnerMonthProfit'
              : 'organAccount/monthProfit',
          data: {
            addDate: this.monthVal,
            organId: this.organId ? this.organId : ''
          }
        })
        this.monthProfitData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 获取月度提现
    async monthCash() {
      try {
        const res = await post({
          url: 'organAccount/monthCash',
          data: {
            addDate: this.monthWithdraw,
            organId: this.organId ? this.organId : ''
          }
        })
        this.monthCashData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    cutMonth(month) {
      if (month < 10) {
        return '0' + month
      }
      return month
    },
    requestWithdraw() {
      this.requestWithdrawShow = true
    },
    requestWithdrawClose() {
      this.requestWithdrawShow = false
      this.accountInfo()
    },
    // 获取总提现及总收益
    async monthProfitAll() {
      try {
        const res = await post({
          url: 'organAccount/monthProfitAll',
          data: {
            organId: this.organId ? this.organId : ''
          }
        })
        this.profitAllData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async openParnter() {
      try {
        const res = await post({
          url: 'profit/openParnter',
          data: {
            addDate: this.monthVal,
            organId: this.organId ? this.organId : ''
          }
        })
        this.openParnterData = res.data
      } catch (err) {
        console.log(err)
      }
    },
    // 点击分润
    shareBenefit(dealType) {
      this.dealType = dealType
      if (this.type === typeMap.USERS) {
        this.teamDetailShow = true
        this.teamMonthDetailData.organId = this.organId
        this.teamMonthDetailData.addDate = this.monthVal
        this.teamMonthDetailData.organName = this.accountinfo.name
      }
      if (this.accountinfo.organLevel === Number(levelMap.PROVINCIAL)) {
        this.provincedetailShow = true
        this.provinceDetailData.organId = this.accountinfo.organId
        this.provinceDetailData.addDate = this.monthVal
        this.provinceDetailData.organName = this.accountinfo.organName
      }
      if (
        this.accountinfo.organLevel === Number(levelMap.ORGAN) ||
        this.accountinfo.organLevel === Number(levelMap.SECONDORGAN)
      ) {
        this.orgdetailShow = true
        this.organDetailData.organType = this.accountinfo.organLevel
        this.organDetailData.organId = this.accountinfo.organId
        this.organDetailData.addDate = this.monthVal
        this.organDetailData.organName = this.accountinfo.organName
      }
    },
    // 合伙人
    teamCloseDetail() {
      this.teamDetailShow = false
    },
    // 分公司
    provincecloseDetail() {
      this.provincedetailShow = false
    },
    orgCloseDetail() {
      this.orgdetailShow = false
    }
  },
  async created() {
    const getTime = new Date()
    this.monthVal = getTime.getFullYear() + '-' + this.cutMonth(getTime.getMonth() + 1)
    this.monthWithdraw = getTime.getFullYear() + '-' + this.cutMonth(getTime.getMonth() + 1)
    await this.accountInfo()
    this.monthProfit()
    this.monthCash()
    this.monthProfitAll()
    this.openParnter()
  },
  computed: {
    canapplyWithdrawal() {
      return queryPermission('applyWithdrawal')
    },
    aboutDev() {
      if (this.accountinfo.organLevel >= this.levelMap.ORGAN && this.type !== typeMap.USERS) {
        return true
      } else if (this.isPartner) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style scoped>
.base-tit {
  margin: 15px 0;
}
.balance {
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  padding: 0 30px;
  border-radius: 5px;
}
.treasuryInfo {
  margin-top: 15px;
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 5px;
}
p {
  margin-top: 8px;
  font-size: 14px;
  color: #777;
  text-indent: 1em;
}
span {
  margin-left: 10px;
}
.tradeForm {
  margin-top: 15px;
  line-height: 32px;
  border-radius: 5px;
  font-weight: bold;
}
.getDate {
  width: 150px;
  float: right;
  margin-right: 20px;
}
.clearfix {
  height: 20px;
  line-height: 20px;
}
i {
  display: inline-block;
  width: 100px;
  font-style: normal;
}
.btn {
  float: right;
  margin-right: 40px;
}
.Options {
  padding-left: 25px;
}
.el-form-item {
  margin-bottom: 0px;
}
.formItem {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
</style>
