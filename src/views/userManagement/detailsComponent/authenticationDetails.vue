<template>
  <div>
    <el-row>
      <el-col :span="8">
        <h3>身份信息</h3>
        <p>真实姓名<span>{{certification.username}}</span></p>
        <p>身份证号码<span>{{certification.idCard}}</span></p>
      </el-col>
      <el-col :span="8">
        <h3>结算卡</h3>
        <p>结算卡卡号<span>{{certification.bankCardNo}}</span></p>
        <p>发卡行<span>{{certification.btName}}</span></p>
        <p>预留手机号<span>{{certification.cardPhone}}</span></p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11" class="img">
        <img :src="certification.backIdCard" alt="">
        <img :src="certification.idCardBackpic" alt="">
        <img :src="certification.idCardFacepic" alt="">
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'authentication-details',
  props: {
    organId: {
      type: Number,
      default: () => null
    },
    userId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      level: '',
      certification: {}
    }
  },
  methods: {
    // 获取认证详情
    async getCertification() {
      try {
        const res = await post({
          url: 'userManagement/certification',
          data: {
            organId: this.organId,
            userId: this.userId
          }
        })
        // console.log(res)
        this.certification = res.data
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.getCertification()
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
  img {
    margin-top: 30px;
    width: 180px;
    height: 100px;
    /* border: 1px solid #cccccc */
  }
  .img {
    display: flex;
    justify-content: space-between;
  }
</style>
