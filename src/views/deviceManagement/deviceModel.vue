<template>
  <div class="devAutList">
    <div class="deviceHead">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备型号</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="deviceAll">
      <div class="manufacturer">
        <el-button
          type="text"
          @click="addFirmShow = true"
          style="width: 50%;text-align:right"
        ><i class="el-icon-lx-tianjia"></i> 新建厂商</el-button>
        <el-table
          size='small'
          :data="manufacturerData"
          border
          style="width: 50%"
        >
          <el-table-column
            v-for="v in vendorTable"
            :key="v.tableProp"
            :prop="v.tableProp"
            :label="v.tableLabel"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="canDeleteFactory"
                style="color:red"
                @click="delmanuData(scope.row.factoryId,scope.row.factoryName)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 型号 -->
      <div class="devModel">
        <el-button
          class="addmodel"
          @click="showAdd(1)"
          type="text"
        ><i class="el-icon-lx-tianjia"></i> 新建型号</el-button>
        <el-table
          size="small"
          :data="devModelData"
          border
          style="width: 100%"
        >
          <el-table-column
            v-for="v in devModelTable"
            :key="v.tableProp"
            :prop="v.tableProp"
            :label="v.tableLabel"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="canEditModel"
                @click="showEdit(scope.row.brandId,2)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                style="color:red"
                v-if="canDeleteModel"
                @click="delModelData(scope.row.brandId,scope.row.brandName)"
              >删除</el-button>
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
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <dev-model
      v-if="showDevModel"
      :manufacturerData="manufacturerData"
      :statusData='statusData'
      :toshow="showDevModel"
      @theShow="theShow"
      @invoking='invoking'
    ></dev-model>
    <add-firm
      v-if="addFirmShow"
      :toshow="addFirmShow"
      @invoking='invoking'
      @handleClose="handleClose"
    ></add-firm>
  </div>
</template>
<script>
import { vendorColumn, devModelColumn } from './own/deviceModel.js'
import { queryPermission } from '@/util'
import { post } from '../../store/requestFacade.js'
import { mixins } from '@/core'
import devModel from './equipmentPops/devModel'
import addFirm from './equipmentPops/addFirm'
export default {
  name: 'device-model',
  mixins: [mixins.pageMixin],
  components: {
    devModel,
    addFirm
  },
  data() {
    return {
      vendorTable: [],
      devModelTable: [],
      addmanufacturer: false,
      showDevModel: false,
      addFirmShow: false,
      manufacturerData: [],
      devModelData: [],
      addmanuData: {
        name: '',
        id: ''
      },
      statusData: {
        brandId: '',
        status: ''
      }
    }
  },
  methods: {
    // 获取厂商
    async getmanufacturer() {
      try {
        const res = await post({
          url: 'posFactory/queryFactory'
        })
        this.manufacturerData = res.data
      } catch (err) {
        console.log(err)
      }
    },
    // 获取型号
    getUrl() {
      return 'posBrand/queryBrand'
    },
    getPageParams() {
      return {}
    },
    handleRows(rows) {
      this.devModelData = [].concat(rows)
    },
    // 删除厂商
    async delmanuData(factoryId, factoryName) {
      this.$confirm('您确定删除厂商 - ' + factoryName, '删除厂商', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async() => {
          try {
            const res = await post({
              url: 'posFactory/deleteFactory',
              data: {
                factoryId: factoryId
              }
            })
            this.getmanufacturer()
            this.$message({ message: res.msg, type: 'success' })
          } catch (err) {
            console.log(err)
          }
        })
        .catch(() => {})
    },
    //
    // 添加商品
    showAdd(status) {
      this.showDevModel = true
      this.statusData.status = status
    },
    // 编辑商品
    showEdit(brandId, status) {
      this.showDevModel = true
      this.statusData.brandId = brandId
      this.statusData.status = status
    },
    // 删除设备
    async delModelData(brandId, brandName) {
      this.$confirm('您确定删除设备 - ' + brandName, '删除设备', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async() => {
          try {
            const res = await post({
              url: 'posBrand/deleteBrand',
              data: {
                brandId: brandId
              }
            })
            this.loadData()
            this.$message({ message: res.msg, type: 'success' })
          } catch (err) {
            console.log(err)
          }
        })
        .catch(() => {})
    },
    // 弹框
    theShow() {
      this.showDevModel = false
    },
    invoking() {
      this.showDevModel = false
      this.addFirmShow = false
      this.loadData()
      this.getmanufacturer()
    },
    handleClose() {
      this.addFirmShow = false
    }
  },
  mounted() {
    this.vendorTable = vendorColumn()
    this.devModelTable = devModelColumn()
    this.getmanufacturer()
    this.loadData()
  },
  computed: {
    canCreateFactory() {
      return queryPermission('createFactory')
    },
    canCreateModel() {
      return queryPermission('createModel')
    },
    canEditModel() {
      return queryPermission('editModel')
    },
    canDeleteModel() {
      return queryPermission('deleteModel')
    },
    canEditFactory() {
      return queryPermission('editFactory')
    },
    canDeleteFactory() {
      return queryPermission('deleteFactory')
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
.devModel {
  margin-top: 20px;
}
.addmodel {
  float: right;
}
</style>
