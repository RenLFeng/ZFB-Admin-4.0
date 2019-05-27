<template>
  <div>
    <el-row>
      <el-col :span="23">
        <div class="searchBox">
          <p>
            <el-button @click="toggle" type="text" size="small" :icon="icon">{{btnText}}</el-button>
          </p>
          <el-form :inline="true" class="demo-form-inline" size="small" v-show="activeNames">
            <el-form-item label="机构">
              <el-input clearable v-model="organName" placeholder="请输入机构名称或机构编号"></el-input>
            </el-form-item>
            <el-form-item label="机构类型">
              <el-select clearable placeholder="机构类型" v-model="organLevel">
                <el-option v-for="i in getOrganLevel" :label="i.text" :value="i.id" :key="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="到账银行">
              <el-select clearable placeholder="到账银行" v-model="btCode">
                <el-option v-for="(v, i) in ourbank" :key="i" :label="v.btName" :value="v.btCode"></el-option>
              </el-select>
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
          </el-form>
          <div style="margin-bottom: 10px">
            <el-button size="small" type="primary" @click="search">搜索</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="1">
        <div style="width:100%;text-align:right">
          <el-button type="primary" size="small" @click="newBtn">新增提现</el-button>
        </div>
      </el-col>
    </el-row>

    <div class="total">
      <pre style="font-family:inherit">账户总余额：{{balanceSum|normAmount}} 元  提现总余额：{{cashTotalAmt|normAmount}} 元  实际到账总额：{{realArrivalAmt|normAmount}} 元  手续费总额：{{feeSumAmt|normAmount}} 元</pre>
    </div>
    <el-table border :data="organWithdrawalData" style="width: 100%" size="small">
      <el-table-column
        v-for="v in table"
        :prop="v.tableProp"
        :label="v.tableLabel"
        :width="v.width"
        :key="v.tableProp"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="getOrganWithdrawDetail(scope.row.withdrawId)"
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
          layout="total, prev, pager, next,sizes"
          :total="paging.total"
        ></el-pagination>
      </div>
    </div>
    <new-withdraw v-if="pop" @close="close" @fresh="fresh"></new-withdraw>
  </div>
</template>

<script>
import newWithdraw from './newWithdraw'
import { organWithdrawalBaseColumn, parseOrganWithdrawl } from '../own/calc.js'
import { getOrganLevel, getAuditStatus, getPayStatus } from '../own/status.js'
import { mixins } from '@/core'
export default {
  name: 'organization-withdrawals',
  components: {
    newWithdraw
  },
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
      organName: '',
      auditStatus: '',
      payStatus: '',
      organLevel: '',
      btCode: '',
      cashTotalAmt: '',
      balanceSum: '',
      realArrivalAmt: '',
      feeSumAmt: '',
      organWithdrawalData: [],
      organWithdrawArg: {
        withdrawId: '',
        showWithdrawDetail: 2,
        type: 1
      },
      getOrganLevel: getOrganLevel,
      getAuditStatus: getAuditStatus,
      getPayStatus: getPayStatus,
      pop: false
    }
  },
  methods: {
    reset() {
      this.organName = ''
      this.organLevel = ''
      this.btCode = ''
      this.auditStatus = ''
      this.payStatus = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    getUrl() {
      return 'withdraw/query'
    },
    getPageParams() {
      return {
        organName: this.organName,
        auditStatus: this.auditStatus,
        payStatus: this.payStatus,
        withdrawType: 1,
        btCode: this.btCode,
        organLevel: this.organLevel,
        pageSize: this.pageSize
      }
    },
    handleRows(rows) {
      this.organWithdrawalData = parseOrganWithdrawl([].concat(rows))
      const obj = this.getExtra('obj')
      this.balanceSum = obj.balanceSum
      this.cashTotalAmt = obj.cashTotalAmt
      this.realArrivalAmt = obj.realArrivalAmt
      this.feeSumAmt = obj.feeSumAmt
    },
    getOrganWithdrawDetail(id) {
      this.organWithdrawArg.withdrawId = id
      this.$emit('organWithdrawDetail', this.organWithdrawArg)
    },
    close() {
      this.pop = false
    },
    newBtn() {
      this.pop = true
    },
    fresh() {
      this.pop = false
      this.loadData()
    }
  },
  mounted() {
    this.table = organWithdrawalBaseColumn()
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
