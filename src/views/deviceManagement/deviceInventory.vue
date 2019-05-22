<template>
  <div class="devAutList">
    <div class="deviceHead">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备库存</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="retrieval">
      <div class="deviceSeek">
        <p style="text-align:right">
          <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
        </p>
        <el-form :inline="true" :model="screenData" label-width="100px" v-show="activeNames">
          <el-form-item label="商户姓名">
            <el-input v-model="screenData.merchantName" placeholder="商户姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="合伙人姓名">
            <el-input v-model="screenData.partnerName" placeholder="合伙人姓名" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="level ===levelMap.PLATFORM" label="所属分公司">
            <el-input v-model="screenData.provinciaLevelName" placeholder="所属分公司名称" clearable></el-input>
          </el-form-item>
          <el-form-item v-if="level <=levelMap.PROVINCIAL" label="所属机构">
            <el-input v-model="screenData.orgName" placeholder="所属机构名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="设备编号">
            <el-input v-model="screenData.devNo" placeholder="设备编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="设备型号">
            <el-select clearable v-model="screenData.brandId" placeholder="选择设备型号">
              <el-option
                v-for="item in devModelData"
                :key="item.brandId"
                :label="item.brandSubName"
                :value="item.brandId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存状态">
            <el-select clearable v-model="screenData.status" placeholder="库存状态">
              <el-option label="未下发" value="0"></el-option>
              <el-option label="已下发" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="激活状态">
            <el-select clearable v-model="screenData.activateStatus" placeholder="激活状态">
              <el-option label="未激活" value="0"></el-option>
              <el-option label="已激活" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="返现奖励">
            <el-select clearable v-model="screenData.profitStatus" placeholder="返现奖励">
              <el-option label="不返现" value="0"></el-option>
              <el-option label="返现" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备编号">
            <el-input v-model="screenData.startDevNo" placeholder="开始设备编号" class="DevNo" clearable></el-input>&nbsp;至
            <el-input v-model="screenData.endDevNo" placeholder="结束设备编号" class="DevNo" clearable></el-input>
          </el-form-item>
          <el-form-item label="下发时间">
            <el-date-picker
              v-model="screenData.startDeliverTime"
              type="date"
              placeholder="下发时间(开始)"
              clearable
              class="DevNo"
              value-format="yyyy-MM-dd"
            ></el-date-picker>&nbsp;至
            <el-date-picker
              v-model="screenData.endDeliverTime"
              type="date"
              placeholder="下发时间(结束)"
              clearable
              class="DevNo"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <br>
          <el-form-item label="入库时间">
            <el-date-picker
              v-model="screenData.startStoreTime"
              type="date"
              placeholder="入库时间(开始)"
              clearable
              class="DevNo"
              value-format="yyyy-MM-dd"
            ></el-date-picker>&nbsp;至
            <el-date-picker
              v-model="screenData.endStoreTime"
              type="date"
              placeholder="入库时间(结束)"
              clearable
              class="DevNo"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="激活时间">
            <el-date-picker
              v-model="screenData.startActiveTime"
              type="date"
              placeholder="激活时间(开始)"
              clearable
              class="DevNo"
              value-format="yyyy-MM-dd"
            ></el-date-picker>&nbsp;至
            <el-date-picker
              v-model="screenData.endActiveTime"
              type="date"
              placeholder="激活时间(结束)"
              clearable
              class="DevNo"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item v-if="false">
            <el-select
              clearable
              v-model="screenData.onlineState"
              placeholder="设备在线状态"
              style="width: 130px"
            >
              <el-option label="在线" value="0"></el-option>
              <el-option label="离线" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 10px">
          <el-button type="primary" @click="toScreen">搜索</el-button>
          <el-button @click="resetSearchCondition">重置</el-button>
        </div>
      </div>
      <div>
        <div>
          <el-dropdown
            trigger="click"
            style="cursor:pointer;margin-right:10px"
            @command="handleCommand"
            v-if="level!== levelMap.SECONDORGAN"
          >
            <span class="el-dropdown-link" style="color: #409eff">
              <!-- <i class="el-icon-lx-navicon-rkd"></i> 设备入库 -->
              <el-button type="primary" icon="el-icon-lx-navicon-rkd" size="small">批量操作</el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="inventoryIn" v-if="canDeviceInventoryIn">批量入库</el-dropdown-item>
              <el-dropdown-item command="sentDown" v-if="canDeviceInventoryDeliver">批量下发</el-dropdown-item>
              <el-dropdown-item command="callback" v-if="canDeviceInventoryRecall">批量回拨</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button
            type="warning"
            icon="el-icon-lx-qiehuan"
            size="small"
            @click="transfer"
            v-if="level!== levelMap.SECONDORGAN"
          >划拨</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deletes"
            v-if="false"
          >删除</el-button>
        </div>
        <div class="deviceNum">
          <span>库存总数量：{{inventoryNum}}</span>
          <span>下发总数量：{{issuedNum}}</span>
          <span>激活总数量：{{activateNum}}</span>
        </div>
      </div>
    </div>
    <div class="deviceTable">
      <el-table
        :data="incentoryData"
        border
        style="width: 100%"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" v-if="level!== levelMap.SECONDORGAN"></el-table-column>
        <el-table-column
          v-for="v in TableList.slice(0,8)"
          :prop="v.prop"
          :label="v.title"
          :key="v.prop"
          :width="v.width"
        ></el-table-column>
        <el-table-column label="库存状态">
          <template slot-scope="scope">
            <p v-if="scope.row.outStatus === 0" style="color: red">未下发</p>
            <p v-if="scope.row.outStatus === 1" style="color: green">已下发</p>
          </template>
        </el-table-column>
        <el-table-column label="设备状态">
          <template slot-scope="scope">
            <p v-if="scope.row.activateStatus === 0" style="color: red">未激活</p>
            <p v-if="scope.row.activateStatus === 1" style="color: green">已激活</p>
            <p v-if="scope.row.activateStatus === 2" style="color: red">故障</p>
            <p v-if="scope.row.activateStatus === 3" style="color: red">报废</p>
          </template>
        </el-table-column>
        <el-table-column
          v-for="v in TableList.slice(8)"
          :prop="v.prop"
          :label="v.title"
          :key="v.title"
          :width="v.width"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="candeviceFlowDetail"
              size="small"
              @click="showParticulars(scope.row)"
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
    <device-particulars
      :particularsData="this.particularsData"
      v-if="Visible"
      :flag="Visible"
      @modalClose="modalClose"
    ></device-particulars>
    <to-lead
      v-if="toLead"
      :flag="toLead"
      :operationType="operationType"
      @commandClose="commandClose"
      :devModelData="devModelData"
      :organizationData="organizationData"
      @renewal="renewal"
    ></to-lead>
    <!-- 批次入库 -->
    <!-- 下发 -->
    <!-- 回拨 -->
    <transfer
      v-if="transferShow"
      @transferClose="transferClose"
      @renewal="renewal"
      :organizationData="organizationData"
      :selectionData="selectionData"
    ></transfer>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { queryPermission } from '@/util'
