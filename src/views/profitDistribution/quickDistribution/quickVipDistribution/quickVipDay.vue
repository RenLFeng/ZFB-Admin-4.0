<template>
  <div>
    <div class="searchBox">
      <p class="total">
        <span>总交易金额：{{totalPerformance|normAmount}}元</span>&nbsp;&nbsp;
        <span>日结总分润：{{totalProfit|normAmount}}元</span>
      </p>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-date-picker v-model="startDate" value-format="yyyy-MM-dd" placeholder="结算时间(开始)"></el-date-picker>&nbsp;&nbsp;至&nbsp;
          <el-date-picker v-model="endDate" value-format="yyyy-MM-dd" placeholder="结算时间(结束)"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-if="settleStatus===1" v-model="vipName" placeholder="VIP姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="referrer" placeholder="推荐人姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="userName" placeholder="用户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="userPhone" placeholder="用户手机号码"></el-input>
        </el-form-item>
        <br>
        <el-form-item>
          <el-input clearable v-if="settleStatus===1" v-model="vipPhone" placeholder="VIP手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="referrerPhone" placeholder="推荐人手机号码"></el-input>
        </el-form-item>
        <el-form-item v-if="level ===levelMap.PLATFORM">
          <el-input clearable v-model="province" placeholder="分公司机构"></el-input>
        </el-form-item>
        <el-form-item v-if="level <=levelMap.PROVINCIAL">
          <el-input clearable v-model="oneOrgan" placeholder="子公司"></el-input>
        </el-form-item>
        <el-form-item v-if="level <=levelMap.ORGAN">
          <el-input clearable v-model="county" placeholder="高级合伙人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="结算状态" v-model="settleStatus" @change="getSettleStatus">
            <el-option label="未结算" :value="0"></el-option>
            <el-option label="已结算" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border :data="VipRepayDayData" style="width: 100%" size="small">
      <el-table-column prop="vipUserCode" label="VIP" v-if="settleStatus===1"></el-table-column>
      <el-table-column
        v-for="v in TableTitleList"
        :prop="v.prop"
        :label="v.title"
        :key="v.title"
        :width="v.width"
      ></el-table-column>

      <el-table-column prop="settleDateText" label="结算时间" v-if="settleStatus===1"></el-table-column>
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
import { levelMap } from '../../../../server/level.js'
import { mixins } from '@/core'
import { filterUerLeveL } from '@/util'
import { TableTitle, ParseRoleList } from './table.js'
export default {
  name: 'quick-vip-repay-day',
  mixins: [mixins.pageMixin],
  props: {
    profitType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      levelMap,
      level: '',
      TableTitleList: [],
      VipRepayDayData: [],
      startDate: '',
      endDate: '',
      vipName: '',
      referrer: '',
      userName: '',
      userPhone: '',
      vipPhone: '',
      referrerPhone: '',
      province: '',
      oneOrgan: '',
      county: '',
      settleStatus: 1,
      totalPerformance: '',
      totalProfit: ''
    }
  },
  methods: {
    search() {
      this.loadData()
    },
    getUrl() {
      return 'vipProfit/query'
    },
    getPageParams() {
      return {
        profitType: this.profitType,
        startDate: this.startDate,
        endDate: this.endDate,
        vipName: this.vipName,
        referrer: this.referrer,
        userName: this.userName,
        userPhone: this.userPhone,
        vipPhone: this.vipPhone,
        referrerPhone: this.referrerPhone,
        province: this.province,
        oneOrgan: this.oneOrgan,
        county: this.county,
        settleStatus: this.settleStatus
      }
    },
    handleRows(rows) {
      this.VipRepayDayData = ParseRoleList([].concat(rows))
      this.totalPerformance = this.getExtra('totalPerformance')
      this.totalProfit = this.getExtra('totalProfit')
    },
    getSettleStatus() {
      this.loadData(true)
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.TableTitleList = filterUerLeveL(TableTitle)
    this.loadData()
  }
}
</script>

<style lang="css" scoped>
.total {
  color: #606266;
  font-size: 14px;
  text-align: right;
}
</style>
