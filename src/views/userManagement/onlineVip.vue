<template>
  <div>
    <div class="screenBatch">
      <p style="text-align:right">
        <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form :inline="true" :model="searchData" v-show="activeNames" label-width="100px">
        <el-form-item
          v-for="a in searchConditionList.filter(v=>v.type =='input')"
          :key="a.searchValue"
          :label="a.label"
        >
          <el-input v-model="searchData[a.searchValue]" clearable :placeholder="a.placeholder"></el-input>
        </el-form-item>
        <el-form-item
          v-for="a in searchConditionList.filter(v=>v.type =='select')"
          :key="a.searchValue"
          :label="a.label"
        >
          <el-select v-model="searchData[a.searchValue]" clearable :placeholder="a.placeholder">
            <el-option
              v-for="item in a.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开通时间">
          <el-date-picker
            v-model="searchData.startedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开通开始时间"
          ></el-date-picker>&nbsp;至
          <el-date-picker
            v-model="searchData.endStartedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开通开始时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
      <div class="allUser">
        <el-table :data="onlineVipData" border style="width: 100%" size="small">
          <el-table-column
            v-for="v in vipTableHeadList"
            :key="v.prop"
            :label="v.label"
            :prop="v.prop"
          ></el-table-column>
          <el-table-column label="操作" v-if="canVipDetail">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="details(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="padding: 16px; background: white; overflow: hidden;">
          <div style="float: right;">
            <el-pagination
              background
              @size-change="handleSizeChange"
              :page-sizes="[10, 30, 50, 100]"
              @current-change="handleCurrentChange"
              :current-page="paging.currentPage"
              :page-size="paging.pageSize"
              layout="total, prev, pager, next, sizes"
              :total="paging.total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryPermission, filterUerLeveL } from '@/util'
import { mixins } from '@/core'
import { vipTableHead, searchCondition, initSearchCondition, ParseRoleList } from './own/vip'

export default {
  name: 'online-vip',
  mixins: [mixins.pageMixin],
  data() {
    return {
      pageSize: 10,
      vipTableHeadList: [],
      searchConditionList: [],
      onlineVipData: [],
      particulars: false,
      detailsData: {},
      searchData: {
        ...initSearchCondition
      }
    }
  },
  methods: {
    getUrl() {
      return 'userManagement/userOnlineVip'
    },
    getPageParams() {
      return {
        pageSize: this.pageSize,
        username: this.searchData.username,
        phone: this.searchData.phone,
        inviteOrganName: this.searchData.inviteOrganName,
        inviteAccount: this.searchData.inviteAccount,
        proOrganName: this.searchData.proOrganName,
        organName: this.searchData.organName,
        secOrganName: this.searchData.secOrganName,
        organStatus: this.searchData.organStatus,
        startedAt: this.searchData.startedAt,
        endStartedAt: this.searchData.endStartedAt
      }
    },
    handleRows(rows) {
      this.onlineVipData = ParseRoleList([].concat(rows))
    },
    reset() {
      this.searchData.username = ''
      this.searchData.phone = ''
      this.searchData.inviteOrganName = ''
      this.searchData.inviteAccount = ''
      this.searchData.proOrganName = ''
      this.searchData.organName = ''
      this.searchData.secOrganName = ''
      this.searchData.organStatus = ''
      this.searchData.startedAt = ''
      this.searchData.endStartedAt = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    details(row) {
      this.$emit('todetails', row)
    },
    handleClose() {
      this.particulars = false
    }
  },
  mounted() {
    this.loadData()
    this.vipTableHeadList = filterUerLeveL(vipTableHead)
    this.searchConditionList = filterUerLeveL(searchCondition)
  },
  computed: {
    canVipDetail() {
      return queryPermission('vipDetail')
    }
  }
}
</script>

<style lang="css" scoped>
</style>
