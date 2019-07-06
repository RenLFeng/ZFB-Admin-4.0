<template>
  <div>
    <div class="base-tit">
      <div>
        <el-button icon="el-icon-arrow-left" @click="toback">返回</el-button>
      </div>
      <div>
        <el-button v-if="showSavePlan" type="primary" @click="applyPlanAdjust">保存计划</el-button>
        <el-button v-if="showRecoverPlan" type="success" @click="recoverPlan">恢复计划</el-button>
         <el-button v-if="showStopPlan" type="warning" @click="stopPlan">暂停计划</el-button>
        <el-button v-if="showEndPlan" type="danger" @click="endPlan">结束计划</el-button>
        <el-button type="info" @click="processingShow = true">处理记录</el-button>
      </div>
    </div>
    <div class="head" style="margin-bottom: 16px;">
      <el-row>
        <el-col :span="3" align="center">
          <p>计划单号</p>
          <p>{{detailsData.planId}}</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>姓名</p>
          <p>{{detailsData.userName}}</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>手机号码</p>
          <p>{{detailsData.userAccount}}</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>计划状态</p>
          <p>{{planStatus}}</p>
        </el-col>
        <el-col :span="3" align="center" v-if="statistics.status === 2">
          <p>暂停时间</p>
          <p>{{stopInfo.pauseDate | cutTime}}</p>
        </el-col>
        <el-col :span="3" align="center" v-if="statistics.status === 3 || statistics.status === 4">
          <p>结束时间</p>
          <p>{{statistics.actualEndAt | cutTime}}</p>
        </el-col>
        <el-col :span="2" align="center">
          <p>网络类型</p>
          <p>{{deviceInfo.aepnType}}</p>
        </el-col>
        <el-col :span="2" align="center">
          <p>信号强度</p>
          <p>{{deviceInfo.signalInt}}</p>
        </el-col>
        <el-col :span="2" align="center">
          <p>设备电量</p>
          <p>{{deviceInfo.battery}}</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>上报时间</p>
          <p>{{deviceInfo.updateDate | cutTime}}</p>
        </el-col>
      </el-row>
    </div>
    <div class="head">
      <el-row>
        <el-col :span="2" align="center">
          <p>账单日</p>
          <p>{{statistics.billDate}}日</p>
        </el-col>
        <el-col :span="2" align="center">
          <p>还款日</p>
          <p>{{statistics.repayDate}}日</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>账单金额</p>
          <p>{{statistics.totalAmount}}</p>
        </el-col>
        <el-col :span="2" align="center">
          <p>周转金</p>
          <p>{{detailsData.workingAmount}}元</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>周转余额</p>
          <p>{{statistics.tail}}元</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>累计还款</p>
          <p>{{statistics.totalRepaid}}元</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>累计消费</p>
          <p>{{statistics.totalPaid}}元</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>剩余应还</p>
          <p>{{statistics.remainBillAmount}}元</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>手续费</p>
          <p>{{statistics.repayfeeAndPayrate}}元</p>
        </el-col>
      </el-row>
    </div>
    <div class="info">
      <el-row :gutter="20">
        <el-col>
          <div class="subtable">
            <div>
              <h4>
                {{bankinfo}}还款计划
                <el-button
                  type="primary"
                  style="position: absolute; right:90px;top:5px"
                  size="small"
                  @click="update"
                >
                  <i class="el-icon-refresh"></i> 刷新
                </el-button>
              </h4>
            </div>
            <el-table :data="allTasks" border style="width: 100%">
              <el-table-column prop="index" label="序号"></el-table-column>
              <el-table-column prop="amount" label="任务类型">
                <template slot-scope="scope">
                  <p class="pay-row" v-if="scope.row.type === TaskType.PAY">消费</p>
                  <p class="repay-row" v-if="scope.row.type === TaskType.REPAY">还款</p>
                  <p class="refund-row" v-if="scope.row.type === TaskType.REFUND">退款</p>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="交易金额(元)">
                <template slot-scope="scope">
                  <p>{{scope.row.amount|normAmount}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="toExecuteAt" label="交易时间">
                <template slot-scope="scope">
                  <p :class="{'del': scope.row.adjusted}">{{scope.row.toExecuteAt|cutTime}}</p>
                  <p
                    class="warning"
                    v-if="scope.row.adjusted"
                  >{{scope.row.editedToExecuteAt|cutTime}}</p>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <div>{{paystatus(scope.row)}}</div>
                  <!-- <el-button @click="query(scope.row)" type="warning" v-if="scope.row.query">查询</el-button> -->
                </template>
              </el-table-column>
              <el-table-column prop="statusMsg" label="备注"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div
                    v-show="showEditTime"
                    @click="popupTimeEdit(scope.row)"
                    v-if="rowShowEdit(scope.row)"
                    class="edit"
                  >编辑</div>
                  <el-button
                    type="text"
                    @click="getplanLog(scope.row)"
                    v-if="paystatusLog(scope.row)"
                  >日志</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div v-if="stopInfo" style="margin-top: 16px;">
        <div>暂停日期：{{stopInfo.pauseDate | cutTime}}</div>
        <div>暂停原因：{{stopInfo.pauseMsg}}</div>
      </div>
    </div>
    <stop-description
      :cardNo="detailsData.bankCardNo"
      v-if="showStopDescription"
      @ensure="ensureStop"
      @cancel="cancelStop"
    />
    <time-edit
      v-if="editTime.show"
      @cancel="cancelTimeEdit"
      @save="saveTimeEdit"
      :taskId="editTime.taskId"
      :toExecuteAt="editTime.toExecuteAt"
      :amount="editTime.amount"
    />
    <plan-log v-if="planLogShow" :flag="planLogShow" @logClose="logClose" :tradeNo="tradeNo"/>
    <processing-records
      v-if="processingShow"
      :planId="detailsData.planId"
      :flag="processingShow"
      @processingClose="processingClose"
    />
  </div>
</template>
<script>
import { queryPermission } from '@/util'
import { post } from '../../../../store/requestFacade.js'
import stopDescription from './stopDescription'
import timeEdit from './timeEdit'
import planLog from './planLog'
import processingRecords from './processingRecords'

const planStatus = {
  RUNNING: 1,
  PAUSED: 2,
  FAIL: 3,
  SUCCESS: 4
}

const taskStatus = {
  READY: 1,
  RUNNING: 2,
  FAIL: 3,
  SUCCESS: 4
}

const TaskType = {
  PAY: 1,
  REPAY: 2,
  REFUND: 3
}

export default {
  name: 'plan-details',
  components: {
    stopDescription,
    timeEdit,
    planLog,
    processingRecords
  },
  computed: {
    canStopPlan() {
      return queryPermission('stopPlan') //
    },
    canRecoverPlan() {
      return queryPermission('recoverPlan')
    },
    canClosePlan() {
      return queryPermission('closePlan')
    },
    canEditTask() {
      return queryPermission('editTask')
    },
    standardGapDisplay() {
      return `${this.standardGap / 60 / 1000} 分钟`
    },
    showEditTime() {
      return this.canEditTask && this.statistics.status === planStatus.PAUSED
    },
    showSavePlan() {
      return this.canEditTask && this.editing
    },
    showRecoverPlan() {
      return this.canRecoverPlan && this.statistics.status === planStatus.PAUSED && !this.editing
    },
    showEndPlan() {
      return this.canClosePlan && this.statistics.status === planStatus.PAUSED && !this.editing
    },
    showStopPlan() {
      return this.canStopPlan && this.statistics.status === planStatus.RUNNING && !this.editing
    },
    stopInfo() {
      if (this.statistics.status !== planStatus.PAUSED) {
        return
      }
      return {
        pauseDate: this.statistics.pausedAt,
        pauseMsg: this.statistics.statusMsg
      }
    },
    planStatus() {
      if (!this.detailsData) {
        return
      }
      if (typeof this.statistics.status !== 'number') {
        return
      }
      const statuMap = {
        1: '执行中',
        2: '已暂停',
        3: '异常结束',
        4: '正常结束'
      }
      return statuMap[this.statistics.status]
    }
  },
  props: {
    detailsData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      TaskType: TaskType,
      editing: false,
      planLogShow: false,
      bankinfo: '',
      tradeNo: '',
      processingShow: false,
      deviceInfo: {},
      allTasks: [],
      showPlan: 1,
      statistics: {},
      showStopDescription: false,
      standardGap: 30 * 60 * 1000,
      tasksEditting: {},
      editTime: {
        show: false,
        toExecuteAt: undefined,
        amount: undefined,
        order: undefined,
        taskId: undefined
      }
    }
  },
  methods: {
    async query(row) {
      const url = (({ type }) => {
        if (type === TaskType.PAY) {
          return 'payment/withhold'
        } else {
          return 'payment/payment'
        }
      })(row)
      try {
        const res = await post({
          url,
          data: {
            tradeNo: row.id
          }
        })
        if (res.data === null) {
          this.$message(res.msg)
        } else {
          // const d = JSON.parse(res.data)
          // const show = JSON.stringify(d, null, 4)
          // console.log(show)
          // this.$alert(res.data)
          // try {
          // } catch (error) {
          //   // this.$alert(res.data)
          // }
        }
      } catch (error) {
        console.log(error)
      }
    },
    distinguishTaskType({ row, rowIndex }) {
      if (row.type === this.TaskType.PAY) {
        return 'pay-row'
      } else {
        return 'repay-row'
      }
    },
    popupTimeEdit(row) {
      this.editTime.toExecuteAt = (() => {
        if (row.editedToExecuteAt) {
          return row.editedToExecuteAt.getTime()
        }
        return Math.max(new Date().getTime(), row.toExecuteAt)
      })()
      // console.log(this.editTime.toExecuteAt)
      this.editTime.amount = row.amount
      this.editTime.taskId = row.id
      this.editTime.order = row.order
      this.editTime.show = true
    },
    rowShowEdit(row) {
      return row.status === taskStatus.READY || row.status === taskStatus.FAIL
    },
    // 点击返回
    toback() {
      this.$emit('toback', this.showPlan)
    },
    getplanLog(row) {
      this.tradeNo = row.tradeNo
      this.planLogShow = true
    },
    paystatusLog(row) {
      if (row.type === TaskType.PAY) {
        return row.status === taskStatus.RUNNING || row.status === taskStatus.FAIL
      }
    },
    // 消费状态
    paystatus(row, column) {
      const statuPayMap = {
        1: '未消费',
        2: '执行中',
        3: '消费失败',
        4: '已消费'
      }
      const statuRepeyMap = {
        1: '未还款',
        2: '执行中',
        3: '还款失败',
        4: '已还款'
      }
      const statuRefundMap = {
        1: '未退款',
        2: '未退款',
        3: '退款失败',
        4: '已退款'
      }
      if (row.type === 2) {
        return statuRepeyMap[row.status]
      }
      if (row.type === 1) {
        return statuPayMap[row.status]
      }
      if (row.type === 3) {
        return statuRefundMap[row.status]
      }
    },
    // 还款状态
    repaystatus(row, column) {
      const statuMap = {
        1: '未还款',
        2: '执行中',
        3: '还款失败',
        4: '已还款'
      }
      return statuMap[row.status]
    },
    // 获取消费统计
    async getStatistics() {
      try {
        const res = await post({
          url: 'plan/statistics',
          data: {
            planId: this.detailsData.planId,
            cardNo: this.detailsData.bankCardNo
          }
        })
        this.statistics = res.data
      } catch (err) {
        console.log(err)
      }
    },
    logClose() {
      this.planLogShow = false
    },
    processingClose() {
      this.processingShow = false
    },
    // 消费计划
    getDtailsSpending() {
      return post({
        url: 'plan/detailsSpending',
        data: {
          planId: this.detailsData.planId
        }
      }).then(res => {
        return res.data.map(item =>
          Object.assign(item, {
            adjusted: false,
            editedToExecuteAt: undefined,
            type: TaskType.PAY
          })
        )
      })
    },
    // 还款计划
    getDetailsPayments() {
      return post({
        url: 'plan/detailsPayments',
        data: {
          planId: this.detailsData.planId
        }
      }).then(res => {
        return res.data.map(item =>
          Object.assign(item, {
            adjusted: false,
            editedToExecuteAt: undefined
          })
        )
      })
    },
    async applyPlanAdjust() {
      const adjustParamsValid = (params, standardGap) => {
        const taskIds = Object.keys(params).sort((taskId1, taskId2) => {
          return params[taskId1].order - params[taskId2].order
        })
        for (let i = 0; i < taskIds.length - 1; i++) {
          const pre = params[i]
          const current = params[i + 1]
          if (current - pre < standardGap) {
            return false
          }
        }
        return true
      }
      const params = this.tasksEditting
      if (!adjustParamsValid(params, this.standardGap)) {
        this.$message(`两个任务之间间隔必须大于${this.standardGapDisplay}`)
        return
      }
      const allTaskValid = allTasks => {
        console.log('allTasks.length' + allTasks.length)
        const sortedTasks = allTasks.sort((task1, task2) => task1.order - task2.order)
        for (let i = 0; i < sortedTasks.length - 1; i++) {
          const pre = sortedTasks[i]
          const current = sortedTasks[i + 1]
          const preTime = pre.editedToExecuteAt || pre.toExecuteAt
          const currentTime = current.editedToExecuteAt || current.toExecuteAt
          if (currentTime < preTime) {
            console.log(new Date(currentTime))
            console.log(new Date(preTime))
            return false
          }
        }
        return true
      }
      const oneTaskMoreThan2230 = allTasks => {
        const moreThan2230 = time => {
          const date = new Date(time)
          const hours = date.getHours()
          const minute = date.getMinutes()
          console.log(JSON.stringify({ hours, minute }))
          if (hours < 22) {
            return false
          }
          if (hours === 22) {
            return minute >= 30
          }
          return true
        }
        return allTasks
          .filter(({ status }) => status !== taskStatus.SUCCESS)
          .map(({ toExecuteAt, editedToExecuteAt }) => editedToExecuteAt || toExecuteAt)
          .some(moreThan2230)
      }
      const allTasks = [].concat(this.allTasks)
      const allTaskValidResult = allTaskValid(allTasks)
      console.log('allTaskValidResult', allTaskValidResult)
      if (!allTaskValidResult || oneTaskMoreThan2230(allTasks)) {
        this.$message('任务时间调整不合理，请重新调整')
        return
      }
      const updateParams = Object.keys(params).reduce((acc, currentKey) => {
        acc[currentKey] = params[currentKey].editedToExecuteAt.getTime()
        return acc
      }, {})
      try {
        const res = await post({
          url: 'plan/adjust',
          data: {
            planId: this.detailsData.planId,
            updateParams: JSON.stringify(updateParams)
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        await this.start()
      } catch (error) {
        console.log(error)
      } finally {
        this.editing = false
      }
    },
    async recoverPlan() {
      const tips = `恢复计划后,将会自动执行计划,是否确定恢复【${
        this.detailsData.userName
      }】的还款计划?`
      try {
        await this.$confirm(tips, '暂停计划', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        const res = await post({
          url: 'plan/recovery',
          data: {
            id: this.detailsData.id
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        await this.start()
      } catch (error) {
        console.log(error)
      }
    },
    async endPlan() {
      const tips = `是否提前结束计划,周转余额${this.statistics.tail}元将自动退回信用卡`
      try {
        await this.$confirm(tips, '结束计划', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        const res = await post({
          url: 'plan/end',
          data: {
            planId: this.detailsData.planId
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        await this.start()
      } catch (error) {}
    },
    async stopPlan() {
      this.showStopDescription = true
    },
    async cancelStop() {
      this.showStopDescription = false
    },
    async ensureStop() {
      const [{ desc, smsContent }] = arguments
      this.showStopDescription = false
      try {
        const res = await post({
          url: 'plan/stop',
          data: {
            id: this.detailsData.id,
            reasonDesc: desc,
            smsContent: smsContent
          }
        })
        console.log('fsfsfs',res);
        this.$message({ message: res.msg, type: 'success' })
        await this.start()
      } catch (err) {
        console.log(err)
      }
    },
    async cancelTimeEdit() {
      this.resetEditTime()
    },
    async saveTimeEdit() {
      const [{ taskId, editedToExecuteAt }] = arguments
      this.tasksEditting[taskId] = {
        editedToExecuteAt,
        order: this.editTime.order
      }
      this.editing = true
      let taskInList = this.allTasks.find(data => {
        return data.id === taskId
      })
      taskInList.adjusted = true
      taskInList.editedToExecuteAt = editedToExecuteAt
      this.resetEditTime()
    },
    resetEditTime() {
      this.editTime.toExecuteAt = undefined
      this.editTime.amount = undefined
      this.editTime.taskId = undefined
      this.editTime.order = undefined
      this.editTime.show = false
    },
    async start() {
      await this.getStatistics()
      const [pay] = await Promise.all([this.getDetailsPayments()])
      let allTasks = []
        .concat(pay)
        .sort((t1, t2) => t1.order - t2.order)
        .map((_, index) =>
          Object.assign(_, { index: index + 1 }, { query: _.status === taskStatus.FAIL })
        )
      this.allTasks = [].concat(allTasks)
    },
    // 获取设备信息
    async getdeviceInfo() {
      try {
        const res = await post({
          url: 'report/query',
          data: {
            merchantId: this.detailsData.merchantId
          }
        })
        this.deviceInfo = res.data
      } catch (error) {
        console.log(error)
      }
    },
    update() {
      this.start()
      this.getdeviceInfo()
    }
  },
  mounted() {
    const bankCardNo = this.detailsData.bankCardNo.slice(
      length - 4,
      this.detailsData.bankCardNo.length
    )
    this.bankinfo = `${this.detailsData.btName}(${bankCardNo})`
    this.start()
    this.getdeviceInfo()
  }
}
</script>
<style scoped>
.base-tit {
  margin: 15px 0;
}
.head {
  background-color: #fff;
}
h3 {
  margin: 10px;
}
p {
  font-size: 14px;
  color: #666;
  margin: 5px;
}
.info {
  margin-top: 15px;
}
h4 {
  padding: 10px;
  text-align: center;
}
.subtable {
  background-color: #fff;
}
.summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
}
.edit {
  color: #409eff;
  cursor: pointer;
  display: inline;
  margin-right: 15px;
}
.del {
  text-decoration: line-through;
}
.warning {
  color: #f56c6c;
}
.pay-row {
  color: #67c23a;
}
.repay-row {
  color: #f56c6c;
}
.refund-row {
  color: red;
}
</style>
