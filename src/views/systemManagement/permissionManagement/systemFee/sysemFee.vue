<template>
  <div style="background:#fff;height:600px">
    <el-tabs v-model="systemFeeActive" type="card">
      <el-tab-pane label="分公司费率" :name="organMap.PROVINCIAL"></el-tab-pane>
      <el-tab-pane label="子公司费率" :name="organMap.ONEORGAN"></el-tab-pane>
      <el-tab-pane label="高级合伙人费率" :name="organMap.SECORGAN"></el-tab-pane>
    </el-tabs>
    <div class="slider">
      <p>
        设备还款分润费率
        <span>(万) {{posPayFee[0]}} — {{posPayFee[1]}}</span>
      </p>
      <el-slider v-model="posPayFee" range :max="40" :step="0.1" style="width:100%"></el-slider>
    </div>
    <div class="slider">
      <p>
        设备收款分润费率
        <span>(万) {{posRepayFee[0]}} — {{posRepayFee[1]}}</span>
      </p>
      <el-slider v-model="posRepayFee" range :max="40" :step="0.1" style="width:100%"></el-slider>
    </div>
    <div class="slider">
      <p>
        快捷还款分润费率
        <span>(万) {{quickPayFee[0]}} — {{quickPayFee[1]}}</span>
      </p>
      <el-slider v-model="quickPayFee" range :max="40" :step="0.1" style="width:100%"></el-slider>
    </div>
    <div class="slider">
      <p>
        快捷收款分润费率
        <span>(万) {{quickRepayFee[0]}} — {{quickRepayFee[1]}}</span>
      </p>
      <el-slider v-model="quickRepayFee" range :max="40" :step="0.1" style="width:100%"></el-slider>
    </div>
    <div class="btn">
      <el-button type="primary" @click="saveFee">保存配置</el-button>
    </div>
  </div>
</template>
<script>
import { post } from '../../../../store/requestFacade.js'
import sysemFeeDetails from './sysemFeeDetails'
import { handleOrganObj } from '../../../organizationManagement/own.js'
import { saveFee } from '../../../../server/Interface'
const organMap = {
  PROVINCIAL: '2',
  ONEORGAN: '3',
  SECORGAN: '9'
}
const CODE = {
  SUCCESS: '200',
  UN_AUTH: '403',
  NO_LOGIN: '400',
  FAIL: '500',
  SYS_ERROR: '404'
}
export default {
  name: 'sysemFee',
  components: {
    sysemFeeDetails
  },
  data() {
    return {
      labelPosition: 'left',
      systemFeeActive: organMap.PROVINCIAL,
      organMap: organMap,
      queryFee: '',
      levelFee: {},
      type: '',
      posPayFee: [0, 0],
      posRepayFee: [0, 0],
      quickRepayFee: [0, 0],
      quickPayFee: [0, 0]
    }
  },
  watch: {
    systemFeeActive() {
      this.levelFee = this.queryFee[Number(this.systemFeeActive)]
      this.posPayFee = [this.levelFee.posPayFee.minFee, this.levelFee.posPayFee.maxFee]
      this.posRepayFee = [this.levelFee.posRepayFee.minFee, this.levelFee.posRepayFee.maxFee]
      this.quickRepayFee = [this.levelFee.quickRepayFee.minFee, this.levelFee.quickRepayFee.maxFee]
      this.quickPayFee = [this.levelFee.quickPayFee.minFee, this.levelFee.quickPayFee.maxFee]
      this.type = this.levelFee.type
    }
  },
  methods: {
    async getQueryFee() {
      try {
        const res = await post({
          url: 'systemFee/queryFee'
        })
        this.queryFee = handleOrganObj(res.data)
        const levelFee = this.queryFee[Number(this.systemFeeActive)]
        this.type = levelFee.type
        this.posPayFee = [levelFee.posPayFee.minFee, levelFee.posPayFee.maxFee]
        this.posRepayFee = [levelFee.posRepayFee.minFee, levelFee.posRepayFee.maxFee]
        this.quickRepayFee = [levelFee.quickRepayFee.minFee, levelFee.quickRepayFee.maxFee]
        this.quickPayFee = [levelFee.quickPayFee.minFee, levelFee.quickPayFee.maxFee]
      } catch (error) {
        console.log(error)
      }
    },
    async saveFee() {
      const body = {
        type: this.type,
        posPayFee: {
          minFee: this.posPayFee[0],
          maxFee: this.posPayFee[1]
        },
        posRepayFee: {
          minFee: this.posRepayFee[0],
          maxFee: this.posRepayFee[1]
        },
        quickPayFee: {
          minFee: this.quickPayFee[0],
          maxFee: this.quickPayFee[1]
        },
        quickRepayFee: {
          minFee: this.quickRepayFee[0],
          maxFee: this.quickRepayFee[1]
        }
      }
      try {
        this.$axios.post(saveFee, body).then(res => {
          if (res.data.code === CODE.SUCCESS) {
            this.$message({
              type: 'success',
              message: res.data.data
            })
            this.getQueryFee()
          } else {
            this.$message(res.data.msg)
          }
        })
      } catch (error) {}
    }
  },
  mounted() {
    this.getQueryFee()
  }
}
</script>
<style scoped>
.slider {
  padding: 0 15px;
  display: flex;
}
.slider p {
  font-size: 14px;
  color: #606266;
  width: 300px;
  height: 50px;
  line-height: 35px;
}
.slider p span {
  color: #20a0ff;
}
.btn {
  display: flex;
  justify-content: center;
}
</style>

