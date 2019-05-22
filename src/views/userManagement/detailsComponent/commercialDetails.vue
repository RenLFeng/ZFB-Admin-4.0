<template>
  <div>
    <el-row>
      <el-col :span="8">
        <h3>设备信息</h3>
        <p>设备来源<span>{{merchantInfo.devSource}}</span></p>
        <p>设备类型<span>{{merchantInfo.brandName}}</span></p>
        <p>设备编号<span>{{merchantInfo.devNo}}</span></p>
        <p>商户区域<span>{{merchantInfo.merchantProv}} {{merchantInfo.merchantCity}}</span></p>
        <p>智能端口<span>已激活{{merchantInfo.portSum}}个</span></p>
        <p>详细地址<span>{{merchantInfo.address}}</span></p>
        <p>身份证有效期<span>{{merchantInfo.certStartDate}}</span>—<span>{{merchantInfo.certExpireDate}}</span></p>
      </el-col>
      <el-col :span="12">
        <p>手持身份证照</p>
        <img :src="merchantInfo.handIdCard" alt="">
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'commercial-details',
  props: {
    organId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      merchantInfo: {}
    }
  },
  methods: {
    // 获取商户详情
    async getmerchantInfo() {
      try {
        const res = await post({
          url: 'userManagement/merchantInfo',
          data: {
            organId: this.organId
          }
        })
        this.merchantInfo = res.data
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.getmerchantInfo()
  }
}
</script>
<style scoped>
p {
  font-weight: bold;
  margin-top: 15px;
  margin-left: 15px;
}
span {
  margin: 0 15px;
  font-weight: normal;
}
img {
  margin-top: 15px;
  margin-left: 15px;
  width: 180px;
  height: 100px;
}
</style>
