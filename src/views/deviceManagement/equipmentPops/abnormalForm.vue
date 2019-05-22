<template>
  <div>
    <el-table :data="queryFail" border style="width: 100%" size="small">
      <el-table-column
        prop="factoryName"
        v-if="level === levelMap.PLATFORM"
        label="设备厂商"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column prop="brandName" label="设备型号" width="120" align="center"></el-table-column>
      <el-table-column prop="devNo" label="设备编号" width="200" align="center"></el-table-column>
      <el-table-column
        prop="organName"
        label="机构"
        width="120"
        align="center"
        v-if="batchType === 2"
      ></el-table-column>
      <el-table-column prop="failReason" label="失败原因" align="center">
        <template slot-scope="scope">
          <p style="color:red">{{scope.row.failReason}}</p>
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
import { levelMap } from '../../../server/level.js'
export default {
  name: 'abnormal-form',
  mixins: [mixins.pageMixin],
  props: {
    batchNo: {
      type: String,
      default: () => 0
    },
    batchType: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      level: '',
      levelMap: levelMap,
      queryFail: []
    }
  },
  methods: {
    getUrl() {
      return 'batchFail/queryFail'
    },
    getPageParams() {
      return {
        batchNo: this.batchNo
      }
    },
    handleRows(rows) {
      this.queryFail = [].concat(rows)
    }
  },
  mounted() {
    this.loadData()
    this.level = localStorage.getItem('level')
  }
}
</script>
<style scoped>
</style>
