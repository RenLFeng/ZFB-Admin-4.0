<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="screenBatch">
      <p>
        <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form
        :inline="true"
        size="small"
        :model="searchData"
        class="demo-for m-inline"
        v-show="activeNames"
      >
        <el-form-item label="机构">
          <el-input
            v-if="level !== levelMap.SECONDORGAN"
            clearable
            v-model="searchData.organName"
            placeholder="机构"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input clearable v-model="searchData.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="合伙人姓名">
          <el-input clearable v-model="searchData.userName" placeholder="合伙人姓名"></el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-select clearable v-model="searchData.brandId" placeholder="选择设备型号">
            <el-option
              v-for="item in devModelData"
              :key="item.brandId"
              :label="item.brandSubName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="订单状态">
          <el-select clearable v-model="searchData.posStatus" placeholder="选择订单状态">
            <el-option label="未发货" value="1"></el-option>
            <el-option label="已发货" value="2"></el-option>
            <el-option label="订单完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="searchData.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
          ></el-date-picker>至
          <el-date-picker
            v-model="searchData.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="发货类型">
          <el-select clearable v-model="searchData.type" placeholder="选择发货类型">
            <el-option label="全部" value="1"></el-option>
            <el-option label="机构直营" value="2"></el-option>
            <el-option label="机构代发" value="3"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </div>
    </div>
    <el-table :data="deviceOrderData" border size="small" style="width: 100%">
      <el-table-column
        v-for="(v,i) in TableList"
        :prop="v.prop"
        :label="v.title"
        :width="v.width"
        :key="i"
      ></el-table-column>
      <el-table-column label="操作" width="110">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="canDeviceOrderDetail"
            @click="showDetails(scope.row)"
          >查看详情</el-button>
          <el-button
            type="text"
            v-if="candeliver(scope.row)"
            size="small"
            @click="shipments(scope.row)"
          >发货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 16px; background: white; overflow: hidden;">
      <div style="float: right;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paging.currentPage"
          :page-size="paging.pageSize"
          layout="total, prev, pager, next, sizes"
          :total="paging.total"
        ></el-pagination>
      </div>
    </div>
    <deliver-goods
      v-if="showShipments"
      :shipmentsData="shipmentsData"
      :toshow="showShipments"
      @invoking="invoking"
      @theShow="theShow"
    ></deliver-goods>
  </div>
</template>
<script>
import { queryPermission } from '@/util'
import { mixins } from '@/core'
import { post } from '../../../store/requestFacade.js'
import deliverGoods from './deliverGoods'
import { levelMap } from '../../../server/level.js'
import { ParseRoleList, TableTitle } from './table.js'
import { filterUerLeveL } from '../../../util'
export default {
  name: 'device-order-ment',
  mixins: [mixins.pageMixin],
  components: {
    deliverGoods
  },
  data() {
    return {
      pageSize: 10,
      levelMap: levelMap,
      TableList: [],
      level: '',
      searchData: {
        byTypeStatus: '',
        posStatus: '',
        organName: '',
        orderNo: '',
        userName: '',
        brandId: '',
        startDate: '',
        endDate: '',
        type:'1'
      },
      devModelData: [],
      showShipments: false,
      deviceOrderData: [],
      passedData: {
        showModule: 2,
        orderDerails: {}
      },
      shipmentsData: {},
      pickerOptions: ''
    }
  },
  methods: {
    reset() {
      this.searchData.organName = ''
      this.searchData.orderNo = ''
      this.searchData.userName = ''
      this.searchData.brandId = ''
      this.searchData.posStatus = ''
      this.searchData.startDate = ''
      this.searchData.endDate = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    candeliver(item) {
      if (this.level === levelMap.ORGAN) {
        if (item.deliverOrganLevel !== 9) {
          if (this.candeviceOrderShipment) {
            if (Number(item.deliverStatus) === 0) {
              return true
            }
          }
        }
      }

      if (this.level === levelMap.SECONDORGAN) {
        if (this.candeviceOrderShipment) {
          if (Number(item.deliverStatus) === 0) {
            return true
          }
        }
      }

      return false
    },
    // 获取表格数据
    getUrl() {
      return 'orderPos/posQuery'
    },
    getPageParams() {
      return {
        byTypeStatus: this.searchData.byTypeStatus,
        posStatus: this.searchData.posStatus,
        organName: this.searchData.organName,
        orderNo: this.searchData.orderNo,
        userName: this.searchData.userName,
        brandId: this.searchData.brandId,
        startDate: this.searchData.startDate,
        endDate: this.searchData.endDate,
        pageSize: this.pageSize
      }
    },
    handleRows(rows) {
      this.deviceOrderData = ParseRoleList(rows)
    },
    // 获取设备型号
    async getdevModel() {
      try {
        const res = await post({
          url: 'posBrand/queryBrand'
        })
        this.devModelData = res.data.rows
      } catch (err) {
        console.log(err)
      }
    },
    // 点击查看详情
    showDetails(row) {
      this.passedData.orderDerails = row
      this.$emit('seeDetails', this.passedData)
    },
    // 点击发货
    shipments(row) {
      this.showShipments = true
      this.shipmentsData = row
    },
    theShow() {
      this.showShipments = false
    },
    invoking() {
      this.showShipments = false
      this.loadData()
    }
  },
  mounted() {
    this.getdevModel()
    this.loadData()
    this.level = localStorage.getItem('level')
    this.TableList = filterUerLeveL(TableTitle)
  },
  computed: {
    // 设备订单详情
    canDeviceOrderDetail() {
      return queryPermission('deviceOrderDetail')
    },
    // 设备订单发货
    candeviceOrderShipment() {
      return queryPermission('deviceOrderShipment')
    }
  }
}
</script>
<style scoped>
.base-tit {
  margin: 15px 0;
}
</style>
