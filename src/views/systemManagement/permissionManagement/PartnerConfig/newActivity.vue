<template>
  <el-dialog :title="title" :visible="true" :before-close="close" :close-on-click-modal="false">
    <div class="tableExpandLayout">
      <el-form :inline="true" :model="addActivityData" :rules="rules" ref="ruleForm">
        <el-form-item label="活动名称" prop="activityName">
          <el-input :disabled="btnExist" clearable v-model="addActivityData.activityName"></el-input>
        </el-form-item>
        <div style="display:flex">
          <div>
            <h4>开通合伙人</h4>
            <el-form-item label="开通费用" prop="activityAmount">
              <el-input
                :disabled="btnExist"
                clearable
                v-model="addActivityData.activityAmount"
                placeholder="0"
              ></el-input>
            </el-form-item>
            <span style="line-height:40px">元</span>
          </div>
          <div style="margin:0 0 0 20px">
            <h4>手续费</h4>
            <el-form-item label="平台" prop="platformProfitAmount">
              <el-input
                clearable
                :disabled="btnExist"
                v-model="addActivityData.platformProfitAmount"
                placeholder="0"
              ></el-input>
            </el-form-item>
            <span style="line-height:40px">元</span>
          </div>
        </div>
        <h4>
          激活奖励
          <span style="font-size:14px">(用户激活当日起，给予直属上两级合伙人奖励金)</span>
        </h4>
        <el-form-item label="设备型号" prop="brandId">
          <el-select
            @change="getPrice(addActivityData.brandId)"
            :disabled="btnExist"
            v-model="addActivityData.brandId"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="v in models"
              :value="v.brandId"
              :label="v.brandSubName"
              :key="v.brandId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备数量" prop="posNums">
          <el-input
            :disabled="btnExist"
            @input="calAmt"
            v-model="addActivityData.posNums"
            placeholder="0"
            clearable
          ></el-input>
        </el-form-item>
        <span style="line-height:40px">台</span>
        <br>
        <el-form-item label="激活总金额">
          <span>{{addActivityData.activityRewardAmount}}</span>
        </el-form-item>
        <span style="line-height:40px">元</span>
        <h4>
          订单返现
          <span style="font-size:14px">(订单返给直属机构的设备款)</span>
        </h4>
        <el-form-item label="直属机构" prop="orderCashBackAmount">
          <el-input
            clearable
            :disabled="btnExist"
            v-model="addActivityData.orderCashBackAmount"
            placeholder="0"
          ></el-input>
        </el-form-item>
        <span style="line-height:40px">元</span>
        <h4>开通合伙人奖励</h4>
        <el-form-item label="奖励总金额" prop="openPatenerRewardAmount">
          <el-input
            clearable
            :disabled="btnExist"
            v-model="addActivityData.openPatenerRewardAmount"
          ></el-input>
        </el-form-item>
        <span style="line-height:40px">元</span>
        <div>
          <h4 style="font-size:16px;font-weight:normal">开通合伙人奖励分配规则</h4>
          <el-form-item label="分公司机构" prop="provRewardAmount">
            <el-input clearable :disabled="btnExist" v-model="addActivityData.provRewardAmount"></el-input>
          </el-form-item>
          <span style="line-height:40px">元</span>
          <el-form-item label="子公司" prop="onelevelOrganRewardAmount">
            <el-input
              clearable
              :disabled="btnExist"
              v-model="addActivityData.onelevelOrganRewardAmount"
            ></el-input>
          </el-form-item>
          <span style="line-height:40px">元</span>
          <el-form-item label="高级合伙人" prop="twolevelOrganRewardAmount">
            <el-input
              clearable
              :disabled="btnExist"
              v-model="addActivityData.twolevelOrganRewardAmount"
            ></el-input>
          </el-form-item>
          <span style="line-height:40px">元</span>
          <el-form-item label="直接合伙人" prop="directPartnerRewardAmount">
            <el-input :disabled="btnExist" v-model="addActivityData.directPartnerRewardAmount"></el-input>
          </el-form-item>
          <span style="line-height:40px">元</span>
          <el-form-item label="间接合伙人" prop="indirectPartnerRewardAmount">
            <el-input
              clearable
              :disabled="btnExist"
              v-model="addActivityData.indirectPartnerRewardAmount"
            ></el-input>
          </el-form-item>
          <span style="line-height:40px">元</span>
          <el-form-item>
            <el-button
              style="margin:0 0 0 10px"
              type="primary"
              v-show="!btnExist"
              :loading="isSend"
              @click="saveBtn('ruleForm')"
            >保存配置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import { post } from '../../../../store/requestFacade.js'
