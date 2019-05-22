<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>平台管理</el-breadcrumb-item>
        <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="text" v-if="canBannerCreate" @click="newBanner">
        <span class="el-icon-plus"></span>添加
      </el-button>
    </div>
    <el-table :data="bannerSet" border>
      <!-- <el-table-column prop="sort" label="序号"></el-table-column> -->
      <el-table-column prop="imgUrl" label="轮播图">
        <template slot-scope="scope">
          <img style="width:200px;height:100px" :src="scope.row.imgUrl" alt>
        </template>
      </el-table-column>
      <el-table-column
        v-for="v in table"
        :key="v.tableProp"
        :prop="v.tableProp"
        :label="v.tableLabel"
      ></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" v-if="canBannerEdit" @click="editBan(scope.row)">编辑</el-button>
          <el-button
            type="text"
            style="color:red"
            v-if="canBannerDelete"
            @click="delBanBtn(scope.row.adId)"
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
        ></el-pagination>
      </div>
    </div>
    <add-banner v-if="banVisible" :perBan="perBan" @bannerHide="bannerHide" @addBan="addBan"></add-banner>
  </div>
</template>

<script>
import { bannerBaseColumn, parseBanner } from './own/banner.js'
import { queryPermission } from '@/util'
import addBanner from './addBanner'
import { mixins } from '@/core'
import { post } from '../../store/requestFacade.js'
export default {
  name: 'banner',
  mixins: [mixins.pageMixin],
  components: {
    addBanner
  },
  data() {
    return {
      table: [],
      banVisible: false,
      bannerSet: [],
      perBan: null,
      adId: '',
      visiblity: {
        show: 1,
        hide: 0
      }
    }
  },
  computed: {
    canBannerCreate() {
      return queryPermission('bannerCreate')
    },
    canBannerEdit() {
      return queryPermission('bannerEdit')
    },
    canBannerDelete() {
      return queryPermission('bannerDelete')
    }
  },
  methods: {
    // 是否显示转化
    isSshow(row) {
      return row.enable === this.visiblity.show ? '显示' : '不显示'
    },
    newBanner() {
      this.banVisible = true
      this.perBan = null
    },
    editBan(row) {
      console.log(row)
      this.banVisible = true
      this.perBan = row
    },
    bannerHide() {
      this.banVisible = false
    },
    addBan() {
      this.banVisible = false
      this.loadData()
    },
    // 删除轮播图
    async delBan() {
      try {
        const res = await post({
          url: 'adInfo/adInfoDel',
          data: {
            adId: this.adId
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
    delBanBtn(id) {
      this.adId = id
      this.$confirm('是否确定删除该轮播图', '删除').then(() => {
        this.delBan()
      })
    },
    // 轮播图列表
    getUrl() {
      return 'adInfo/adInfo'
    },
    getPageParams() {
      return {}
    },
    handleRows(rows) {
      this.bannerSet = parseBanner([].concat(rows))
    }
  },
  mounted() {
    this.loadData()
    this.table = bannerBaseColumn()
  }
}
</script>

<style lang="css" scoped>
</style>
