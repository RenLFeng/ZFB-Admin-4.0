<template>
  <div>
    <el-table :data="offineData" border style="width: 100%" size="small">
      <el-table-column prop="bankCardNo" label="信用卡卡号"></el-table-column>
      <el-table-column prop="btName" label="发卡行"></el-table-column>
      <el-table-column prop="cardPhone" label="预留手机号"></el-table-column>
      <el-table-column prop="fixedAmount" label="固定额度"></el-table-column>
      <el-table-column prop="billingDate" label="账单日"></el-table-column>
      <el-table-column prop="dueDate" label="还款日"></el-table-column>
      <el-table-column prop="address" label="绑卡时间">
        <template slot-scope="scope">
          <p>{{scope.row.addDate|cutTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="preparationDate" label="报备时间">
        <template slot-scope="scope">
          <p>{{scope.row.preparationDate|cutTime}}</p>
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
export default {
  name: 'reported-offine',
  mixins: [mixins.pageMixin],
  props: {
    organId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      level: '',
      offineData: []
    }
  },
  methods: {
    getUrl() {
      return 'userManagement/userBankCard'
    },
    getPageParams() {
      return {
        organId: this.organId
      }
    },
    handleRows(rows) {
      this.offineData = [].concat(rows)
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.loadData()
  }
}
</script>
<style scoped>
</style>
