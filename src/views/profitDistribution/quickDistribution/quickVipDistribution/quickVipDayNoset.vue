<template>
  <div>
    <p class="total">
      <span>总交易金额：100,000,000.00元</span>&nbsp;&nbsp;
      <span>日结总分润：100,000,000.00元</span>
    </p>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-date-picker
          v-model="settlementTimeRange"
          value-format="yyyy-MM-dd"
          placeholder="交易时间(开始)"
        ></el-date-picker>&nbsp;&nbsp;至&nbsp;
        <el-date-picker
          v-model="settlementTimeRange"
          value-format="yyyy-MM-dd"
          placeholder="交易时间(结束)"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="phone" placeholder="用户姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="phone" placeholder="推荐人姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="phone" placeholder="直属机构"></el-input>
      </el-form-item>
      <br>
      <el-form-item>
        <el-date-picker
          v-model="settlementTimeRange"
          value-format="yyyy-MM-dd"
          placeholder="结算时间(开始)"
        ></el-date-picker>&nbsp;&nbsp;至&nbsp;
        <el-date-picker
          v-model="settlementTimeRange"
          value-format="yyyy-MM-dd"
          placeholder="结算时间(结束)"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="phone" placeholder="用户手机号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="phone" placeholder="推荐人手机号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="phone" placeholder="上级机构"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table border :data="VipRepayMonthData" style="width: 100%" size="small">
      <el-table-column
        v-for="v in nosetTableTitleList"
        :prop="v.prop"
        :label="v.title"
        :width="v.width"
        :key="v.title"
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
    <quick-vip-month-detail v-if="detailShow" @closeDetail="closeDetail"></quick-vip-month-detail>
  </div>
</template>

<script>
import { queryPermission, filterUerLeveL } from '@/util'
import { mixins } from '@/core'
import { nosetTableTitle } from './table.js'
export default {
  name: 'quick-vip-day-noset',
  mixins: [mixins.pageMixin],
  computed: {
    canQuickVipRepayMonthDetail() {
      return queryPermission('quickVipRepayMonthDetail')
    },
    canQuickVipReceiptMonthDetail() {
      return queryPermission('quickVipReceiptMonthDetail')
    }
  },
  data() {
    return {
      nosetTableTitleList: '',
      settlementTimeRange: '',
      phone: '',
      settlementStatus: '',
      settlementMonth: '',
      VipRepayMonthData: [],
      detailShow: false
    }
  },
  methods: {
    search() {},
    clickDistributionDetail() {
      this.detailShow = true
    },
    closeDetail() {
      this.detailShow = false
    }
  },
  mounted() {
    this.nosetTableTitleList = filterUerLeveL(nosetTableTitle)
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
