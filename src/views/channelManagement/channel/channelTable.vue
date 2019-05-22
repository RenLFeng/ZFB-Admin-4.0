<template>
  <div>
    <div class="base-tit">
      <Breadcrumb :item='breadcrumb'></Breadcrumb>
    </div>
    <div style="float: left;width: 20%">
      <el-button
        class="addChannel"
        v-if="channelType===TaskType.REPAY&&canRepayAddChannelCompany||channelType===TaskType.RECEIPT&&canReceiptAddChannelCompany"
        @click="companyAdd"
        type="text"
      ><i class="el-icon-plus"></i> 新增</el-button>
      <el-table
        border
        style="width: 100%"
        size='small'
        :data="companyData"
      >
        <el-table-column
          v-for="v in companyTable"
          :prop="v.tableProp"
          :label="v.tableLabel"
          :key="v.tableProp"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="channelType===TaskType.RECEIPT&&canReceiptEditChannelCompany||channelType===TaskType.REPAY&&canRepayEditChannelCompany"
              @click="editCompany(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <edit-company
        v-if="companyShow"
        :flag="companyShow"
        @handleClose="handleClose"
        :companyEdit="companyEdit"
        :companytype="companytype"
        @invite="invite"
      ></edit-company>
    </div>
    <div style="float: right; width: 78%">
      <el-button
        class="addChannel"
        v-if="channelType === TaskType.RECEIPT&&canReceiptChannelAdd || channelType === TaskType.REPAY&&canChannelAdd"
        @click="addChannel"
        type="text"
      ><i class="el-icon-plus"></i> 新增通道</el-button>
      <el-table
        :data="channelData"
        border
        style="width: 100%"
        size='small'
      >
        <el-table-column
          v-for="(v, i) in channelTable.slice(0,4)"
          :prop="v.tableProp"
          :label="v.tableLabel"
          :key="i"
        >
        </el-table-column>
        <el-table-column label="交易时间">
          <template slot-scope="scope">
            <p>{{scope.row.startTime|cutdate}}:00 - {{scope.row.endTime|cutdate}}:00</p>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(v) in channelTable.slice(4)"
          :prop="v.tableProp"
          :label="v.tableLabel"
          :key="v.tableProp"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="channelType===TaskType.REPAY&&canChannelStart&&scope.row.status===0||channelType===TaskType.RECEIPT&&canReceiptChannelStart&&scope.row.status===0"
              @click="start(scope.row)"
            >启用</el-button>
            <el-button
              type="text"
              v-if="channelType===TaskType.REPAY&&canChannelStop&&scope.row.status===1||channelType===TaskType.RECEIPT&&canReceiptChannelStop&&scope.row.status===1"
              @click="pause(scope.row)"
            >暂停</el-button>
            <el-button
              type="text"
              v-if="channelType===TaskType.REPAY&&canChannelEdit||channelType===TaskType.RECEIPT&&canReceiptChannelEdit"
              @click="channelEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              v-if="channelType===TaskType.REPAY&&canChannelBankList||channelType===TaskType.RECEIPT&&canReceiptChannelBankList"
              @click="bankList(scope.row)"
            >银行列表</el-button>
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
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyColumn, channelColumn, parseChannelTable } from '../own/channel.js'
import { queryPermission } from '@/util'
import { mixins } from '@/core'
import { post } from '../../../store/requestFacade.js'
import editCompany from './editCompany'

