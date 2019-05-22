<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item='交易管理,设备交易,收款查询'></Breadcrumb>
      <span style="font-size:14px;color:#606266">收款总金额：{{cashSumAmt|normAmount}}元</span>
    </div>
    <div class="screenBatch">
      <el-form
        :inline="true"
        :model="searchData"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-date-picker
            v-model="searchData.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="交易开始时间"
            style="width:200px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchData.endTime"
            type="date"
            placeholder="交易结束时间"
            value-format="yyyy-MM-dd"
            style="width:200px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            type="number"
            clearable
            v-model="searchData.useraccount"
            placeholder="手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            v-model="searchData.status"
            placeholder="状态"
            style="width:110px"
          >
            <el-option
              label="代付失败"
              value="4"
            ></el-option>
            <el-option
              label="交易成功"
              value="5"
            ></el-option>
            <el-option
              label="交易失败"
              value="-1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            v-model="searchData.btName"
            placeholder="银行名称"
            style="width:110px"
          >
            <el-option
              v-for="(item,index) in ourbank"
              :key="index"
              :label="item.btName"
              :value="item.btCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item v-if="level!==levelMap.ORGAN">
          <el-input
            v-model="searchData.organName"
            clearable
            placeholder="机构名称"
            style="width:230px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchData.partner"
            clearable
            placeholder="合伙人名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchData.userName"
            clearable
            style="width:230px"
            placeholder="会员名称"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-left:150px">
          <el-button
            type="primary"
            @click="loadData(true)"
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="cashoutData"
      border
      style="width: 100%"
      size="small"
    >
      <el-table-column
        v-for="(v,i) in cashoutTableList"
        :prop="v.prop"
        :label="v.title"
        :width="v.width"
        :key="i"
      ></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <p
            v-if="scope.row.status === '2' || scope.row.status === '3'"
            style="color:red"
          >{{scope.row.status|statusBack}}</p>
          <p
            v-else
            style="color:green"
          >{{scope.row.status|statusBack}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="tradeMsg"
        label="返回信息"
        width="130"
      >
        <template slot-scope="scope">
          <p
            v-if="scope.row.status === '2' || scope.row.status === '3'"
            style="color:red"
          >{{scope.row.tradeMsg}}</p>
          <p
            v-else
            style="color:green"
          >{{scope.row.tradeMsg}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template
          slot-scope="scope"
          v-if="canCashoutHumanRun"
        >
          <el-button
            type="text"
            size="small"
            v-if="canCashoutHumanRun"
            v-show="scope.row.status === '3'"
            @click="payAnother(scope.row)"
          >代付</el-button>
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
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mixins } from '@/core'
import { queryPermission } from '@/util'
import { post } from '../../../store/requestFacade.js'
import { levelMap } from '../../../server/level.js'
import { cashoutParseRoleList, cashoutTable } from './table.js'
import { filterUerLeveL } from '../../../util'
export default {
  name: 'cashout',
  mixins: [mixins.pageMixin],
  data() {
    return {
      cashoutTableList: filterUerLeveL(cashoutTable),
      cashSumAmt: 0,
      ourbank: [],
      searchData: {
        useraccount: '',
        status: '',
        startTime: '',
        endTime: '',
        btName: '',
        organName: '',
        partner: '',
        userName: ''
      },
      level: '',
      levelMap: levelMap,
      cashoutData: []
    }
  },
  methods: {
    getUrl() {
      return 'cashrecord/offlineQuery'
    },
    getPageParams() {
      return {
        startedAt: this.searchData.startTime,
        shouldEndAt: this.searchData.endTime,
        status: this.searchData.status,
        userAccount: this.searchData.useraccount,
        btName: this.searchData.btName,
        organName: this.searchData.organName,
        partnerName: this.searchData.partner,
        userName: this.searchData.userName,
        channelId: 'jiaLian_pos_channel'
      }
    },
    handleRows(rows) {
      this.cashoutData = cashoutParseRoleList(rows)
      console.log(this.cashoutData)
      this.cashSumAmt = this.getExtra('tradeAmt')
    },
    async payAnother(row) {
      try {
        await this.$confirm('确定为用户重新发起一笔代付？', '收款代付', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        const res = await post({
          url: 'payment/cashpay',
          data: {
            tradeNo: row.tradeNo
          }
        })
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.loadData()
      } catch (error) {}
    },
    // 获取银行列表
    async getbank() {
      try {
        const res = await post({
          url: 'channel/queryBankTrunk'
        })
        this.ourbank = res.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  filters: {
    statusBack(row) {
      const statuMap = {
        1: '交易成功',
        2: '交易失败',
        3: '代付失败',
        4: '交易中'
      }
      return statuMap[row]
    }
  },
  mounted() {
    this.getbank()
    this.loadData()
    this.level = localStorage.getItem('level')
  },
  computed: {
    canCashoutHumanRun() {
      return queryPermission('cashoutHumanRun')
    }
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  margin: 15px 0;
}
</style>