import { post } from '../../store/requestFacade.js'
import { mixins } from '@/core'
import deviceParticulars from './equipmentPops/deviceParticulars'
// import batchIncoming from './equipmentPops/batchIncoming'
// import batchIssued from './equipmentPops/batchIssued'
// import batchCallback from './equipmentPops/batchCallback'
import toLead from './equipmentPops/toLead'
import { serachBody } from './map.js'
import { levelMap } from '../../server/level.js'
import { TableTitle, ParseRoleList } from './tableTitle.js'
import { filterUerLeveL } from '../../util'
import transfer from './equipmentPops/transfer'
export default {
  name: 'device-inventory',
  mixins: [mixins.pageMixin],
  components: {
    deviceParticulars,
    // batchIncoming,
    // batchIssued,
    // batchCallback,
    toLead,
    transfer
  },
  data() {
    return {
      pageSize: 10,
      level: '',
      levelMap: levelMap,
      TableList: filterUerLeveL(TableTitle),
      inventoryNum: '',
      issuedNum: '',
      activateNum: '',
      outputs: [],
      incentoryData: [],
      toLead: false,
      transferShow: false,
      // batchIncoming: false,
      // sentDown: false,
      // callback: false,
      Visible: false,
      devModelData: [],
      organizationData: [],
      stockNum: {},
      screenData: {
        ...serachBody
      },
      particularsData: {},
      operationType: '',
      selectionData: []
    }
  },
  methods: {
    ...mapMutations('deviceInventory', ['saveSnapshot']),
    // 获取类型
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
    handleSelectionChange(val) {
      this.selectionData = val
    },
    // 获取机构源
    async getorganization() {
      try {
        const res = await post({
          url: 'organ/organSelect'
        })
        this.organizationData = res.data
      } catch (err) {
        console.log(err)
      }
    },
    // 数量
    async getStockNum() {
      try {
        const res = await post({
          url: 'stock/stockNum'
        })
        this.stockNum = res.data
      } catch (err) {
        console.log(err)
      }
    },
    // 表格渲染
    getUrl() {
      return 'stock/queryStock'
    },
    getPageParams() {
      return {
        pageSize: this.pageSize,
        devNo: this.screenData.devNo, // 设备编号
        outStatus: this.screenData.status, // 库存状态
        activateStatus: this.screenData.activateStatus, // 激活状态
        brandId: this.screenData.brandId, // 选择设备型号
        startDevNo: this.screenData.startDevNo,
        endDevNo: this.screenData.endDevNo,
        provinciaLevelName: this.screenData.provinciaLevelName, // 所属分公司名称
        orgName: this.screenData.orgName, // 所属机构名称
        partnerName: this.screenData.partnerName, // 合伙人姓名
        merchantName: this.screenData.merchantName, // 商户姓名
        startStoreTime: this.screenData.startStoreTime, // 入库时间开始
        endStoreTime: this.screenData.endStoreTime, // 入库事件结束
        startActiveTime: this.screenData.startActiveTime, // 激活时间开始
        endActiveTime: this.screenData.endActiveTime,
        startDeliverTime: this.screenData.startDeliverTime, // 下发时间
        endDeliverTime: this.screenData.endDeliverTime,
        profitStatus: this.screenData.profitStatus
        // onlineState
      }
    },
    toScreen() {
      if ((this.screenData.startDevNo !== '') & (this.screenData.endDevNo === '')) {
        this.$message('请输入结束设备号')
      } else if ((this.screenData.startDevNo === '') & (this.screenData.endDevNo !== '')) {
        this.$message('请输入开始设备号')
      } else {
        this.paging.currentPage = 1
        if (!this.activeNames) {
          this.activeNames = true
        } else {
          this.loadData(true)
        }
        this.btnText = this.activeNames ? '收起' : '展开'
        this.icon = this.activeNames ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      }
    },
    resetSearchCondition() {
      this.screenData = {
        ...serachBody
      }
      this.paging.currentPage = 1
      this.loadData(true)
    },
    handleRows(rows) {
      this.incentoryData = ParseRoleList(rows)
      this.inventoryNum = this.getExtra('inventoryNum')
      this.issuedNum = this.getExtra('issuedNum')
      this.activateNum = this.getExtra('activateNum')
    },
    showParticulars(row) {
      this.Visible = true
      this.particularsData = row
    },
    modalClose() {
      this.Visible = false
    },
    // comingClose() {
    //   this.batchIncoming = false
    // },
    // issuedClose() {
    //   this.sentDown = false
    // },
    // callbackClose() {
    //   this.callback = false
    // },
    transferClose() {
      this.transferShow = false
    },
    renewal() {
      this.loadData()
      this.transferShow = false
      // this.batchIncoming = false
      // this.sentDown = false
      // this.callback = false
      this.toLead = false
    },
    handleCommand(command) {
      if (command === 'inventoryIn') {
        this.operationType = 1
        this.toLead = true
      }
      if (command === 'sentDown') {
        this.operationType = 2
        this.toLead = true
      }
      if (command === 'callback') {
        this.operationType = 3
        this.toLead = true
      }
    },
    commandClose() {
      this.toLead = false
    },
    // 点击划拨
    async transfer() {
      const judge = this.selectionData.map(item => {
        return item.partner
      })
      if (this.selectionData.length === 0) {
        this.$message('请选择需划拨的设备')
      } else if (judge.filter(Boolean).length !== 0) {
        try {
          await this.$confirm(
            `您选择的${judge.length}台设备中存在已下发至合伙人的设备，无法划拨！`,
            '划拨'
          )
        } catch (error) {}
      } else {
        this.transferShow = true
      }
    },
    // 点击删除
    async deletes() {
      if (this.selectionData.length === 0) {
        this.$message('请选择需删除的设备')
      }
      const judge = this.selectionData.map(item => {
        return item.outStatus
      })
      if (judge.includes(1)) {
        try {
          await this.$confirm(`您选择的${judge.length}台设备中存在已下发的设备，无法删除`, '删除')
        } catch (error) {}
      } else {
        console.log('yes')
      }
    }
  },
  mounted() {
    this.getdevModel()
    this.loadData()
    this.getorganization()
    this.getStockNum()
    this.level = localStorage.getItem('level')
  },
  computed: {
    canDeviceInventoryIn() {
      return queryPermission('deviceInventoryIn')
    },
    canDeviceInventoryDeliver() {
      return queryPermission('deviceInventoryDeliver')
    },
    canDeviceInventoryRecall() {
      return queryPermission('deviceInventoryRecall')
    },
    candeviceFlowDetail() {
      return queryPermission('deviceFlowDetail')
    },
    ...mapState('deviceInventory', {
      all: state => state,
      preSearchBody: state => state.searchBody,
      preCurrentPageNumber: state => state.currentPageNumber
    })
  },
  beforeDestroy() {
    this.saveSnapshot({
      searchBody: { ...this.screenData },
      currentPageNumber: 0
    })
  }
}
</script>

<style scoped>
.deviceHead {
  padding: 15px;
}
.deviceNum {
  text-align: right;
  font-size: 14px;
}
.deviceNum span {
  margin-right: 10px;
  color: #606266;
}
.inventory {
  text-align: right;
  color: #20a0ff;
  font-size: 15px;
}
.text {
  text-align: right;
}
.DevNo {
  width: 210px;
}
</style>
