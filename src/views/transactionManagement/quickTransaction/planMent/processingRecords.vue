<template>
  <el-dialog
    title="处理记录"
    :visible.sync="processingShow"
    width="40%"
    :before-close="processingClose"
  >
    <el-table :data="processingData" size="mini" border>
      <el-table-column prop="addDate" label="处理时间" width="150">
        <template slot-scope="scope">
          <p>{{scope.row.addDate|cutTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="optItem" label="处理事项" :formatter="optItem" width="150"></el-table-column>
      <el-table-column prop="logResult" label="备注">
        <template slot-scope="scope">
          <p v-if="scope.row.reason !== null">处理原因：{{scope.row.reason}}</p>
          <p v-if="scope.row.smsContent !== null">短信内容：{{scope.row.smsContent}}</p>
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
  name: 'plan-log',
  mixins: [mixins.pageMixin],
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    planId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      processingShow: false,
      processingData: []
    }
  },
  methods: {
    processingClose() {
      this.$emit('processingClose')
    },
    optItem(row, column) {
      const optItemMap = {
        1: '暂停',
        2: '恢复计划',
        3: '计划调整',
        4: '结束计划'
      }
      const optRoleMap = {
        1: '自动',
        2: '手动',
        3: '用户'
      }
      if (row.optItem === 1) {
        return optRoleMap[row.optRole] + optItemMap[row.optItem]
      } else {
        return optItemMap[row.optItem]
      }
    },
    getUrl() {
      return 'v3/plan/optLog'
    },
    getPageParams() {
      return {
        planId: this.planId
      }
    },
    handleRows(rows) {
      this.processingData = [].concat(rows)
    }
  },
  mounted() {
    this.processingShow = this.flag
    this.loadData()
  }
}
</script>

<style scoped>
</style>
