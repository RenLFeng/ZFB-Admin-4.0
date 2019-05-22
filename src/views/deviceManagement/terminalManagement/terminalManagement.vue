<template>
  <div>
    <div class="base-tit" style="padding:15px 0 ">
      <Breadcrumb item="设备管理,终端管理"></Breadcrumb>
    </div>
    <div class="searchBox">
      <p>
        <el-button @click="toggle" type="text" size="small" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form :inline="true" size="small" v-show="activeNames">
        <el-form-item label="设备编号">
          <el-input v-model="devNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-select v-model="model" clearable placeholder="设备型号">
            <el-option
              v-for="(item,index) in modelData"
              :key="index"
              :label="item.brandSubName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级机构">
          <el-input clearable placeholder="请输入名称或编号" v-model="twoOrganName"></el-input>
        </el-form-item>
        <el-form-item label="一级机构">
          <el-input clearable placeholder="请输入名称或编号" v-model="oneOrganName"></el-input>
        </el-form-item>
        <el-form-item label="省级机构">
          <el-input v-model="proOrganName" clearable placeholder="请输入名称或编号"></el-input>
        </el-form-item>
        <el-form-item label="商户姓名">
          <el-input v-model="userName" clearable></el-input>
        </el-form-item>
        <el-form-item label="商户手机号">
          <el-input v-model="userAccount" clearable></el-input>
        </el-form-item>
        <el-form-item label="合伙人姓名">
          <el-input clearable v-model="partnerName"></el-input>
        </el-form-item>
        <el-form-item label="合伙人手机号码">
          <el-input clearable v-model="partnerAccount"></el-input>
        </el-form-item>
        <el-form-item label="返现奖励">
          <el-select v-model="profitStatus" clearable>
            <el-option v-for="m in getProfitStatus" :key="m.value" :label="m.value" :value="m.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="运行状态">
          <el-select v-model="operateStatus">
            <el-option v-for="m in getOperateStatus" :key="m.value" :label="m.value" :value="m.id"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="设备状态">
          <el-select v-model="deviceStatus" clearable>
            <el-option v-for="m in getDeviceStatus" :label="m.value" :value="m.id" :key="m.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="激活时间">
          <el-form-item>
            <el-date-picker
              clearable
              v-model="startDate"
              type="date"
              placeholder="开始时间"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>至</el-form-item>
          <el-form-item>
            <el-date-picker
              clearable
              v-model="endDate"
              type="date"
              placeholder="结束时间"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </div>
    </div>
    <el-table :data="terminalData" border size="small" style="width:100%">
      <el-table-column v-for="(v, i) in table" :prop="v.tableProp" :label="v.tableLabel" :key="i"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope" v-if="scope.row.enabled === 2">
          <el-button type="text" @click="cancelBtn(scope.row.devNo)">取消故障</el-button>
          <el-button type="text" @click="scrapBtn(scope.row.devNo)">报废</el-button>
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
</template>
<script>
import { terminalColumn, parseTerm } from '../own/terminalManagement.js'
import { post } from '../../../store/requestFacade.js'
import { mixins } from '@/core'
import { getOperateStatus, getDeviceStatus, getProfitStatus } from '../own/status.js'
export default {
  mixins: [mixins.pageMixin],
  data() {
    return {
      pageSize: 10,
      table: [],
      devNo: '',
      model: '',
      twoOrganName: '',
      oneOrganName: '',
      proOrganName: '',
      userName: '',
      userAccount: '',
      partnerName: '',
      partnerAccount: '',
      profitStatus: '',
      getProfitStatus: getProfitStatus,
      modelData: [],
      operateStatus: '',
      deviceStatus: '',
      getOperateStatus: getOperateStatus,
      getDeviceStatus: getDeviceStatus,
      startDate: '',
      endDate: '',
      terminalData: [],
      show: false,
      currentNo: ''
    }
  },
  methods: {
    reset() {
      this.devNo = ''
      this.model = ''
      this.twoOrganName = ''
      this.oneOrganName = ''
      this.proOrganName = ''
      this.userName = ''
      this.userAccount = ''
      this.partnerName = ''
      this.partnerAccount = ''
      this.operateStatus = ''
      this.profitStatus = ''
      this.deviceStatus = ''
      this.startDate = ''
      this.endDate = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    // 获取设备型号
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
    cancelBtn(no) {
      this.currentNo = no
      this.$confirm('您确定取消该设备的故障状态吗？', '取消故障')
        .then(() => {
          this.cancel()
        })
        .catch(() => {})
    },
    async cancel() {
      try {
        const res = await post({
          url: 'device/manage/upd',
          data: {
            devNo: this.currentNo,
            enabled: 1
          }
        })
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.loadData()
      } catch (err) {
        console.log(err)
      }
    },
    scrapBtn(no) {
      this.currentNo = no
      this.$confirm('您确定要报废该设备吗？', '报废')
        .then(() => {
          this.scrap()
        })
        .catch(() => {})
    },
    async scrap() {
      try {
        const res = await post({
          url: 'device/manage/upd',
          data: {
            devNo: this.currentNo,
            enabled: 3
          }
        })
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.loadData()
      } catch (err) {
        console.log(err)
      }
    },
    goDetail() {
      this.show = true
      // 传数据给弹窗
    },
    closeDetail() {
      this.show = false
    },
    getUrl() {
      return 'device/manage/query'
    },
    getPageParams() {
      return {
        devNo: this.devNo,
        brandId: this.model,
        secOrganName: this.twoOrganName,
        oneOrganName: this.oneOrganName,
        proOrganName: this.proOrganName,
        partnerName: this.partnerName,
        partnerAccount: this.partnerAccount,
        userName: this.userName,
        userAccount: this.userAccount,
        profitStatus: this.profitStatus,
        activateStatus: this.deviceStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        pageSize: this.pageSize
      }
    },
    handleRows(rows) {
      this.terminalData = parseTerm([].concat(rows))
    }
  },
  mounted() {
    this.loadData()
    this.table = terminalColumn()
    this.getModel()
  }
}
</script>
