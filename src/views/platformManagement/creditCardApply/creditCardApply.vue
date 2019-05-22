<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>平台管理</el-breadcrumb-item>
        <el-breadcrumb-item>信用卡申请</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="text" v-if="canCreditCardApplyCreate" @click="newCredit">
        <span class="el-icon-plus"></span>新建
      </el-button>
    </div>
    <el-table :data="creditData" border style="width: 100%">
      <el-table-column
        v-for="v in table.slice(0,2)"
        :prop="v.tableProp"
        :label="v.tableLabel"
        :key="v.tableProp"
      ></el-table-column>
      <el-table-column prop="imgUrl" label="Logo图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" alt>
        </template>
      </el-table-column>
      <el-table-column
        v-for="v in table.slice(2)"
        :prop="v.tableProp"
        :label="v.tableLabel"
        :key="v.tableLabel"
      ></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" v-if="canCreditCardApplyEdit" @click="editCreditBtn(scope.row)">编辑</el-button>
          <el-button
            type="text"
            v-if="canCreditCardApplyDelete"
            style="color:red"
            size="small"
            @click="delCreditBtn(scope.row.applyId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
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
    <!-- 新建银行和编辑银行的弹框 -->
    <edit-credit
      v-if="creditVisible"
      :creditInfo="creditInfo"
      @modifyCredit="modifyCredit"
      @creditHide="creditHide"
    ></edit-credit>
  </div>
</template>

<script>
import { creditBaseColumn, parseCredit } from '../own/credit.js'
import { queryPermission } from '@/util'
import { mixins } from '@/core'
import editCredit from './editCredit'
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'credit-card-apply',
  mixins: [mixins.pageMixin],
  components: {
    editCredit
  },
  computed: {
    canCreditCardApplyCreate() {
      return queryPermission('creditCardApplyCreate')
    },
    canCreditCardApplyEdit() {
      return queryPermission('creditCardApplyEdit')
    },
    canCreditCardApplyDelete() {
      return queryPermission('creditCardApplyDelete')
    }
  },
  data() {
    return {
      table: [],
      creditVisible: false,
      // 信用卡列表
      creditData: [],
      creditInfo: null,
      applyId: ''
    }
  },
  methods: {
    newCredit() {
      this.creditVisible = true
      this.creditInfo = null
    },
    creditHide() {
      this.creditVisible = false
    },
    modifyCredit() {
      this.creditVisible = false
      this.loadData()
    },
    // 把表格每一行的数据的传给子组件
    editCreditBtn(credit) {
      this.creditVisible = true
      this.creditInfo = credit
    },
    // 获取信用卡列表信息
    getUrl() {
      return 'BackCreditcardApply/pageList'
    },
    getPageParams() {
      return {}
    },
    handleRows(rows) {
      this.creditData = parseCredit([].concat(rows))
    },
    // 删除信用卡
    async delCredit() {
      try {
        const res = await post({
          url: 'BackCreditcardApply/del',
          data: {
            applyId: this.applyId
          }
        })
        this.loadData()
        console.log(res)
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    delCreditBtn(applyId) {
      this.applyId = applyId
      this.$confirm('是否确定删除该信用卡', '删除').then(() => {
        this.delCredit()
      })
    }
  },
  mounted() {
    this.loadData()
    this.table = creditBaseColumn()
  }
}
</script>

<style lang="css" scoped>
</style>
