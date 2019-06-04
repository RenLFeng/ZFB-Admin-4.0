<template>
  <div class="devAutList">
    <div class="deviceHead">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="screenBatch">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="searchData.model" clearable placeholder="请选择型号">
            <el-option
              v-for="(item,index) in modelData"
              :key="index"
              :label="item.brandSubName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchData.devNo" clearable placeholder="设备编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchData.batchNO" clearable placeholder="库存记录"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="inventoryData">
      <el-table :data="inventoryData" border style="width: 100%" size="small">
        <el-table-column
          v-for="v in tableHeader"
          :key="v.value"
          :prop="v.value"
          :label="v.label"
          :width="v.width"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          v-if="canAbnormalInventoryLotDetail"
          width="160"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-if="Number(level) === 1&scope.row.batchType === 4"
              @click="transferReCall(scope.row)"
            >撤回</el-button>
            <el-button
              type="text"
              size="small"
              v-if="scope.row.batchStatus !== 0"
              @click="showEquipment(scope.row)"
            >设备列表</el-button>
            <el-button
              v-if="Number(level) === 1&scope.row.batchType===2"
              type="text"
              size="small"
              @click="toggleProfitStatus(scope.row)"
            >{{ scope.row.profitStatus ? "不参与返现" : "参与返现" }}</el-button>
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
    <!-- 设备列表 -->
    <equipment-list
      :equipmentData="this.equipmentData"
      v-if="addOrderVisible"
      :flag="addOrderVisible"
      @modalClose="modalClose"
    ></equipment-list>
  </div>
</template>

<script>
import { queryPermission } from '@/util'
import { post } from '../../store/requestFacade.js'
import { mixins } from '@/core'
import equipmentList from './equipmentPops/equipmentList'
import { levelMap } from '../../server/level.js'
import { inventoryTable, HandleInventoryList } from './tableTitle'
import { filterUerLeveL } from '../../util'
export default {
  name: 'inventory-lot',
  mixins: [mixins.pageMixin],
  components: {
    equipmentList
  },
  data() {
    return {
      level: '',
      visible: false,
      levelMap: levelMap,
      modelData: [],
      inventoryData: [],
      addOrderVisible: false,
      searchData: {
        model: '',
        deviceModel: '',
        inventoryBatch: ''
      },
      equipmentData: {},
      tableHeader: filterUerLeveL(inventoryTable)
    }
  },
  methods: {
    handleSearch() {
      this.paging.currentPage = 1
      this.loadData(true)
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
    },
    // 获取表格数据
    getUrl() {
      return 'posBatch/queryPosBatch'
    },
    getPageParams() {
      return {
        brandId: this.searchData.model,
        devNo: this.searchData.devNo,
        batchNO: this.searchData.batchNO
      }
    },
    handleRows(rows) {
      const rawList = [].concat(rows)
      this.inventoryData = HandleInventoryList(rawList)
    },
    showEquipment(row) {
      this.addOrderVisible = true
      this.equipmentData = row
    },
    modalClose() {
      this.addOrderVisible = false
    },
    // 切换是否「参与分润」状态
    async toggleProfitStatus(item) {
      console.log(item)
      const body = {
        patchNo: item.batchNo,
        profitStatus: Number(item.profitStatus) === 0 ? 1 : 0
      }
      const profitStatusMap = {
        0: '参与返现？',
        1: '不参与返现？'
      }
      try {
        await this.$confirm(
          `是否确定【${item.organName}】的【${item.batchNo}】批次${
            profitStatusMap[item.profitStatus]
          }`
        )
        const res = await post({
          url: '/posBatch/updateProfitStatus',
          data: body
        })
        if (res.msg === '成功') {
          this.$message.success('修改成功')
          this.loadData()
        }
      } catch (err) {
        // console.log(err)
      }
    },
    // 撤回
    async transferReCall(item) {
      try {
        await this.$confirm('您确定撤回该批设备吗?', '撤回', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        this.recall(item)
      } catch (error) {}
    },
    async recall(item) {
      try {
        const res = await post({
          url: 'transfer/transferReCall',
          data: {
            batchNo: item.batchNo
          }
        })
        this.$message.success(res.data)
        this.loadData(true)
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.getModel()
    this.loadData()
    this.level = localStorage.getItem('level')
  },
  computed: {
    canCancelInventoryIn() {
      return queryPermission('cancelInventoryIn')
    },
    canApplyInventoryIn() {
      return queryPermission('applyInventoryIn')
    },
    canAbnormalInventoryLotDetail() {
      return queryPermission('abnormalInventoryLotDetail')
    }
  }
}
</script>

<style scoped>
.deviceHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}
</style>
