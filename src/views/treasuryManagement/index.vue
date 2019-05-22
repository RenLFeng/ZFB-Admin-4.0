<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>账户管理</el-breadcrumb-item>
        <el-breadcrumb-item>我的账户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="balance">
      <h4 style="display: inline-block;margin-right:60px">账户余额：{{accountinfo.balance|normAmount}}元</h4>
      <el-button type="primary" v-if="canapplyWithdrawal" @click="requestWithdraw">申请提现</el-button>
    </div>
    <div class="treasuryInfo">
      <el-form label-width="100px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-tag>基本信息</el-tag>
            <el-form-item label="机构名称">
              <span>{{accountinfo.organName}}</span>
            </el-form-item>
            <el-form-item label="机构编码">
              <span>{{accountinfo.useraccount}}</span>
            </el-form-item>
            <el-form-item label="机构类型">
              <span>{{accountinfo.organLevel|organType}}</span>
            </el-form-item>
            <el-form-item label="所属上级">
              <span>{{accountinfo.upOrganName}}</span>
            </el-form-item>
            <el-form-item label="所在地区">
              <span>{{accountinfo.merchantProv}}{{accountinfo.merchantCity}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-tag>结算信息</el-tag>
            <el-form-item label="开户银行">
              <span>{{accountinfo.btName}}</span>
            </el-form-item>
            <el-form-item label="支行">
              <span>{{accountinfo.subName}}</span>
            </el-form-item>
            <el-form-item label="储蓄卡号">
              <span>{{accountinfo.bankCardNo}}</span>
            </el-form-item>
            <el-form-item label="预留手机号">
              <span>{{accountinfo.cardPhone}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-tag>管理者信息</el-tag>
            <el-form-item label="姓名">
              <span>{{accountinfo.name}}</span>
            </el-form-item>
            <el-form-item label="身份证号码">
              <span>{{accountinfo.idCard}}</span>
            </el-form-item>
            <el-form-item label="联系方式">
              <span>{{accountinfo.phone}}</span>
            </el-form-item>
            <el-form-item label="详细地址">
              <span>{{accountinfo.detAddress}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-tag>库存信息</el-tag>
            <el-form-item label="设备库存">
              <span>{{accountinfo.devStock}}台</span>
            </el-form-item>
            <el-form-item label="设备下发">
              <span>{{accountinfo.lowerNumber}}台</span>
            </el-form-item>
            <el-form-item label="设备激活">
              <el-dropdown>
                <el-button type="text">
                  <span>{{accountinfo.devActivation}}台</span>
                  <b class="el-icon-arrow-down el-icon--right"></b>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item, i) in accountinfo.posStockActivitySum" :key="i">
                    {{item.brandSubName}}
                    <span>激活{{item.brandSubNameSum}}台</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
            <el-form-item label="激活码库存">
              <span>{{accountinfo.codeInventory}}台</span>
            </el-form-item>
            <el-form-item label="激活码下发">
              <span>{{accountinfo.codeOutNumber}}台</span>
            </el-form-item>
            <el-form-item label="激活码激活">
              <span>{{accountinfo.codeActivateNumber}}台</span>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-tag>分润费率</el-tag>
            <el-form-item label="设备还款费率">
              <span>万{{accountinfo.posPayFee}}</span>
            </el-form-item>
            <el-form-item label="设备收款费率">
              <span>万{{accountinfo.posRepayFee}}</span>
            </el-form-item>
            <el-form-item label="快捷还款费率">
              <span>万{{accountinfo.quickPayFee}}</span>
            </el-form-item>
            <el-form-item label="快捷收款费率">
              <span>万{{accountinfo.quickRepayFee}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="accountinfo.isOpen === 1">
            <el-tag>开通合伙人奖励分配规则</el-tag>
            <el-form-item label="省级机构" v-if="accountinfo.organLevel <= 2">
              <span>{{accountinfo.provinceAmt}}元</span>
            </el-form-item>
            <el-form-item label="一级机构" v-if="accountinfo.organLevel <= 3">
              <span>{{accountinfo.organAmt}}元</span>
            </el-form-item>
            <el-form-item label="二级机构">
              <span>{{accountinfo.countyAmt}}元</span>
            </el-form-item>
            <el-form-item label="直属合伙人">
              <span>{{accountinfo.directAmt}}元</span>
            </el-form-item>
            <el-form-item label="间接合伙人">
              <span>{{accountinfo.indirectAmt}}元</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <account-info></account-info>
    <request-withdrawal
      v-if="requestWithdrawShow"
      :flag="requestWithdrawShow"
      :balance="accountinfo.balance"
      @requestWithdrawClose="requestWithdrawClose"
    />
  </div>
</template>
<script>
import { queryPermission } from '@/util'
import requestWithdrawal from './requestWithdrawal'
import { post } from '../../store/requestFacade.js'
import accountInfo from '../../components/accountInfo'
export default {
  name: 'treasury-management',
  components: {
    requestWithdrawal,
    accountInfo
  },
  data() {
    return {
      requestWithdrawShow: false,
      accountinfo: {}
    }
  },
  methods: {
    getdata() {
      this.monthProfit()
      this.monthCash()
    },
    requestWithdraw() {
      this.requestWithdrawShow = true
    },
    async accountInfo() {
      try {
        const res = await post({
          url: 'organAccount/AccountInfo'
        })
        this.accountinfo = res.data
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6 || time.getTime() < res.data.addDate
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    requestWithdrawClose() {
      this.requestWithdrawShow = false
      this.accountInfo()
    }
  },
  async created() {
    this.level = localStorage.getItem('level')
    await this.accountInfo()
  },
  computed: {
    canapplyWithdrawal() {
      return queryPermission('applyWithdrawal')
    }
  },
  filters: {
    organType(type) {
      const organTypeMap = {
        1: '平台',
        2: '省级机构',
        3: '一级机构',
        9: '二级机构'
      }
      return organTypeMap[type]
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
  display: flex;
}
el-dropdown-item {
  width: 200;
}
.el-form-item {
  margin-bottom: 0;
}
</style>
