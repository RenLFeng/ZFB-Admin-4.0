<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item="交易管理,快捷交易,还款查询"></Breadcrumb>
      <span class="totalMoney">还款总金额：{{totalAmount|normAmount}}元</span>
    </div>
    <div class="screenBatch">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            v-model="startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="实际还款开始时间"
            style="width:200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="实际还款结束时间"
            style="width:230"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="planId" placeholder="计划单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="userName" clearable placeholder="会员姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="useraccount" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-if="level!==levelMap.SECONDORGAN"
            clearable
            placeholder="机构名称"
            v-model="organName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="partnerName" placeholder="推荐人名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="bank" placeholder="银行名称">
            <el-option
              v-for="(item ,index) in ourbank"
              :key="index"
              :label="item.btName"
              :value="item.btName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="status" placeholder="状态" style="width:110px">
            <el-option v-for="m in getStatus" :key="m.value" :label="m.value" :value="m.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="repaymenteData" border style="width: 100%" size="small">
      <el-table-column
        v-for="m in table"
        :key="m.title"
        :prop="m.prop"
        :label="m.title"
        :width="m.width"
      ></el-table-column>
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
import { repayParseRoleList, repayTable } from './table.js'
import { mixins, date } from '@/core'
import { post } from '../../../store/requestFacade'
import { levelMap } from '../../../server/level.js'
import { filterUerLeveL } from '../../../util'
export default {
  mixins: [mixins.pageMixin, date.dateHorizon],
  name: 'repayments',
  data() {
    return {
      levelMap: levelMap,
      table: filterUerLeveL(repayTable),
      level: '',
      startTime: '',
      endTime: '',
      planId: '',
      status: '',
      bank: '',
      ourbank: '',
      useraccount: '',
      organName: '',
      partnerName: '',
      userName: '',
      repaymenteData: [],
      totalAmount: '',
      getStatus: [
        {
          id: 1,
          value: '未还款'
        },
        {
          id: 3,
          value: '还款失败'
        },
        {
          id: 4,
          value: '已还款'
        }
      ]
    }
  },
  methods: {
    // 获取表格数据
    getUrl() {
      return 'online/query'
    },
    getPageParams() {
      return {
        startedAt: this.startTime,
        shouldEndAt: this.endTime,
        type: 2,
        planId: this.planId,
        userName: this.userName,
        status: this.status,
        useraccount: this.useraccount,
        btName: this.bank,
        oneOrganName: this.organName,
        partnerName: this.partnerName
      }
    },
    handleRows(rows) {
      this.repaymenteData = repayParseRoleList([].concat(rows))
      this.totalAmount = this.getExtra('totalAmount')
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
  mounted() {
    this.loadData()
    this.getbank()
    this.level = localStorage.getItem('level')
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  margin: 15px 0;
}
.totalMoney {
  float: right;
  margin-right: 50px;
  font-size: 15px;
  color: #606266;
}
</style>
