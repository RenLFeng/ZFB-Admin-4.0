<template>
  <div>
    <el-dialog
      title="导出记录"
      :visible.sync="exportRecordForm"
      :before-close="modalClose"
      @click="update"
    >
      <el-table
        :data='recordData'
        border
        style="width: 100%"
      >
        <el-table-column
          v-for="v in table"
          :prop="v.tableProp"
          :label="v.tableLabel"
          :width="v.width"
          :key="v.tableProp"
        >
        </el-table-column>
        <el-table-column
          prop="active"
          label="操作"
          v-if="canUpdateInsuranceInfo"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.recordState === 0&&canUpdateInsuranceInfo"
              @click='updateInsBtn(scope.row)'
            >更新保单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding: 16px; background: white; overflow: hidden;">
        <div style="float: right;">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="paging.currentPage"
            :page-size="paging.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="paging.total"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <!-- 更新保单 -->
    <el-dialog
      append-to-body
      title="保单更新"
      :visible.sync="updateInsurance"
    >
      <p>请输入平安保险反馈的保单号、生效日期和结束日期</p>
      <p style="padding:0 0 20px 0">将同步更新批次【A0001】的100个会员的保单信息</p>
      <el-form
        size="small"
        class="demo-form-inline"
      >
        <el-form-item
          label="保单号"
          label-width='80px'
        >
          <el-input
            v-model="insuranceNo"
            placeholder="请输入保单号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="生效日期"
          label-width='80px'
        >
          <el-date-picker
            v-model="effectDate"
            @change="countEndDate"
            value-format='yyyy-MM-dd hh:mm:ss'
            :picker-options="effectDateOptions"
            type="datetime"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束日期"
          label-width='80px'
        >
          <el-date-picker
            disabled
            v-model="endDate"
            value-format='yyyy-MM-dd hh:mm:ss'
            type="datetime"
            :picker-options='endDateOptions'
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="updateInsurance = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updataIns"
        >更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { exportRecordBaseColumn, parseExportRecord } from './own/calc.js'
import { post } from '../../store/requestFacade.js'
import { mixins } from '@/core'
import { queryPermission } from '@/util'
export default {
  name: 'record-form',
  mixins: [mixins.pageMixin],
  props: {
    flag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      table: [],
      recordData: [
        {
          batchId: '',
          exportNum: '',
          operator: '',
          exportDate: '',
          updateDate: '',
          recordState: '',
          updateOper: ''
        }
      ],
      exportRecordForm: false,
      updateInsurance: false,
      effectDate: '',
      endDate: '',
      insuranceNo: '',
      batchId: '',
      effectDateOptions: '',
      endDateOptions: ''
    }
  },
  methods: {
    countEndDate() {
      let startyear = new Date(this.effectDate).getFullYear() + 1
      let startmonth = new Date(this.effectDate).getMonth() + 1
      let startdate = new Date(this.effectDate).getDate() - 1
      let starthour = new Date(this.effectDate).getHours()
      let startminutes = new Date(this.effectDate).getMinutes()
      let startsecond = new Date(this.effectDate).getSeconds()
      this.endDate =
        startyear +
        '-' +
        startmonth +
        '-' +
        startdate +
        ' ' +
        starthour +
        ':' +
        startminutes +
        ':' +
        startsecond
    },
    getUrl() {
      return 'record/query'
    },
    getPageParams() {
      return {}
    },
    handleRows(rows) {
      this.recordData = parseExportRecord([].concat(rows))
      console.log(this.recordData)
    },
    insuranceStatus(row) {
      return row.recordState === 1 ? '已投保' : '投保中'
    },
    async updataIns() {
      try {
        const res = await post({
          url: 'user/insurance/updateInsurance',
          data: {
            batch: this.batchId,
            insuranceNo: this.insuranceNo,
            effDate: this.effectDate,
            endDate: this.endDate
          }
        })
        this.loadData()
        this.$emit('update')
        this.updateInsurance = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    updateInsBtn(row) {
      this.updateInsurance = true
      this.batchId = row.batchId
      console.log(this.batchId)
    },
    modalClose() {
      this.$emit('modalClose')
      this.exportRecordForm = false
    },
    update() {
      this.$emit('update')
    }
  },
  mounted() {
    this.exportRecordForm = this.flag
    this.loadData()
    this.table = exportRecordBaseColumn()
  },
  computed: {
    canUpdateInsuranceInfo() {
      return queryPermission('updateInsuranceInfo')
    }
  }
}
</script>
