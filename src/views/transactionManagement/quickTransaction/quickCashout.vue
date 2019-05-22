<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item="交易管理,快捷交易,收款查询"></Breadcrumb>
      <span style="font-size:14px;color:#606266">收款总金额：{{cashSumAmt|normAmount}}元</span>
    </div>
    <div class="screenBatch">
      <el-form inline>
        <el-form-item>
          <el-date-picker
            v-model="startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="交易开始时间"
            style="width:230"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="endTime"
            type="date"
            placeholder="交易结束时间"
            value-format="yyyy-MM-dd"
            style="width:230"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="userName" placeholder="会员姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="useraccount" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item v-if="level!==levelMap.ORGAN">
          <el-input clearable placeholder="机构名称" v-model="organName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable placeholder="推荐人名称" v-model="partnerName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="bank" placeholder="银行名称">
            <el-option
              v-for="(item ,index) in ourbank"
              :key="index"
              :label="item.btName"
              :value="item.btCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="status" placeholder="状态" style="width:110px">
            <el-option label="代付失败" value="4"></el-option>
            <el-option label="交易成功" value="5"></el-option>
            <el-option label="交易失败" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="quickCashoutData" border style="width: 100%" size="small">
      <el-table-column
        v-for="m in table"
        :key="m.title"
        :prop="m.prop"
        :label="m.title"
        :width="m.width"
      ></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <p
            v-if="scope.row.status === '2' || scope.row.status === '3'"
            style="color:red"
          >{{scope.row.status|statusBack}}</p>
          <p v-else style="color:green">{{scope.row.status|statusBack}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="tradeMsg" label="返回信息" width="130">
        <template slot-scope="scope">
          <p
            v-if="scope.row.status === '2' || scope.row.status === '3'"
            style="color:red"
          >{{scope.row.tradeMsg}}</p>
          <p v-else style="color:green">{{scope.row.tradeMsg}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" v-if="canQuickCashoutHumanRun">
          <el-button
            type="text"
            size="small"
            v-if="canQuickCashoutHumanRun"
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
import { levelMap } from '../../../server/level.js'
import { cashoutParseRoleList, cashoutTable } from './table.js'
import { filterUerLeveL } from '../../../util'
import { queryPermission } from '@/util'
import { mixins, date } from '@/core'
import { post } from '../../../store/requestFacade.js'
export default {
  mixins: [mixins.pageMixin, date.dateHorizon],
  name: 'quick-cashout',
  data() {
    return {
      cashSumAmt: 0,
      level: '',
      table: filterUerLeveL(cashoutTable),
      levelMap: levelMap,
      startTime: '',
      endTime: '',
      useraccount: '',
      bank: '',
      ourbank: '',
      status: '',
      organName: '',
      partnerName: '',
      upOrganName: '',
      userName: '',
      quickCashoutData: []
    }
  },
  methods: {
    getUrl() {
      return 'cashrecord/offlineQuery'
    },
    getPageParams() {
      return {
        startedAt: this.startTime,
        shouldEndAt: this.endTime,
        status: this.status,
        userAccount: this.useraccount,
        btName: this.bank,
        organName: this.organName,
        partnerName: this.partnerName,
        userName: this.userName,
        channelId: 'online_quick_channel'
      }
    },
    handleRows(rows) {
      this.quickCashoutData = cashoutParseRoleList([].concat(rows))
      this.cashSumAmt = this.getExtra('tradeAmt')
    },
    async payAnother(row) {
      try {
        await this.$confirm('确定为用户重新发起一笔代付？', '收款代付', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        const res = await post({
          url: 'payment/onlinepay',
          data: {
            amt: row.pamentAmt,
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
    canQuickCashoutHumanRun() {
      return queryPermission('quickCashoutHumanRun')
    }
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  margin: 15px 0;
}
</style>