const TaskType = {
  REPAY: 1,
  RECEIPT: 2
}
const CompanyType = {
  ADD: 1,
  EDIT: 2
}
export default {
  name: 'channel-create',
  mixins: [mixins.pageMixin],
  props: {
    channelType: {
      type: Number,
      default: null
    }
  },
  components: {
    editCompany
  },
  data() {
    return {
      companyTable: companyColumn,
      channelTable: channelColumn,
      title: '',
      TaskType: TaskType,
      companyShow: false,
      channelData: [],
      companyData: [],
      addEditData: {
        showModule: 2,
        EditData: {}
      },
      bankInfo: {
        Module: 3,
        channelId: ''
      },
      companytype: '',
      companyEdit: {}
    }
  },
  methods: {
    handleClose() {
      this.companyShow = false
    },
    invite() {
      this.companyShow = false
      this.companyQuery()
    },
    companyAdd() {
      this.companyShow = true
      this.companytype = CompanyType.ADD
    },
    editCompany(row) {
      this.companyShow = true
      this.companytype = CompanyType.EDIT
      this.companyEdit = row
    },
    getUrl() {
      return 'channel/query'
    },
    getPageParams() {
      return {
        channelType: this.channelType
      }
    },
    handleRows(rows) {
      const tableData = parseChannelTable([].concat(rows))
      this.channelData = tableData.map((item, index) => {
        return Object.assign({}, item, { serialNum: index + 1 })
      })
    },
    addChannel() {
      this.$emit('addChannel', this.addEditData)
    },
    channelEdit(row) {
      this.addEditData.EditData = row
      this.$emit('channelEdit', this.addEditData)
    },
    bankList(row) {
      this.bankInfo.channelId = row.channelId
      this.$emit('banklist', this.bankInfo)
    },
    // 启用
    async start(row) {
      try {
        await this.$confirm('您确定重新启用【' + row.channelRealName + '】通道?', '确认启用', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        const res = await post({
          url: 'channel/setStatus',
          data: {
            channelId: row.channelId,
            status: '1'
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        this.loadData()
      } catch (error) {}
    },
    // 暂停
    async pause(row) {
      try {
        await this.$confirm('您确定暂停使用【' + row.channelRealName + '】通道?', '确认暂停', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        const res = await post({
          url: 'channel/setStatus',
          data: {
            channelId: row.channelId,
            status: '0'
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        this.loadData()
      } catch (error) {}
    },
    async companyQuery() {
      try {
        const res = await post({
          url: 'company/query'
        })
        this.companyData = res.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.loadData()
    this.companyQuery()
    if (this.channelType === TaskType.REPAY) {
      this.title = '还款通道'
      return
    }
    if (this.channelType === TaskType.RECEIPT) {
      this.title = '收款通道'
    }
  },
  filters: {
    cutdate(time) {
      if (Number(time) < 10) {
        return '0' + time
      }
      return time
    }
  },
  computed: {
    breadcrumb() {
      return '通道管理,' + this.title
    },
    canChannelAdd() {
      return queryPermission('repayChannelAdd') // 还款新建通道
    },
    canChannelStart() {
      return queryPermission('repayChannelStart') // 还款启用
    },
    canChannelStop() {
      return queryPermission('repayChannelStop') // 还款暂停
    },
    canChannelEdit() {
      return queryPermission('repayChannelEdit') // 还款 通道 编辑
    },
    canChannelBankList() {
      return queryPermission('repayChannelBankList') // 银行列表
    },
    canRepayAddChannelCompany() {
      return queryPermission('repayAddChannelCompany') // 新增公司
    },
    canRepayEditChannelCompany() {
      return queryPermission('repayEditChannelCompany') // 编辑公司
    },
    canReceiptChannelAdd() {
      return queryPermission('receiptChannelAdd') // 收款新建通道
    },
    canReceiptChannelStart() {
      return queryPermission('receiptChannelStart') // 收款启用
    },
    canReceiptChannelStop() {
      return queryPermission('receiptChannelStop') // 收款暂停
    },
    canReceiptChannelEdit() {
      return queryPermission('receiptChannelEdit') // 收款 通道 编辑
    },
    canReceiptChannelBankList() {
      return queryPermission('receiptChannelBankList') // 银行列表
    },
    canReceiptAddChannelCompany() {
      return queryPermission('receiptAddChannelCompany') // 新增公司
    },
    canReceiptEditChannelCompany() {
      return queryPermission('receiptEditChannelCompany') // 编辑公司
    }
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  margin: 15px 0;
}
.addChannel {
  float: right;
  margin-top: -10px;
}
</style>
