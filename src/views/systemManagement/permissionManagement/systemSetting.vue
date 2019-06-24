<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tabs v-model="activeName" style="margin-left:15px">
      <el-tab-pane label="客服电话" name="customerServiceTelephone">
        <div class="ServiceTel">
          客服电话:
          <el-input placeholder="请输入客服电话" v-model="sanzhongServerTel" style="width:200px"></el-input>
          <el-button type="primary" style="marginLeft:40px" @click="updateServerTel">保存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="分润配置" name="systemFee">
        <sysem-fee></sysem-fee>
      </el-tab-pane>

     <el-tab-pane label="活动配置" name="cashPledge" v-if="candepositConfig && showCandepositConfig">
        <cash-pledge @addCashPledge="addCashPledge" v-if="addCashPledgeShow===1" @closeActivity="showCandepositConfigFn"></cash-pledge>
        <add-cash-pledge
          @goBack="goBack"
          v-if="addCashPledgeShow===2"
          :cashPledgedetail="cashPledgedetail"
        ></add-cash-pledge>
      </el-tab-pane>


      <div v-if="candepositConfig && close">
        <cash-pledge @addCashPledge="addCashPledge" v-if="addCashPledgeShow===1"></cash-pledge>
        <add-cash-pledge
        @goBack="goBack"
        v-if="addCashPledgeShow===2"
        :cashPledgedetail="cashPledgedetail"
        ></add-cash-pledge>
      </div>


      <el-tab-pane label="开通合伙人配置" name="partnerConfig">
        <partner-config></partner-config>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import { post } from '../../../store/requestFacade'
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
      close:false,
      showCandepositConfig:true,
      activeName: 'customerServiceTelephone',
      systemFeeActive: 'provincial',
      addCashPledgeShow: 1,
      cashPledgedetail: {},
      sanzhongServerTel: ''
    }
  },
  created(){
    this.getPhoneFn();
  },
  methods: {
    showCandepositConfigFn(data){
     this.showCandepositConfig=data.show;
       this.close=data.close;
    },
    addCashPledge(row) {
      this.cashPledgedetail = row
      this.addCashPledgeShow = 2
    },
    goBack() {
      this.addCashPledgeShow = 1
    },
    // get 客服电话
     async getPhoneFn() {
      const api = 'routineConfig/getPhone'
      try {
        const res = await post({
          url: api,
          data: {
       
          }
        })
        if (res.msg === '成功') {
           this.sanzhongServerTel=res.data;
        }
      } catch (error) {
        console.log(error)
      }
    },
    async updateServerTel() {
      const api = 'routineConfig/config'
      const tel = this.sanzhongServerTel
      if (tel === '') {
        this.$message.info('请输入客服电话')
        return
      }
      if (!/^\d{10,20}$/.test(tel)) {
        this.$message.info('输入客服电话的不合法')
        return
      }
      try {
        const end = await post({
          url: api,
          data: {
            phone: tel
          }
        })
        if (end.msg === '成功') {
          this.$message.success('修改成功')
        }
      } catch (error) {
        console.log(error)
      }
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
.ServiceTel {
  min-height: 200px;
  padding: 20px;
  background-color: #fff;
}
</style>
