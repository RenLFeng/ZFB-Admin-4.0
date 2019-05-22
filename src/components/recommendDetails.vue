<template>
  <div>
    <el-dialog :visible.sync="recommendShow" width="30%" :before-close="recommendClose">
      <div class="dialogTit">
        <el-tag style="font-size: 14px;" type="warning">收益明细</el-tag>
      </div>
      <el-table :data="detailsData" height="450" border style="width: 100%" size="small">
        <el-table-column prop="amt" label="收益金额"></el-table-column>
        <el-table-column label="备注信息">
          <template slot-scope="scope">
            <p>用户{{scope.row.remarks}}累计还款1万元</p>
          </template>
        </el-table-column>
        <el-table-column prop="activityTime" label="激活时间">
          <template slot-scope="scope">
            <p>{{scope.row.activityTime|cutTime}}</p>
          </template>
        </el-table-column>
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
  </div>
</template>
<script>
import { mixins } from '@/core'
export default {
  mixins: [mixins.pageMixins],
  data() {
    return {
      recommendShow: true,
      detailsData: []
    }
  },
  props: {
    monthVal: {
      type: String,
      default: null
    },
    organId: {
      type: Number,
      default: null
    }
  },
  methods: {
    recommendClose() {
      this.$emit('recommendClose')
    },
    getUrl() {
      return '/organAccount/onlineProfit'
    },
    getPageParams() {
      return {
        addDate: this.monthVal,
        organId: this.organId ? this.organId : ''
      }
    },
    handleRows(rows) {
      this.detailsData = [].concat(rows)
    }
  },
  mounted() {
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
