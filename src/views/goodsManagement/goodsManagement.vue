<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备商品</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="text" v-if="canPublishGoods" @click="releaseProduct">发布商品</el-button>
    </div>
    <div class="searchBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select clearable placeholder="设备型号" v-model="deviceModel">
            <el-option
              v-for="(item,index) in allModel"
              :key="index"
              :label="item.brandSubName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border :data="productListData" style="width: 100%">
      <el-table-column
        v-for="v in table"
        :prop="v.tableProp"
        :label="v.tableLable"
        :key="v.tableProp"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" v-if="canEditGoods && scope.row.packageStatus!=-1" @click="editProductBtn(scope.row)">编辑</el-button>
            <el-button disabled v-if="canEditGoods && scope.row.packageStatus==-1" @click="editProductBtn(scope.row)">已失效</el-button>
          <el-button
            type="text"
            v-if="scope.row.packageStatus === 0 && canPutAway"
            @click="shelfBtn(scope.row.packageId)"
          >上架</el-button>
          <el-button
            type="text"
            style="color:red"
            v-if="scope.row.packageStatus === 1 && canSoldOut"
            @click="soldOutBtn(scope.row.packageId)"
          >下架</el-button>
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
    <release-product
      v-if="releaseProductVisible"
      :product="editProductData"
      :allModel="allModel"
      @modifyEnd="modifyEnd"
      @productHide="productHide"
    ></release-product>
  </div>
</template>

<script>
import { goodsBaseColumn, parseGoodsList } from './own/calc.js'
import { queryPermission } from '@/util'
import { post } from '../../store/requestFacade.js'
import { mixins } from '@/core'
import releaseProduct from './releaseProduct'
export default {
  name: 'goods-management',
  components: {
    releaseProduct
  },
  mixins: [mixins.pageMixin],
  computed: {
    canPublishGoods() {
      return queryPermission('publishGoods')
    },
    canEditGoods() {
      return queryPermission('editGoods')
    },
    canPutAway() {
      return queryPermission('putAway')
    },
    canSoldOut() {
      return queryPermission('soldOut')
    }
  },
  data() {
    return {
      table: goodsBaseColumn,
      releaseProductVisible: false,
      imageUrl: '',
      productListData: [],
      allModel: [],
      deviceModel: '',
      brandId: '',
      factoryId: '',
      pageSize: '',
      pageNumber: '',
      editBigPic: '',
      editSmallpic: '',
      editProductData: null,
      packageId: '',
      edit: {
        big: '',
        small: ''
      }
    }
  },
  methods: {
    //   搜索
    search() {
      this.loadData(true)
    },
    releaseProduct() {
      this.editProductData = null
      this.releaseProductVisible = true
    },
    productHide() {
      this.releaseProductVisible = false
    },
    modifyEnd() {
      this.releaseProductVisible = false
      this.loadData()
    },
    //   获取设备型号
    async getDeviceModel() {
      try {
        const res = await post({
          url: 'posBrand/queryBrand'
        })
        this.allModel = res.data.rows
      } catch (err) {
        console.log(err)
      }
    },
    // 获取商品列表
    getUrl() {
      return 'devicePackage/queryDevicePackage'
    },
    getPageParams() {
      return {
        brandId: this.deviceModel
      }
    },
    handleRows(rows) {
      this.productListData = parseGoodsList([].concat(rows))
    },
    // 获取编辑商品的信息
    editProductBtn(product) {
      this.releaseProductVisible = true
      this.editProductData = product
    },
    // 下架
    soldOutBtn(id) {
      this.packageId = id
      this.$confirm('是否确定下架该商品', '下架')
        .then(() => {
          this.soldOut()
        })
        .catch(() => {})
    },
    async soldOut() {
      try {
        const res = await post({
          url: 'devicePackage/soldOut',
          data: {
            packageId: this.packageId
          }
        })
        this.loadData()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 上架
    shelfBtn(id) {
      this.packageId = id
      this.$confirm('是否确定上架该商品', '上架')
        .then(() => {
          this.shelf()
        })
        .catch(() => {})
    },
    async shelf(id) {
      try {
        const res = await post({
          url: 'devicePackage/soldUp',
          data: {
            packageId: this.packageId
          }
        })
        this.loadData()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.getDeviceModel()
    this.loadData()
  }
}
</script>
<style>
.el-table::before{
  display: none;
}
</style>
