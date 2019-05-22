<template>
  <div>
    <div v-if="!hidden">
      <div class="base-tit">
        <Breadcrumb item="设备管理,设备换机"></Breadcrumb>
        <div class="head-right">
          <el-button type="text" @click="apply">申请换机</el-button>
        </div>
      </div>
      <div class="searchBox">
        <p>
          <el-button @click="toggle" type="text" size="small" :icon="icon">{{btnText}}</el-button>
        </p>
        <el-form :inline="true" size="small" v-show="activeNames">
          <el-form-item label="用户姓名">
            <el-input clearable v-model="userName"></el-input>
          </el-form-item>
          <el-form-item label="用户手机号">
            <el-input clearable v-model="userAccount"></el-input>
          </el-form-item>
          <el-form-item label="合伙人姓名">
            <el-input clearable v-model="partnerName"></el-input>
          </el-form-item>
          <el-form-item label="合伙人手机号">
            <el-input clearable v-model="partnerAccount"></el-input>
          </el-form-item>
          <el-form-item label="二级机构">
            <el-input clearable placeholder="请输入名称或编号" v-model="twoOrganName"></el-input>
          </el-form-item>
          <el-form-item label="一级机构">
            <el-input clearable placeholder="请输入名称或编号" v-model="oneOrganName"></el-input>
          </el-form-item>
          <el-form-item label="原设备编号">
            <el-input clearable v-model="devNo"></el-input>
          </el-form-item>
          <el-form-item label="新设备编号">
            <el-input clearable v-model="newDevNo"></el-input>
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
          <el-form-item label="原设备激活状态">
            <el-select clearable v-model="activateStatus">
              <el-option
                v-for="(item, i) in getActivateStatus"
                :label="item.value"
                :value="item.id"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select clearable placeholder="审核状态" v-model="auditStatus">
              <el-option
                v-for="(item, i) in getAuditStatus"
                :label="item.value"
                :value="item.id"
                :key="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-form-item>
              <el-date-picker
                v-model="startDate"
                type="date"
                placeholder="开始时间"
                clearable
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>至</el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="endDate"
                type="date"
                placeholder="结束时间"
                clearable
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
      <el-table :data="changeInfo" border size="small" style="width:100%">
        <el-table-column
          v-for="(v, i) in table.slice(0,9)"
          :prop="v.tableProp"
          :label="v.tableLabel"
          :key="i"
        ></el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <span v-show="scope.row.auditStatus === 1" style="color:#67C23A">审核通过</span>
            <span v-show="scope.row.auditStatus === 2" style="color:#F56C6C">审核不通过</span>
            <span v-show="scope.row.auditStatus === 0">待审核</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="v in table.slice(9)"
          :prop="v.tableProp"
          :label="v.tableLabel"
          :key="v.tableLabel"
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope" v-if="scope.row.auditStatus === 0">
            <el-button type="text" @click="passBtn(scope.row.id)">通过</el-button>
            <el-button type="text" style="color:red" @click="failBtn(scope.row.id)">不通过</el-button>
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
      <el-dialog title="审核" :visible.sync="isFail" width="30%" :before-close="handleClose">
        <el-form label-position="top">
          <el-form-item label="审核意见">
            <el-input :rows="3" v-model="remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isFail = false">取 消</el-button>
          <el-button type="primary" @click="sureFail">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <apply-change v-if="hidden" @goback="goback" @fresh="fresh"></apply-change>
  </div>
</template>
<script>
import { equipmentChangeColumn, parseEquipmentChange } from '../own/equipmentChange.js'
import { getAuditStatus, getActivateStatus } from '../own/status.js'
import applyChange from './applyChange'
import { post } from '../../../store/requestFacade.js'
import { mixins } from '@/core'
export default {
  mixins: [mixins.pageMixin],
  components: {
    applyChange
  },
  data() {
    return {
      pageSize: 10,
      hidden: false,
      changeInfo: [],
      table: [],
      userName: '',
      userAccount: '',
      partnerName: '',
      partnerAccount: '',
      twoOrganName: '',
      oneOrganName: '',
      devNo: '',
      model: '',
      activateStatus: '',
      auditStatus: '',
      endDate: '',
      startDate: '',
      modelData: [],
      getActivateStatus: getActivateStatus,
      getAuditStatus: getAuditStatus,
      newDevNo: '',
      isFail: false,
      remark: '',
      passId: '',
      failId: ''
    }
  },
  methods: {
    reset() {
      this.userName = ''
      this.userAccount = ''
      this.partnerName = ''
      this.partnerAccount = ''
      this.twoOrganName = ''
      this.oneOrganName = ''
      this.devNo = ''
      this.newDevNo = ''
      this.model = ''
      this.activateStatus = ''
      this.auditStatus = ''
      this.startDate = ''
      this.endDate = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    // 型号
    getUrl() {
      return 'device/oper/query'
    },
    getPageParams() {
      return {
        operType: 2,
        userName: this.userName,
        userAccount: this.userAccount,
        partnerName: this.partnerName,
        partnerAccount: this.partnerAccount,
        secOrganName: this.twoOrganName,
        oneOrganName: this.oneOrganName,
        devNo: this.devNo,
        newDevNo: this.newDevNo,
        devBrand: this.model,
        activateStatus: this.activateStatus,
        auditStatus: this.auditStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        pageSize: this.pageSize
      }
    },
    handleRows(rows) {
      this.changeInfo = parseEquipmentChange([].concat(rows))
    },
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
    passBtn(id) {
      this.passId = id
      this.$confirm('您确定同意换机申请吗？', '通过审核')
        .then(() => {
          this.pass()
        })
        .catch(() => {})
    },
    async pass() {
      try {
        const res = await post({
          url: '/device/oper/upd',
          data: {
            auditStatus: 1,
            id: this.passId,
            auditMsg: ''
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
    failBtn(id) {
      this.isFail = true
      this.failId = id
    },
    async sureFail() {
      if (this.remark === '') {
        this.$message({
          type: 'warning',
          message: '请输入审核意见'
        })
      } else {
        try {
          const res = await post({
            url: '/device/oper/upd',
            data: {
              auditStatus: 2,
              id: this.failId,
              auditMsg: this.remark
            }
          })
          this.isFail = false
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.loadData()
        } catch (err) {
          console.log(err)
        }
      }
    },
    handleClose() {
      this.isFail = false
    },
    goback() {
      this.hidden = false
    },
    fresh() {
      this.hidden = false
      this.loadData()
    },
    apply() {
      this.hidden = true
    }
  },
  mounted() {
    this.loadData()
    this.getModel()
    this.table = equipmentChangeColumn()
  }
}
</script>