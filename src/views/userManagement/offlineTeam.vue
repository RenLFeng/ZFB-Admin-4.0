<template>
  <div>
    <div class="screenBatch">
      <p style="text-align:right">
        <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form :inline="true" :model="searchData" v-show="activeNames" label-width="100px">
        <el-form-item label="合伙人姓名">
          <el-input v-model="searchData.member" clearable placeholder="合伙人姓名"></el-input>
        </el-form-item>
        <el-form-item label="合伙人手机号">
          <el-input v-model="searchData.phone" clearable placeholder="合伙人手机号码"></el-input>
        </el-form-item>
        <el-form-item v-if="level === levelMap.PLATFORM" label="分公司">
          <el-input v-model="searchData.proOrganName" clearable placeholder="分公司名称或编号"></el-input>
        </el-form-item>
        <el-form-item v-if="level <=levelMap.PROVINCIAL" label="子公司">
          <el-input v-model="searchData.organName" clearable placeholder="子公司名称或编号"></el-input>
        </el-form-item>
        <el-form-item v-if="level <=levelMap.ORGAN" label="高级合伙人">
          <el-input v-model="searchData.secOrganName" clearable placeholder="高级合伙人名称或编号"></el-input>
        </el-form-item>
        <el-form-item label="授权时间">
          <el-date-picker
            v-model="searchData.startedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="授权开始时间"
          ></el-date-picker>&nbsp;至
          <el-date-picker
            v-model="searchData.endStartedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="授权结束时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="reset">重置</el-button>
      <p class="total">
        <span>合伙人总数：{{partnerCount}}个</span>
        <span style="margin-left:15px;">商户总数：{{merchantCount}}个</span>
      </p>
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        style="margin-bottom:10px"
        v-if="getOrganId"
      >
        <el-breadcrumb-item v-for="(v,i) in itemList" :key="v.name">
          <a @click="goBackUpParnter(v.organId,i)">{{v.name}}</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="allUser">
      <el-table :data="offlineTeamData" border style="width: 100%" size="small">
        <el-table-column v-for="(v,i) in teamTableList" :prop="v.prop" :label="v.title" :key="i"></el-table-column>
        <el-table-column
          label="操作"
          width="180"
          v-if="canOfflineTeamDetail||canOfflineTeamSubTeam||canOfflineTeamMerchant"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="canOfflineTeamDetail"
              size="small"
              @click="details(scope.row)"
            >详情</el-button>
            <el-button
              type="text"
              v-if="canOfflineTeamSubTeam"
              size="small"
              @click="getJuniorPartner(scope.row)"
            >下级合伙人</el-button>
            <el-button
              type="text"
              v-if="canOfflineTeamMerchant"
              size="small"
              @click="getJuniorMerchant(scope.row.organId)"
            >下级商户</el-button>
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
    <details-pops
      :flag="particulars"
      v-if="particulars"
      :isPartner="isPartner"
      :detailsData="this.detailsData"
      @handleClose="handleClose"
    ></details-pops>
  </div>
</template>
<script>
import { queryPermission } from '@/util'
import { mixins } from '@/core'
import detailsPops from './detailsComponent/detailsPops'
import { levelMap } from '../../server/level.js'
import { teamParseRoleList, teamTableListTitle } from './own/tableTitle.js'
import { filterUerLeveL } from '../../util'
export default {
  name: 'offline-team',
  mixins: [mixins.pageMixin],
  components: {
    detailsPops
  },
  props: {
    organId: {
      type: String,
      default: null
    }
  },
  watch: {
    async organId(newVal, oldVal) {
      this.getOrganId = newVal
      this.searchData = {}
      this.loadData(true)
    }
  },
  data() {
    return {
      level: '',
      pageSize: 10,
      teamTableList: [],
      levelMap: levelMap,
      merchantCount: 0,
      partnerCount: 0,
      offlineTeamData: [],
      particulars: false,
      detailsData: {},
      isPartner: 0,
      merchant: {
        toggle: 2,
        organId: ''
      },
      getOrganId: '',
      searchData: {
        phone: '',
        member: '',
        proOrganName: '',
        organName: '',
        secOrganName: '',
        startedAt: '',
        endStartedAt: ''
      },
      itemList: [
        {
          name: '所有合伙人',
          getOrganId: ''
        }
      ]
    }
  },
  methods: {
    search() {
      this.getOrganId = ''
      if (!this.activeNames) {
        this.activeNames = true
      } else {
        this.loadData(true)
      }
      this.btnText = this.activeNames ? '收起' : '展开'
      this.icon = this.activeNames ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
    getUrl() {
      if (!this.getOrganId) {
        return 'userManagement/pageListPartner'
      } else {
        return 'userManagement/pageListJuniorPartner'
      }
    },
    getPageParams() {
      return {
        pageSize: this.pageSize,
        phone: this.searchData.phone,
        username: this.searchData.member,
        organId: this.getOrganId,
        proOrganName: this.searchData.proOrganName,
        organName: this.searchData.organName,
        secOrganName: this.searchData.secOrganName,
        startedAt: this.searchData.startedAt,
        endStartedAt: this.searchData.endStartedAt
      }
    },
    handleRows(rows) {
      this.offlineTeamData = teamParseRoleList(rows)
      this.merchantCount = this.getExtra('merchantCount')
      this.partnerCount = this.getExtra('partnerCount')
    },
    reset() {
      this.getOrganId = ''
      this.searchData.phone = ''
      this.searchData.member = ''
      this.searchData.proOrganName = ''
      this.searchData.organName = ''
      this.searchData.secOrganName = ''
      this.searchData.startedAt = ''
      this.searchData.endStartedA = ''
      this.paging.currentPage = 1
      this.loadData(true)
      this.itemList = [
        {
          name: '所有合伙人',
          getOrganId: ''
        }
      ]
    },
    details(row) {
      this.$emit('todetails', row)
    },
    // 下级合伙人
    getJuniorPartner(row) {
      // console.log(row)
      this.type = 2
      this.getOrganId = row.organId
      const itemList = {
        name: row.username,
        organId: row.organId
      }
      this.itemList.push(itemList)
      this.loadData(true)
    },
    goBackUpParnter(organId, index) {
      this.getOrganId = organId
      this.itemList = this.itemList.slice(0, index + 1)
      this.loadData(true)
    },
    // 下级商户
    getJuniorMerchant(organId) {
      this.merchant.organId = organId
      this.$emit('toMerchant', this.merchant)
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.loadData()
    this.teamTableList = filterUerLeveL(teamTableListTitle)
  },
  computed: {
    canOfflineTeamDetail() {
      return queryPermission('offlineTeamDetail')
    },
    canOfflineTeamSubTeam() {
      return queryPermission('offlineTeamSubTeam')
    },
    canOfflineTeamMerchant() {
      return queryPermission('offlineTeamMerchant')
    }
  }
}
</script>

<style lang="css" scoped>
.total {
  font-size: 14px;
  color: #606266;
  text-align: right;
}
</style>
