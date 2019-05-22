<template>
  <el-dialog
    :visible.sync="earningsShow"
    width="35%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="dialogTit">
      <el-tag style="font-size: 14px;" type="warning">收益详情</el-tag>
      <p class="tis" v-if="earningstype === 1||earningstype===4">
        <i class="el-icon-info"></i> 只统计已确认收货并完成结算的购机订单
      </p>
      <p class="tis" v-if="earningstype === 3">
        <i class="el-icon-info"></i> 只有【YXJ-002】型号的设备激活享受返现奖励
      </p>
    </div>
    <el-table :data="detailsData" height="450" border style="width: 100%" size="small">
      <el-table-column prop="dealType" label="交易类型"></el-table-column>
      <el-table-column prop="profitAmount" label="收益金额">
        <template slot-scope="scope">
          <p>+{{scope.row.profitAmount|normAmount}}</p>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" width="230">
        <template slot-scope="scope">
          <p
            v-if="earningstype === 1"
          >合伙人{{scope.row.name}}平台购机{{scope.row.sum}}台【{{scope.row.devType}}】</p>
          <p
            v-if="earningstype === 2||earningstype===3"
          >商户{{scope.row.name}}激活设备【{{scope.row.devNo}}】</p>
          <p v-if="earningstype === 4">用户{{scope.row.userName}}{{scope.row.setMealName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="addDate" label="交易时间">
        <template slot-scope="scope">
          <p>{{scope.row.addDate|cutTime}}</p>
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
  </el-dialog>
</template>
<script>
import { mixins } from '@/core'
export default {
  name: 'earnings-details',
  mixins: [mixins.pageMixins],
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    earningstype: {
      type: Number,
      default: null
    },
    monthVal: {
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
      earningsShow: false,
      detailsData: []
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    getUrl() {
      const statuMap = {
        1: 'organAccount/purchase',
        2: 'organAccount/activateInfo',
        3: 'organAccount/returnInfo',
        4: 'profit/details'
      }
      return statuMap[this.earningstype]
    },
    getPageParams() {
      return {
        addDate: this.monthVal,
        organId: this.organId ? this.organId : ''
      }
    },
    handleRows(rows) {
      const statuMap = {
        1: '平台购机',
        2: '激活奖励',
        3: '返现奖励',
        4: '开通合伙人奖励'
      }
      this.detailsData = [].concat(
        rows.map(item => {
          return Object.assign({}, item, { dealType: statuMap[this.earningstype] })
        })
      )
    }
  },
  mounted() {
    this.earningsShow = this.flag
    this.loadData()
  }
}
</script>
<style scoped>
.dialogTit {
  margin-top: -40px;
  margin-bottom: 20px;
}
.tis {
  margin-top: 10px;
  font-size: 12px;
}
</style>
