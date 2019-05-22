<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>平台管理</el-breadcrumb-item>
        <el-breadcrumb-item>银行信息</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="text" v-if="canBankCreate" @click="newBank">
        <span class="el-icon-plus"></span>新建银行
      </el-button>
    </div>
    <el-table :data="bankInfo" border style="width: 100%;">
      <el-table-column
        v-for="(v, i) in table.slice(0,2)"
        :prop="v.tableProp"
        :label="v.tableLabel"
        :key="i"
        :width="v.width"
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
        :key="v.tableProp"
        :width="v.width"
      ></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" v-if="canBankEdit" @click="editBankBtn(scope.row)">编辑</el-button>
          <el-button
            type="text"
            style="color:red"
            v-if="canBankDelete"
            @click="delBankBtn(scope.row.bankId,scope.row.btName)"
          >删除</el-button>
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
        ></el-pagination>
      </div>
    </div>
    <add-bank v-if="bankVisible" :bankData="bankData" @bankHide="bankHide" @addBank="addBank"></add-bank>
  </div>
</template>

<script>
import { bankBaseColumn, parseBank } from './own/bank.js'
import { post } from '../../store/requestFacade.js'
import { queryPermission } from '@/util'
import addBank from './addBank'
import { mixins } from '@/core'
export default {
  name: 'bank',
  mixins: [mixins.pageMixin],
  components: {
    addBank
  },
  computed: {
    canBankCreate() {
      return queryPermission('bankCreate')
    },
    canBankEdit() {
      return queryPermission('bankEdit')
    },
    canBankDelete() {
      return queryPermission('bankDelete')
    }
  },
  data() {
    return {
      table: [],
      bankVisible: false,
      bankData: null,
      bankInfo: [],
      bankId: '',
      btName: ''
    }
  },
  methods: {
    newBank() {
      this.bankData = null
      this.bankVisible = true
    },
    editBankBtn(bank) {
      this.bankVisible = true
      this.bankData = bank
      console.log(bank)
    },
    bankHide() {
      this.bankVisible = false
    },
    addBank() {
      this.bankVisible = false
      this.loadData()
    },
    // 获取银行信息
    getUrl() {
      return 'queryListBankTrunk/pageList'
    },
    getPageParams() {
      return {}
    },
    merge(...objs) {
      return Object.assign({}, ...objs)
    },
    handleRows(rows) {
      const newRows = rows.map((element, index) => this.merge({ index: index + 1 }, element))
      this.bankInfo = parseBank(newRows)
    },
    // 删除银行
    async delBank() {
      try {
        const res = await post({
          url: 'queryListBankTrunk/del',
          data: {
            bankId: this.bankId
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
    delBankBtn(bankId, btName) {
      this.bankId = bankId
      this.$confirm('是否确定删除' + btName, '删除').then(() => {
        this.delBank()
      })
    }
  },
  mounted() {
    this.loadData()
    this.table = bankBaseColumn()
  }
}
</script>

<style lang="css" scoped>
</style>