import { checkmoney } from './map'
export default {
  props: {
    detail: {
      type: Object,
      default: () => null
    },
    currentDetail: {
      type: Object,
      default: () => null
    },
    getType: {
      type: String,
      default: null
    },
    models: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: '',
      btnExist: false,
      isSend: false,
      devPrice: '',
      addActivityData: {
        activityName: '',
        activityAmount: '',
        brandId: '',
        posNums: '',
        openPatenerRewardAmount: '',
        orderCashBackAmount: '',
        platformProfitAmount: '',
        activityRewardAmount: 0,
        provRewardAmount: '',
        onelevelOrganRewardAmount: '',
        twolevelOrganRewardAmount: '',
        directPartnerRewardAmount: '',
        indirectPartnerRewardAmount: ''
      },
      rules: {
        activityName: { required: true, message: '请输入活动名称', trigger: 'blur' },
        activityAmount: { required: true, message: '请输入开通费用', trigger: 'blur' },
        brandId: { required: true, message: '请选择设备型号', trigger: 'change' },
        posNums: { required: true, message: '请输入设备数量', trigger: 'blur' },
        openPatenerRewardAmount: {
          required: true,
          message: '请输入开通呵呵 人奖励总金额',
          trigger: 'blur'
        },
        orderCashBackAmount: {
          required: true,
          message: '请输入直属机构订单返现金额',
          trigger: 'blur'
        },
        platformProfitAmount: { required: true, message: '请输入平台手续费', trigger: 'blur' },
        provRewardAmount: { required: true, message: '请输入分公司奖励金额', trigger: 'blur' },
        onelevelOrganRewardAmount: {
          required: true,
          message: '请输入子公司奖励金额',
          trigger: 'blur'
        },
        twolevelOrganRewardAmount: {
          required: true,
          message: '请输入高级合伙人奖励金额',
          trigger: 'blur'
        },
        directPartnerRewardAmount: {
          required: true,
          message: '请输入直接合伙人奖励金额',
          trigger: 'blur'
        },
        indirectPartnerRewardAmount: {
          required: true,
          message: '请输入间接合伙人奖励金额',
          trigger: 'blur'
        }
      }
    }
  },
  methods: {
    saveBtn(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          console.log('valid: ', valid)
          if (this.getType === 'edit') {
            this.editActivity()
          } else {
            this.save()
          }
        } else {
          return false
        }
      })
    },
    // 添加活动
    async save() {
      try {
        const data = {
          activityName: this.addActivityData.activityName,
          activityAmount: this.addActivityData.activityAmount, // 开通费用
          brandId: this.addActivityData.brandId, // 设备型号
          posNums: this.addActivityData.posNums, // 设备数量
          openPatenerRewardAmount: this.addActivityData.openPatenerRewardAmount, // 开通合伙人奖励总金额
          orderCashBackAmount: this.addActivityData.orderCashBackAmount, // 直属机构
          platformProfitAmount: this.addActivityData.platformProfitAmount, // 平台手续费
          activityRewardAmount: this.addActivityData.activityRewardAmount, // 激活奖励总金额
          provRewardAmount: this.addActivityData.provRewardAmount, // 分公司机构
          onelevelOrganRewardAmount: this.addActivityData.onelevelOrganRewardAmount, // 子公司
          twolevelOrganRewardAmount: this.addActivityData.twolevelOrganRewardAmount, // 高级合伙人
          directPartnerRewardAmount: this.addActivityData.directPartnerRewardAmount, // 直接机构
          indirectPartnerRewardAmount: this.addActivityData.indirectPartnerRewardAmount, // 间接机构
          enable: 0
        }
        const { latchall, latchrule } = checkmoney(data)
        if (!latchall) {
          this.$message.info(
            '请检查（开通合伙人费用=平台手续费+激活奖励+订单返现+开通合伙人总金额）是否正确？',
            5000
          )
          return
        }
        if (!latchrule) {
          this.$message.info('请检查开通合伙人奖励总金额与开通合伙人奖励分配金额是否相等', 5000)
          return
        }
        this.isSend = true
        const res = await post({
          url: 'activity/add',
          data
        })
        this.isSend = false
        console.log('data: ', data)
        this.$emit('fresh')
        this.$message({
          type: 'success',
          message: res.msg
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑活动
    async editActivity() {
      const data = {
        activityName: this.addActivityData.activityName,
        activityAmount: this.addActivityData.activityAmount, // 开通费用
        brandId: this.addActivityData.brandId, // 设备型号
        posNums: this.addActivityData.posNums, // 设备数量
        openPatenerRewardAmount: this.addActivityData.openPatenerRewardAmount, // 开通合伙人奖励总金额
        orderCashBackAmount: this.addActivityData.orderCashBackAmount, // 直属机构
        platformProfitAmount: this.addActivityData.platformProfitAmount, // 平台手续费
        activityRewardAmount: this.addActivityData.activityRewardAmount, // 激活奖励总金额
        provRewardAmount: this.addActivityData.provRewardAmount, // 分公司机构
        onelevelOrganRewardAmount: this.addActivityData.onelevelOrganRewardAmount, // 子公司
        twolevelOrganRewardAmount: this.addActivityData.twolevelOrganRewardAmount, // 高级合伙人
        directPartnerRewardAmount: this.addActivityData.directPartnerRewardAmount, // 直接机构
        indirectPartnerRewardAmount: this.addActivityData.indirectPartnerRewardAmount, // 间接机构
        activityId: this.addActivityData.activityId
      }
      const { latchall, latchrule } = checkmoney(data)
      if (!latchall) {
        this.$message.info(
          '请检查（开通合伙人费用=平台手续费+激活奖励+订单返现+开通合伙人总金额）是否正确？',
          5000
        )
        return
      }
      if (!latchrule) {
        this.$message.info('请检查开通合伙人奖励总金额与开通合伙人奖励分配金额是否相等', 5000)
        return
      }
      this.isSend = true
      try {
        const res = await post({
          url: 'activity/upd',
          data
        })
        this.isSend = false
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$emit('fresh')
      } catch (err) {
        console.log(err)
      }
    },
    close() {
      this.$emit('close')
    },
    getPrice(id) {
      for (let i = 0; i < this.models.length; i++) {
        if (this.models[i].brandId === id) {
          this.devPrice = this.models[i].price
        }
      }
      if (this.addActivityData.posNums) {
        this.addActivityData.activityRewardAmount = this.devPrice * this.addActivityData.posNums
      }
    },
    calAmt() {
      if (this.devPrice === '') {
        this.addActivityData.brandId = ''
      }
      this.addActivityData.activityRewardAmount = this.devPrice * this.addActivityData.posNums
    }
  },
  mounted() {
    console.log(this.models)
    if (this.getType === 'add') {
      this.title = '新建活动'
    } else if (this.getType === 'edit') {
      this.title = '编辑活动'
    } else {
      this.title = ''
      this.btnExist = true
    }
    if (this.detail) {
      Object.keys(this.detail).forEach(key => {
        this.$set(this.addActivityData, key, this.detail[key])
      })
    } else {
      this.btnExist = true
    }
  }
}
</script>
<style scoped lang ='scss' >
@import './index.scss';
</style>