<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>通道管理</el-breadcrumb-item>
        <el-breadcrumb-item>通道订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20" style="margin-left:5px">
      <el-col :span="12">
        <div class="subtable" style="background-color:#fff">
          <el-tag>代付订单查询</el-tag>
          <el-form :inline="true" class="demo-form-inline" style="margin: 15px" >
            <el-form-item>
              <el-input clearable v-model="paymentNo" placeholder="请输入代付订单号" style="width: 260px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="payment()">搜索</el-button>
            </el-form-item>
          </el-form>
          <div class="dataDisplay">
            {{paymentData}}
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="subtable" style="background-color:#fff">
          <el-tag>代扣订单查询</el-tag>
          <el-form :inline="true" class="demo-form-inline" style="margin: 15px" >
            <el-form-item>
              <el-input clearable v-model="withholdNo" placeholder="请输入代扣订单号" style="width: 260px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="withhold()">搜索</el-button>
            </el-form-item>
          </el-form>
          <div class="dataDisplay">
            {{withholdData}}
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { post } from '../../store/requestFacade.js'
export default {
  name: 'channel-order',
  data: function() {
    return {
      paymentNo: '',
      withholdNo: '',
      paymentData: '',
      withholdData: ''
    }
  },
  methods: {
    async payment() {
      try {
        const res = await post({
          url: 'payment/payment',
          data: {
            tradeNo: this.paymentNo
          }
        })
        this.paymentData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async withhold() {
      try {
        const res = await post({
          url: 'payment/withhold',
          data: {
            tradeNo: this.withholdNo
          }
        })
        this.withholdData = res.data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style scoped>
.base-tit {
  margin: 15px 0;
}
.subtable{
  padding: 15px;
}
.dataDisplay {
  height: 550px;
  border-top: 1px solid #dddddd;
}
</style>
