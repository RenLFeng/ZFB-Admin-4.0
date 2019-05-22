<template>
  <el-dialog title="任务日志" :visible.sync="planLogShow" width="30%" :before-close="logClose">
    <el-table :data="logData" size='mini' border>
      <el-table-column prop="logMsg" label="执行步骤" width="260"></el-table-column>
      <el-table-column prop="time" label="执行时间">
        <template slot-scope="scope">
          <p>{{scope.row.time | cutTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="logResult" label="执行结果">
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.logResult" style="color: green"></i>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { post } from '../../../../store/requestFacade.js'
export default {
  name: 'plan-log',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    tradeNo: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      planLogShow: false,
      logData: [
        {
          logMsg: '第1步：服务器响应设备请求'
        },
        {
          logMsg: '第2步：设备初始化，创建订单'
        },
        {
          logMsg: '第3步：输入交易金额'
        },
        {
          logMsg: '第4步：设备正在进行读卡'
        },
        {
          logMsg: '第5步：输入密码，进行交易'
        },
        {
          logMsg: '第6步：设备获取交易结果'
        },
        {
          logMsg: '第7步：后台接受交易结果'
        }
      ]
    }
  },
  methods: {
    logClose() {
      this.$emit('logClose')
    },
    async getLog() {
      try {
        const res = await post({
          url: 'pos/getOrderReport',
          data: {
            tradeNo: this.tradeNo
          }
        })
        const loadTime = res.data.map(item => {
          return item.time
        })
        const loadIndex = res.data.map(item => {
          return item.index
        })
        this.logData = this.logData.map((item, index) => {
          return Object.assign({}, item, { time: loadTime[index] }, { logResult: loadIndex[index] })
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.planLogShow = this.flag
    this.getLog()
  }
}
</script>

<style scoped>

</style>
