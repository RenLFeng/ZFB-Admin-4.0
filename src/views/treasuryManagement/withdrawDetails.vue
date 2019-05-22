<template>
  <el-dialog :visible.sync="withdrawShow" width="50%" :before-close="withdrawClose">
    <div class="dialogTit">
      <el-tag style="font-size: 14px;" type="warning">提现明细</el-tag>
    </div>
    <el-table :data="detailsData" height="450" border style="width: 100%" size="small">
      <el-table-column prop="money" label="提现金额(元)"></el-table-column>
      <el-table-column prop="arrivalAmt" label="到账金额(元)"></el-table-column>
      <el-table-column prop="bankCardNo" label="到账银行卡" width="180"></el-table-column>
      <el-table-column prop="username" label="到账账户名"></el-table-column>
      <el-table-column label="提现申请时间">
        <template slot-scope="scope">
          <p>{{scope.row.addDate|cutTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="auditRemark" label="备注信息"></el-table-column>
      <el-table-column prop="payStatus" :formatter="getResultStatus" label="处理结果"></el-table-column>
    </el-table>
    <div style="padding: 16px; background: white; overflow: hidden;">
      <div style="float: right;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="paging.currentPage"
          :page-size="paging.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paging.total"
        ></el-pagination>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mixins } from '@/core'
export default {
  name: 'withdraw-details',
  mixins: [mixins.pageMixins],
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    monthWithdraw: {
      type: String,
      default: null
    },
    organId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      withdrawShow: false,
      detailsData: []
    }
  },
  methods: {
    withdrawClose() {
      this.$emit('withdrawClose')
    },
    getUrl() {
      return 'organAccount/presentationInfo'
    },
    getPageParams() {
      return {
        addDate: this.monthWithdraw,
        organId: this.organId ? this.organId : ''
      }
    },
    handleRows(rows) {
      this.detailsData = [].concat(rows)
    },
    getResultStatus(row) {
      const payStatus = {
        0: '待审核',
        1: '不通过',
        2: '审核中',
        3: '提现成功',
        4: '提现失败'
      }
      return payStatus[row.payStatus]
    }
  },
  mounted() {
    this.withdrawShow = this.flag
    this.loadData()
  }
}
</script>
<style scoped>
.dialogTit {
  margin-top: -40px;
  margin-bottom: 20px;
}
</style>
