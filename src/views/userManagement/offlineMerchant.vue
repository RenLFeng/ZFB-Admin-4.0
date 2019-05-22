<template>
  <div>
    <div class="screenBatch">
      <p style="text-align:right">
        <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form :inline="true" :model="searchData" v-show="activeNames" label-width="100px">
        <el-form-item label="商户姓名">
          <el-input v-model="searchData.member" clearable placeholder="商户姓名"></el-input>
        </el-form-item>
        <el-form-item label="商户手机号">
          <el-input v-model="searchData.phone" clearable placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item label="合伙人姓名">
          <el-input v-model="searchData.partner" clearable placeholder="合伙人姓名"></el-input>
        </el-form-item>
        <el-form-item label="合伙人手机号">
          <el-input v-model="searchData.partnerHome" clearable placeholder="合伙人手机号"></el-input>
        </el-form-item>
        <el-form-item v-if="level ===levelMap.PLATFORM" label="省级机构名称">
          <el-input v-model="searchData.proOrganName" clearable placeholder="省级机构名称或编号"></el-input>
        </el-form-item>
        <el-form-item v-if="level <=levelMap.PROVINCIAL" label="一级机构名称">
          <el-input v-model="searchData.organName" clearable placeholder="一级机构名称或编号"></el-input>
        </el-form-item>
        <el-form-item v-if="level <=levelMap.ORGAN" label="二级机构名称">
          <el-input v-model="searchData.secOrganName" clearable placeholder="二级机构名称或编号"></el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-select v-model="searchData.model" clearable placeholder="设备型号">
            <el-option
              v-for="(item,index) in modelData"
              :key="index"
              :label="item.brandSubName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="searchData.devNo" clearable placeholder="设备编号"></el-input>
        </el-form-item>
        <el-form-item label="设备激活时间">
          <el-date-picker
            v-model="searchData.startedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="激活开始时间"
          ></el-date-picker>&nbsp;至
          <el-date-picker
            v-model="searchData.endStartedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="激活结束时间"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="search()">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
      <div class="allUser">
        <el-table :data="offlineMercantData" border style="width: 100%" size="small">
          <el-table-column
            v-for="(v,i) in MerchantTableList"
            :prop="v.prop"
            :label="v.title"
            :key="i"
          ></el-table-column>
          <el-table-column label="操作" v-if="canMerchantDetail">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="canMerchantDetail"
                size="small"
                @click="details(scope.row)"
              >详情</el-button>
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
    <details-pops
      :flag="particulars"
      v-if="particulars"
      :detailsData="detailsData"
      :isMerchant="isMerchant"
      @handleClose="handleClose"
    ></details-pops>
  </div>
</template>
<script>
import { queryPermission } from '@/util'
import { mixins } from '@/core'
import { post } from '../../store/requestFacade.js'
import detailsPops from './detailsComponent/detailsPops'
import { levelMap } from '../../server/level.js'
import { MerchantParseRoleList, MerchantTableListTitle } from './own/tableTitle.js'
import { filterUerLeveL } from '../../util'
export default {
  name: 'offline-merchant',
  mixins: [mixins.pageMixin],
  components: {
    detailsPops
  },
  props: {
    merchant: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pageSize: 10,
      particulars: false,
      MerchantTableList: [],
      offlineMercantData: [],
      levelMap: levelMap,
      detailsData: {},
      organId: '',
      searchData: {
        phone: '',
        member: '',
        proOrganName: '',
        organName: '',
        secOrganName: '',
        startedAt: '',
        endStartedAt: '',
        model: '',
        partner: '',
        partnerHome: '',
        devNo: ''
      },
      isMerchant: 0,
      level: '',
      modelData: ''
    }
  },
  watch: {
    'merchant.organId'(newVal, oldVal) {
      this.loadData()
    }
  },
  methods: {
    search() {
      this.merchant.organId = ''
      if (!this.activeNames) {
        this.activeNames = true
      } else {
        this.loadData(true)
      }
      this.btnText = this.activeNames ? '收起' : '展开'
      this.icon = this.activeNames ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
    reset() {
      this.merchant.organId = ''
      this.searchData.phone = ''
      this.searchData.member = ''
      this.searchData.proOrganName = ''
      this.searchData.organName = ''
      this.searchData.secOrganName = ''
      this.searchData.startedAt = ''
      this.searchData.endStartedAt = ''
      this.searchData.model = ''
      this.searchData.partner = ''
      this.searchData.partnerHome = ''
      this.searchData.devNo = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    getUrl() {
      if (!this.merchant.organId) {
        return 'userManagement/pageListJuniorMerchant'
      } else {
        return 'userManagement/pageListJuniorOneMerchant'
      }
    },
    getPageParams() {
      return {
        pageSize: this.pageSize,
        phone: this.searchData.phone,
        username: this.searchData.member,
        organId: this.merchant.organId,
        proOrganName: this.searchData.proOrganName,
        organName: this.searchData.organName,
        secOrganName: this.searchData.secOrganName,
        startedAt: this.searchData.startedAt,
        endStartedAt: this.searchData.endStartedAt,
        brandId: this.searchData.model,
        partner: this.searchData.partner,
        partnerHome: this.searchData.partnerHome,
        devNo: this.searchData.devNo
      }
    },
    handleRows(rows) {
      this.offlineMercantData = MerchantParseRoleList(rows)
    },
    details(row) {
      this.$emit('todetails', row)
    },
    disableState(row, column) {
      return row.disableState === 1 ? '正常' : '禁用'
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
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.loadData()
    this.getModel()
    this.MerchantTableList = filterUerLeveL(MerchantTableListTitle)
  },
  computed: {
    canMerchantDetail() {
      return queryPermission('merchantDetail')
    }
  }
}
</script>

<style lang="css" scoped>
</style>
