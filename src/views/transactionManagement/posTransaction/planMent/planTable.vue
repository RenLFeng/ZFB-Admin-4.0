<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备交易</el-breadcrumb-item>
        <el-breadcrumb-item>计划管理</el-breadcrumb-item>
      </el-breadcrumb>
      <p
        style="font-size:14px;margin-right:15px; color:#606266"
      >账单总金额：{{BillAmount|normAmount}}元 周转金总额：{{WorkAmount|normAmount}}元 手续费总额：{{sumFee|normAmount}}元</p>
    </div>
    <div class="screenBatch">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="选择开始日期：">
          <el-date-picker
            v-model="searchData.starteDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :unlink-panels="true"
            range-separator="-"
            style="width:230px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="searchData.planId" placeholder="计划单号" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            v-model="searchData.useraccount"
            placeholder="手机号码"
            style="width:180px"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="level !== levelMap.SECONDORGAN">
          <el-input clearable v-model="searchData.organName" placeholder="机构名称" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            v-model="searchData.status"
            placeholder="状态"
            multiple
            style="width:210px"
          >
            <el-option label="执行中" :value="1"></el-option>
            <el-option label="暂停中" :value="2"></el-option>
            <el-option label="异常结束" :value="3"></el-option>
            <el-option label="正常结束" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="选择结束日期：">
          <el-date-picker
            v-model="searchData.endDate"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:230px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="searchData.partner" placeholder="合伙人姓名" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="searchData.userName" placeholder="会员姓名" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="searchData.bankName" placeholder="银行名称" style="width:180px">
            <el-option
              v-for="(item,index) in ourbank"
              :key="index"
              :label="item.btName"
              :value="item.btName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="searchData.devModel" placeholder="设备型号" style="width:210px">
            <el-option
              v-for="(item,index) in modelData"
              :key="index"
              :label="item.brandSubName"
              :value="item.brandSubName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right; margin-bottom:20px">
          <el-button type="primary" @click="loadData(true)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table :data="planTableData" border style="width: 100%" size="small">
      <el-table-column
        v-for="(v,i) in TableList"
        :prop="v.prop"
        :label="v.title"
        :width="v.width"
        :key="i"
      ></el-table-column>
      <el-table-column
        prop="address"
        label="操作"
        width="170"
        v-if="canPlanDetail||canStopPlan||canRecoverPlan||canClosePlan"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="canPlanDetail"
            @click="planDatails(scope.row)"
          >计划详情</el-button>
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
import { post } from '../../../../store/requestFacade.js'
import { levelMap } from '../../../../server/level.js'
import { TableList, ParseRoleList } from './table.js'
export default {
  name: 'plan-table',
  mixins: [mixins.pageMixin],
  data() {
    return {
      level: '',
      levelMap: levelMap,
      TableList: TableList,
      ourbank: [],
      modelData: [],
      BillAmount: '',
      WorkAmount: '',
      sumFee: '',
      searchData: {
        planId: '',
        status: [1, 2],
        useraccount: '',
        bankName: '',
        starteDate: '',
        devModel: '',
        organName: '',
        endDate: '',
        partner: '',
        userName: ''
      },
      planTableData: [],
      planData: {
        showPlan: 2,
        detailsData: {}
      }
    }
  },
  methods: {
    // 获取表格数据
    getUrl() {
      return 'plan/query'
    },
    getPageParams() {
      return {
        startedAt: this.searchData.starteDate ? this.searchData.starteDate[0] : '',
        shouldEndAt: this.searchData.starteDate ? this.searchData.starteDate[1] : '',
        endStartedAt: this.searchData.endDate ? this.searchData.endDate[0] : '',
        endShouldEndAt: this.searchData.endDate ? this.searchData.endDate[1] : '',
        planId: this.searchData.planId,
        status: this.searchData.status ? this.searchData.status : '',
        useraccount: this.searchData.useraccount,
        oneOrganName: this.searchData.organName,
        partnerName: this.searchData.partner,
        userName: this.searchData.userName,
        btName: this.searchData.bankName,
        brandSubName: this.searchData.devModel
      }
    },
    handleRows(rows) {
      this.planTableData = ParseRoleList(rows)
      this.BillAmount = this.getExtra('BillAmount')
      this.WorkAmount = this.getExtra('WorkAmount')
      this.sumFee = this.getExtra('sumFee')
    },
    // 状态
    status(row, column) {
      const statuMap = {
        1: '执行中',
        2: '暂停中',
        3: '异常结束',
        4: '正常结束'
      }
      return statuMap[row.status]
    },
    // 点击详情
    planDatails(row) {
      this.planData.detailsData = row
      this.$emit('seeDatails', this.planData)
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
    },
    // 型号
    async getModel() {
      try {
        const res = await post({
          url: 'posBrand/queryBrand'
        })

        this.modelData = res.data.rows
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.loadData()
    this.getbank()
    this.getModel()
    this.level = localStorage.getItem('level')
  },
  computed: {
    canPlanDetail() {
      return queryPermission('planDetail')
    }
  }
}
</script>
<style scoped>
.base-tit {
  padding: 15px 0;
}
</style>
