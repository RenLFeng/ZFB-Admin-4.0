<template>
  <div>
    <el-row>
      <el-col :span="8">
        <h3>线下信息</h3>
        <p>商户数<span>{{partnerInfo.merchantNumber}}</span></p>
        <p>合伙人数<span>{{partnerInfo.partnerSum}}</span></p>
        <p>设备库存数<span>{{partnerInfo.stock}}</span></p>
        <p>设备下发数<span>{{partnerInfo.send}}</span></p>
        <p>合伙人授权时间<span>{{partnerInfo.partnerDate|cutTime}}</span></p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'partner-details',
  props: {
    organId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      partnerInfo: {}
    }
  },
  methods: {
    // 获取合伙人详情
    async getPartnerInfo() {
      try {
        const res = await post({
          url: 'userManagement/partnerInfo',
          data: {
            organId: this.organId
          }
        })
        // console.log(res)
        this.partnerInfo = res.data
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.getPartnerInfo()
  }
}
</script>
<style scoped>
  p{
    font-weight: bold;
    margin-top: 15px;
    margin-left: 15px
  }
  span{
    margin-left: 15px;
    font-weight: normal
  }
</style>
