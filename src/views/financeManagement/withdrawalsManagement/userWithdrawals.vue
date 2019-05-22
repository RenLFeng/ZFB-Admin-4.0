<template>
  <div>
    <div class="searchBox">
      <p>
        <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form :inline="true" class="demo-form-inline" size="small" v-show="activeNames">
        <el-form-item label="会员名称">
          <el-input clearable v-model="userName" placeholder="会员名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input clearable v-model="phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select clearable placeholder="审核状态" v-model="auditStatus">
            <el-option
              v-for="(item, i) in getAuditStatus"
              :label="item.text"
              :value="item.id"
              :key="i"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代付状态">
          <el-select clearable placeholder="代付状态" v-model="payStatus">
            <el-option
              v-for="(item, index) in getPayStatus"
              :label="item.text"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到账银行">
          <el-select clearable placeholder="到账银行" v-model="btCode">
            <el-option v-for="(v, i) in ourbank" :key="i" :label="v.btName" :value="v.btCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到账银行">
          <el-select clearable placeholder="到账银行" v-model="btCode">
            <el-option v-for="(v, i) in ourbank" :key="i" :label="v.btName" :value="v.btCode"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="total">
      <pre style="font-family:inherit">账户总余额：{{balanceSum|normAmount}} 元 提现总余额：{{cashTotalAmt|normAmount}} 元 实际到账总额：{{realArrivalAmt|normAmount}} 元 手续费总额：{{feeSumAmt|normAmount}} 元</pre>
    </div>
    <el-table border :data="userWithdrawalData" style="width: 100%" size="small">
      <el-table-column
        v-for="(v, i) in table"
        :prop="v.tableProp"
        :label="v.tableLabel"
        :width="v.width"
        :key="i"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="getUserWithdrawDetail(scope.row.withdrawId)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 16px; background: white; overflow: hidden;">
      <div style="float: right;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paging.currentPage"
          :page-size="paging.pageSize"
          :page-sizes="[10, 30, 50, 100]"
          layout="total, prev, pager, next, sizes"
          :total="paging.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { userWithdrawalBaseColumn, parseUserWithdrawl } from '../own/calc.js'
import { getAuditStatus, getPayStatus } from '../own/status.js'
import { mixins } from '@/core'
export default {
  name: 'user-withdrawals',
  mixins: [mixins.pageMixin],
  props: {
    ourbank: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      pageSize: 10,
      table: [],
      getAuditStatus: getAuditStatus,
      getPayStatus: getPayStatus,
      phone: '',
      auditStatus: '',
      payStatus: '',
      btCode: '',
      userName: '',
      balanceSum: '',
      cashTotalAmt: '',
      realArrivalAmt: '',
      feeSumAmt: '',
      userWithdrawalData: [],
      userWithdrawArg: {
        withdrawId: '',
        showWithdrawDetail: 2,
        type: 2
      }
    }
  },
  methods: {
    reset() {
      this.userName = ''
      this.phone = ''
      this.auditStatus = ''
      this.payStatus = ''
      this.btCode = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    getUrl() {
      return 'withdraw/query'
    },
    getPageParams() {
      return {
        phone: this.phone,
        auditStatus: this.auditStatus,
        payStatus: this.payStatus,
        withdrawType: 2,
        btCode: this.btCode,
        userName: this.userName,
        pageSize: this.pageSize
      }
    },
    handleRows(rows) {
      this.userWithdrawalData = parseUserWithdrawl([].concat(rows))
      const obj = this.getExtra('obj')
      this.balanceSum = obj.balanceSum
      this.cashTotalAmt = obj.cashTotalAmt
      this.realArrivalAmt = obj.realArrivalAmt
      this.feeSumAmt = obj.feeSumAmt
    },
    getUserWithdrawDetail(id) {
      this.userWithdrawArg.withdrawId = id
      this.$emit('userWithdrawDetail', this.userWithdrawArg)
    }
  },
  mounted() {
    this.table = userWithdrawalBaseColumn()
    this.loadData()
  }
}
</script>

<style lang="css" scoped>
.total {
  font-size: 14px;
  color: #606266;
  text-align: right;
  margin: 0 0 15px 0;
}
</style>
