<template>
  <el-dialog title="商户详情" :visible.sync="dialogVisible" width="45%" :before-close="handleClose">
    <el-form label-width="100px">
      <el-tag>商户信息</el-tag>
      <el-row>
        <el-col :span="8">
          <el-form-item label="商户姓名">{{userInfo.depositName}}</el-form-item>
          <el-form-item label="手机号码">{{userInfo.phone}}</el-form-item>
          <el-form-item label="合伙人">{{userInfo.partner}}</el-form-item>
          <el-form-item label="设备型号">{{userInfo.brandSubName}}</el-form-item>
          <el-form-item label="设备编号">{{userInfo.devNo}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备状态">{{userInfo.posStatus|posStatusText}}</el-form-item>
          <el-form-item label="还款状态">{{userInfo.payStatus|payStatusText}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="支付时间">{{userInfo.payDepositTime|cutTime}}</el-form-item>
          <el-form-item label="开始时间" v-if="userInfo.beginTime">{{userInfo.beginTime|cutTime}}</el-form-item>
          <el-form-item label="结束时间" v-if="userInfo.endTime">{{userInfo.endTime|cutTime}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-tag>还款进度</el-tag>
    <p align="center">累计已还款</p>
    <h3 align="center">{{userInfo.totalTradeAmt}}元</h3>
    <div class="bar">
      <div :class="userInfo.totalTradeAmt > 0?'lightA':'light'">
        <p class="totalTradeAmt">0</p>
      </div>
      <div
        :class="userInfo.totalTradeAmt >= v.totalTradeAmt*10000?'lightA':'light'"
        :style="{left: v.left}"
        v-for="v in userInfo.depositStagePO"
        :key="v.stageOrder"
      >
        <p class="totalTradeAmt">{{v.totalTradeAmtText}}</p>
      </div>
      <p
        :style="{
        background: '#4289ff',
        width: `${(userInfo.totalTradeAmt / (userInfo.tradeAmt*10000)) * 100}%`
      }"
      />
    </div>
    <div class="deposit">
      <div>
        <p align="center">累计返现</p>
        <h3 align="center">{{userInfo.returnDepositAmt}}元/{{userInfo.depositAmt}}元</h3>
      </div>
      <div>
        <p align="center">还款天数</p>
        <h3 align="center">{{userInfo.depositDay}}天/{{userInfo.depositCycle}}天</h3>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'pledge-user-details',
  props: {
    detailsData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dialogVisible: true,
      userInfo: {}
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    // 获取详情信息
    async depositUserInfo() {
      try {
        const res = await post({
          url: 'depositUser/depositUserInfo',
          data: {
            recordId: this.detailsData.recordId
          }
        })
        this.userInfo = res.data
        this.userInfo.depositStagePO = res.data.depositStagePO.map((v, i) => ({
          ...v,
          left: `${(v.totalTradeAmt / this.userInfo.tradeAmt) * 100}%`,
          totalTradeAmtText: `${v.totalTradeAmt}万`
        }))
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.depositUserInfo()
  },
  filters: {
    posStatusText(posStatus) {
      const posStatusMap = {
        0: '未激活',
        1: '已激活'
      }
      return posStatusMap[posStatus]
    },
    payStatusText(payStatus) {
      const statusMap = {
        1: '未还款',
        2: '还款中',
        3: '完成',
        4: '失效'
      }
      return statusMap[payStatus]
    }
  }
}
</script>
<style scoped>
.el-form-item {
  margin-bottom: 0;
}
.deposit {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
.bar {
  margin-top: 10px;
  margin-left: 10px;
  display: grid;
  height: 3px;
  width: 95%;
  grid-template-columns: auto;
  background: #4289ff;
  background: #ccc;
  position: relative;
}
.light {
  /* content: '30'; */
  position: absolute;
  top: 1px;
  left: 0;
  transform: translate(-50%, -47%);
  border-radius: 50%;
  width: 5px;
  height: 5px;
  padding: 1px;
  border: 2px solid #cccccc;
  background-clip: padding-box;
  /* background: #4289ff; */
  background: #fff;
  z-index: 9;
}
.lightA {
  position: absolute;
  top: 1px;
  left: 0;
  transform: translate(-50%, -47%);
  border-radius: 50%;
  width: 5px;
  height: 5px;
  padding: 2px;
  border: 2px solid #fff;
  background-clip: padding-box;
  background: #4289ff;
  /* background: #fff; */
  z-index: 9;
}
.totalTradeAmt {
  text-align: center;
  width: 100px;
  position: absolute;
  top: 10px;
  left: -40px;
}
</style>
