<template>
  <div class="screenBatch">
    <p style="text-align:right">
      <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
    </p>
    <el-form :inline="true" :model="searchData" label-width="100px" v-show="activeNames">
      <el-form-item label="用户姓名">
        <el-input v-model="searchData.username" clearable placeholder="用户姓名"></el-input>
      </el-form-item>
      <el-form-item label="用户手机号">
        <el-input v-model="searchData.phone" clearable placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item label="推荐人姓名">
        <el-input v-model="searchData.inviteOrganName" clearable placeholder="推荐人姓名"></el-input>
      </el-form-item>
      <el-form-item label="推荐人手机号">
        <el-input v-model="searchData.inviteAccount" clearable placeholder="推荐人手机号"></el-input>
      </el-form-item>
      <el-form-item v-if="level ===levelMap.PLATFORM" label="分公司">
        <el-input v-model="searchData.proOrganName" clearable placeholder="请输入名称或编号"></el-input>
      </el-form-item>
      <el-form-item v-if="level <=levelMap.PROVINCIAL" label="子公司">
        <el-input v-model="searchData.organName" clearable placeholder="请输入名称或编号"></el-input>
      </el-form-item>
      <el-form-item v-if="level <=levelMap.ORGAN" label="高级合伙人">
        <el-input v-model="searchData.secOrganName" clearable placeholder="请输入名称或编号"></el-input>
      </el-form-item>
      <el-form-item label="实名认证">
        <el-select v-model="searchData.realNameAuthStatus" clearable placeholder="实名认证">
          <el-option label="已认证" value="1"></el-option>
          <el-option label="未认证" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchData.organStatus" clearable placeholder="状态">
          <el-option label="正常" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 10px">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
    <div>
      <el-table :data="allUserData" border style="width: 100%" size="small">
        <el-table-column v-for="(v,i) in allUserTableList" :prop="v.prop" :label="v.title" :key="i"></el-table-column>
        <el-table-column label="操作" v-if="canUserDetail||canUserEnable||canUserDisable">
          <template slot-scope="scope">
            <el-button size="mini" v-if="canUserDetail" @click="details(scope.row)">详情</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="canUserDisable&scope.row.organStatus === 1"
              @click="disableState(scope.row)"
            >禁用</el-button>
            <el-button
              type="danger"
              v-if="canUserEnable"
              v-show="scope.row.organStatus=== 0"
              size="mini"
              @click="activation(scope.row)"
            >激活</el-button>
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
            :page-sizes="[10, 30, 50, 100]"
            layout="total, prev, pager, next, sizes"
            :total="paging.total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mixins } from '@/core'
import { queryPermission } from '@/util'
import { post } from '../../store/requestFacade.js'
import { levelMap } from '../../server/level.js'
import { filterUerLeveL } from '../../util'
import { ParseRoleList, allUserTableTitle } from './own/tableTitle.js'
export default {
  name: 'all-user',
  mixins: [mixins.pageMixin],

  data() {
    return {
      pageSize: 10,
      allUserTableList: [],
      level: '',
      levelMap: levelMap,
      allUserData: [],
      detailsData: {},
      searchData: {
        phone: '',
        username: '',
        realNameAuthStatus: '',
        proOrganName: '',
        organName: '',
        secOrganName: '',
        organStatus: '',
        inviteOrganName: '',
        inviteAccount: ''
      }
    }
  },
  methods: {
    // 渲染表格
    getUrl() {
      return 'userManagement/pageListAll'
    },
    getPageParams() {
      return {
        pageSize: this.pageSize,
        phone: this.searchData.phone,
        username: this.searchData.username,
        realNameAuthStatus: this.searchData.realNameAuthStatus,
        proOrganName: this.searchData.proOrganName,
        organName: this.searchData.organName,
        secOrganName: this.searchData.secOrganName,
        organStatus: this.searchData.organStatus,
        inviteOrganName: this.searchData.inviteOrganName,
        inviteAccount: this.searchData.inviteAccount
      }
    },
    handleRows(rows) {
      this.allUserData = ParseRoleList(rows)
    },
    organStatus(row, column) {
      const organStatusMap = {
        0: '禁用',
        1: '正常'
      }
      return organStatusMap[row.organStatus]
    },
    reset() {
      this.searchData.phone = ''
      this.searchData.username = ''
      this.searchData.realNameAuthStatus = ''
      this.searchData.proOrganName = ''
      this.searchData.organName = ''
      this.searchData.secOrganName = ''
      this.searchData.organStatus = ''
      this.searchData.inviteOrganName = ''
      this.searchData.inviteAccount = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    realNameAuthStatus(row, column) {
      return row.realNameAuthStatus === 1 ? '已认证' : '未认证'
    },
    details(row) {
      this.$emit('todetails', row)
    },
    // 点击禁用
    disableState(row) {
      this.$confirm('禁用账号后无法正常登录APP,您确定禁用该账号吗?', '账号禁用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.toDisableState(row)
        })
        .catch(() => {})
    },

    async toDisableState(row) {
      try {
        const res = await post({
          url: 'userManagement/disableState',
          data: {
            userAccount: row.phone
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        // console.log(res)
        this.loadData()
      } catch (err) {
        console.log(err)
      }
    },
    // 点击激活
    activation(row) {
      this.$confirm('激活账号后可以正常登录APP,您确定激活该账号吗?', '账号激活', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.toactivation(row)
        })
        .catch(() => {})
    },
    async toactivation(row) {
      try {
        const res = await post({
          url: 'userManagement/activation',
          data: {
            userAccount: row.phone
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        this.loadData()
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.allUserTableList = filterUerLeveL(allUserTableTitle)
    this.loadData()
  },
  computed: {
    canUserDetail() {
      return queryPermission('userDetail') // 详情
    },
    canUserDisable() {
      return queryPermission('userDisable') // 禁用会员
    },
    canUserEnable() {
      return queryPermission('userEnable') // 激活会员
    }
  }
}
</script>

<style lang="css" scoped>
</style>
