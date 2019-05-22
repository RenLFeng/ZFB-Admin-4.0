<template>
  <div>
    <el-table :data="querySuccessBatch" border style="width: 100%" size="small">
      <el-table-column
        prop="factoryName"
        v-if="level === levelMap.PLATFORM"
        label="设备厂商"
        align="center"
      ></el-table-column>
      <el-table-column prop="brandName" label="设备型号" align="center"></el-table-column>
      <el-table-column prop="devNo" label="设备编号" align="center"></el-table-column>
      <el-table-column
        prop="organName"
        :label="batchType===4?'设备来源':'机构'"
        align="center"
        v-if="batchType !== 1"
      ></el-table-column>
      <el-table-column
        prop="profitStatusText"
        label="返现奖励"
        align="center"
        v-if="batchType === 4&&level !== levelMap.PLATFORM"
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
import { mixins } from '@/core'
import { levelMap } from '../../../server/level.js'
const profitStatusMap = {
  0: '不返现',
  1: '返现'
}
export default {
  name: 'normal-form',
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
      querySuccessBatch: []
    }
  },
  methods: {
    getUrl() {
      if (this.batchType === 4 || this.batchType === 5) {
        return 'successBatch/transferQuery'
      } else {
        return 'successBatch/batchList'
      }
    },
    getPageParams() {
      return {
        batchNo: this.batchNo
      }
    },
    handleRows(rows) {
      this.querySuccessBatch = rows.map((item, index) => {
        return Object.assign(
          {},
          item,
          { serialNum: index + 1 },
          { profitStatusText: profitStatusMap[item.profitStatusOld] }
        )
      })
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
