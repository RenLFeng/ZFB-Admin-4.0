<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item="会员管理,活动商户"></Breadcrumb>
    </div>
    <p style="text-align:right">
      <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
    </p>
    <el-form :inline="true" :model="searchData" label-width="100px" v-show="activeNames">
      <el-form-item v-for="a in searchConditionList" :key="a.label" :label="a.label">
        <el-input v-model="searchData[a.searchValue]" clearable :placeholder="a.placeholder"></el-input>
      </el-form-item>
      <el-form-item label="活动规则">
        <el-select clearable placeholder="活动规则" v-model="searchData.ruleId">
          <el-option :label="v.ruleName" :value="v.ruleId" v-for="v in ruleAllData" :key="v.ruleId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易状态">
        <el-select clearable placeholder="交易状态" v-model="searchData.status">
          <el-option label="未还款" value="1"></el-option>
          <el-option label="还款中" value="2"></el-option>
          <el-option label="完成" value="3"></el-option>
          <el-option label="失效" value="4"></el-option>
          <!-- <el-option label="已取消" value="4"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="设备状态">
        <el-select clearable placeholder="设备状态" v-model="searchData.posStatus">
          <el-option label="已激活" value="1"></el-option>
          <el-option label="未激活" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          type="date"
          placeholder="开始时间(开始)"
          clearable
          value-format="yyyy-MM-dd"
          v-model="searchData.startedAt"
        ></el-date-picker>&nbsp;至
        <el-date-picker
          type="date"
          placeholder="开始时间(结束)"
          clearable
          value-format="yyyy-MM-dd"
          v-model="searchData.shouldEndAt"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          type="date"
          placeholder="结束时间(开始)"
          clearable
          value-format="yyyy-MM-dd"
          v-model="searchData.endStartedAt"
        ></el-date-picker>&nbsp;至
        <el-date-picker
          type="date"
          placeholder="结束时间(结束)"
          clearable
          value-format="yyyy-MM-dd"
          v-model="searchData.endShouldEndAt"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 10px">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>
    <el-table :data="UserData" border style="width: 100%" size="small">
      <el-table-column v-for="(v,i) in TableHeadList" :prop="v.prop" :label="v.label" :key="i"></el-table-column>
      <el-table-column label="操作" v-if="candepositUserDetail">
        <template slot-scope="scope">
          <el-button size="mini" plain @click="details(scope.row)">详情</el-button>
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
    <pledge-user-details v-if="detailsDialog" @handleClose="handleClose" :detailsData="detailsData"></pledge-user-details>
  </div>
</template>
<script>
import { filterUerLeveL, queryPermission } from '@/util'
import { mixins } from '@/core'
import { post } from '../../../store/requestFacade.js'
import { TableHead, searchCondition, ParseRoleList } from './map.js'
import pledgeUserDetails from './pledgeUserDetails'
export default {
  mixins: [mixins.pageMixin],
  data() {
    return {
      searchData: {
        depositName: '',
        depositPhone: '',
        secOrganName: '',
        oneOrganName: '',
        proOrganName: '',
        devNo: '',
        status: '',
        startedAt: '',
        shouldEndAt: '',
        endStartedAt: '',
        endShouldEndAt: '',
        posStatus: '',
        ruleId: '',
        partner: '',
        partnerPhone: ''
      },
      searchConditionList: [],
      TableHeadList: [],
      UserData: [],
      detailsDialog: false,
      detailsData: {},
      ruleAllData: []
    }
  },
  components: {
    pledgeUserDetails
  },
  methods: {
    getUrl() {
      return 'depositUser/depositUserAll'
    },
    getPageParams() {
      return {
        depositName: this.searchData.depositName,
        depositPhone: this.searchData.depositPhone,
        secOrganName: this.searchData.secOrganName,
        oneOrganName: this.searchData.oneOrganName,
        proOrganName: this.searchData.proOrganName,
        devNo: this.searchData.devNo,
        status: this.searchData.status,
        startedAt: this.searchData.startedAt,
        shouldEndAt: this.searchData.shouldEndAt,
        endStartedAt: this.searchData.endStartedAt,
        endShouldEndAt: this.searchData.endShouldEndAt,
        posStatus: this.searchData.posStatus,
        ruleId: this.searchData.ruleId,
        partner: this.searchData.partner,
        partnerPhone: this.searchData.partnerPhone
      }
    },
    resetSearch() {
      this.searchData.depositName = ''
      this.searchData.depositPhone = ''
      this.searchData.secOrganName = ''
      this.searchData.oneOrganName = ''
      this.searchData.proOrganName = ''
      this.searchData.devNo = ''
      this.searchData.status = ''
      this.searchData.startedAt = ''
      this.searchData.shouldEndAt = ''
      this.searchData.endStartedAt = ''
      this.searchData.endShouldEndAt = ''
      this.searchData.posStatus = ''
      this.searchData.ruleId = ''
      this.searchData.partner = ''
      this.searchData.partnerPhone = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    handleRows(rows) {
      this.UserData = ParseRoleList(rows)
    },
    // 获取规则
    async ruleAll() {
      try {
        const res = await post({
          url: 'depositUser/ruleAll'
        })
        this.ruleAllData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    details(row) {
      this.detailsDialog = true
      this.detailsData = row
    },
    handleClose() {
      this.detailsDialog = false
    }
  },
  mounted() {
    this.searchConditionList = filterUerLeveL(searchCondition)
    this.TableHeadList = filterUerLeveL(TableHead)
    this.loadData()
    this.ruleAll()
  },
  computed: {
    candepositUserDetail() {
      return queryPermission('depositUserDetail')
    }
  }
}
</script>
<style scoped>
.base-tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
}
</style>
