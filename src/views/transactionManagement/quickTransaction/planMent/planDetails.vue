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
          <p>用户</p>
          <p>{{detailsData.user}}</p>
        </el-col>
        <el-col :span="3" align="center">
          <p>计划状态</p>
          <p>{{planStatus}}</p>
        </el-col>
        <el-col :span="3" align="center" v-if="statistics.status === 2">
          <p>暂停时间</p>
          <p>{{statistics.pausedAt | cutTime}}</p>
        </el-col>
        <el-col :span="3" align="center" v-if="statistics.status === 3 || statistics.status === 4">
          <p>结束时间</p>
          <p>{{statistics.actualEndAt | cutTime}}</p>
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
          <p>{{statistics.workingAmount}}元</p>
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
                还款计划
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
              <el-table-column prop="order" label="序号"></el-table-column>
              <el-table-column label="任务类型">
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
              <el-table-column prop="time" label="交易时间">
                <template slot-scope="scope">
                  <p :class="{'del': scope.row.adjusted}">{{scope.row.time|cutTime}}</p>
                  <p
                    class="warning"
                    v-if="scope.row.adjusted"
                  >{{scope.row.editedToExecuteAt|cutTime}}</p>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">
                  <div>{{paystatus(scope.row)}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div
                    v-show="showEditTime"
                    @click="popupTimeEdit(scope.row)"
                    v-if="rowShowEdit(scope.row)"
                    class="edit"
                  >编辑</div>
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
      :cardNo="detailsData.cardNo"
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
import { post, postJOSN } from '../../../../store/requestFacade.js'
import stopDescription from './stopDescription'
import timeEdit from './timeEdit'
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
    popupTimeEdit(row) {
      console.log(row)
      this.editTime.toExecuteAt = (() => {
        if (row.editedToExecuteAt) {
          return row.editedToExecuteAt.getTime()
        }
        return Math.max(new Date().getTime(), row.timeStamp)
      })()
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
      if (row.type === 1) {
        return statuPayMap[row.status]
      }
      if (row.type === 2) {
        return statuRepeyMap[row.status]
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
    logClose() {
      this.planLogShow = false
    },
    processingClose() {
      this.processingShow = false
    },
    // 恢复计划
    async recoverPlan() {
      const tips = `恢复计划后,将会自动执行计划,是否确定恢复【${
        this.detailsData.user.split('（')[0]
      }】的还款计划?`
      try {
        await this.$confirm(tips, '暂停计划', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        const res = await post({
          url: 'v3/plan/recover',
          data: {
            planId: this.detailsData.planId
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        await this.start()
      } catch (error) {
        console.log(error)
      }
    },
    // 结束计划
    async endPlan() {
      const tips = `是否提前结束计划,周转余额${this.statistics.tail}元将自动退回信用卡`
      try {
        await this.$confirm(tips, '结束计划', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        const res = await post({
          url: 'v3/plan/end',
          data: {
            planId: this.detailsData.planId
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        await this.start()
      } catch (error) {}
    },
    // 暂停计划
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
          url: 'v3/plan/pause',
          data: {
            planId: this.detailsData.planId,
            reasonDesc: desc,
            smsContent: smsContent
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        await this.start()
      } catch (err) {
        console.log(err)
      }
    },
    async cancelTimeEdit() {
      this.resetEditTime()
    },
    // 调整计划
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
      // console.log(taskInList)
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
    // 获取计划信息
    async start() {
      try {
        const res = await post({
          url: 'v3/plan/detail',
          data: {
            planId: this.detailsData.planId,
            table: 'online'
          }
        })
        this.allTasks = res.data.tasks.map(item =>
          Object.assign(item, {
            adjusted: false,
            editedToExecuteAt: undefined
          })
        )
        this.statistics = res.data.statistic
      } catch (error) {
        console.log(error)
      }
    },
    update() {
      this.start()
    },
    async applyPlanAdjust() {
      const allTasks = [].concat(this.allTasks)
      const updateParams = allTasks.map(task => {
        if (task.editedToExecuteAt) {
          return {
            id: task.id,
            ts: task.editedToExecuteAt.getTime()
          }
        }
      })
      try {
        const res = await postJOSN({
          url: 'v3/plan/adjust',
          data: {
            planId: this.detailsData.planId,
            params: updateParams.filter(Boolean)
          }
        })
        this.editing = false
        this.$message({ message: res.msg, type: 'success' })
        await this.start()
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.start()
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
