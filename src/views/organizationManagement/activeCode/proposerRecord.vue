<template>
  <div>
    <div class="searchBox">
      <p style="text-align:right">
        <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form :inline="true" label-width="100px" v-show="activeNames">
        <el-form-item label="申请时间">
          <el-date-picker v-model="beginTime" value-format="yyyy-MM-dd " placeholder="申请时间(开始)"></el-date-picker>&nbsp; 至 &nbsp;
          <el-date-picker v-model="endTime" value-format="yyyy-MM-dd " placeholder="申请时间(结束)"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="level === levelMap.PLATFORM" label="申请机构">
          <el-input v-model="organName" placeholder="申请机构" clearable></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="audit" placeholder="审核状态" clearable>
            <el-option label="待审核" :value="0"></el-option>
            <el-option label="审核通过" :value="2"></el-option>
            <el-option label="审核未通过" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <el-table :data="recallRecordData" border style="width: 100%">
      <el-table-column
        v-for="(v,i) in applicationTitleList"
        :key="i"
        :label="v.title"
        :prop="v.prop"
        :width="v.width"
      ></el-table-column>
      <el-table-column prop="operator" label="操作" v-if="level !== levelMap.SECONDORGAN">
        <template slot-scope="scope">
          <div v-if="scope.row.operatorStatus === 1">
            <el-button type="primary" size="mini" v-if="canPass" @click="toPass(scope.row)">通过</el-button>
            <el-button type="danger" size="mini" v-if="canNotPass" @click="toNoPass(scope.row)">不通过</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 16px; background: white; overflow: hidden;">
      <div style="float: right;">
        <el-pagination
          background
          :page-sizes="[10, 30, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paging.currentPage"
          :page-size="paging.pageSize"
          layout="total, prev, pager, next, sizes"
          :total="paging.total"
        ></el-pagination>
      </div>
    </div>
    <!-- 不通过 -->
    <el-dialog title="审核不通过" :visible.sync="noPass" width="30%">
      <el-form :model="noPassData" ref="noPass" :rules="rules">
        <el-form-item label="审核意见" label-width="100px" prop="remarks">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            v-model="noPassData.remarks"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noPass =false">取 消</el-button>
        <el-button type="primary" @click="noPassClick('noPass')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 通过 -->
    <get-through
      v-if="through"
      @toThroughShow="toThroughShow"
      @toThroughSuccess="toThroughSuccess"
      :Application="Application"
      :stockNumber="stockNumber"
    ></get-through>
  </div>
</template>

<script>
import { mixins } from '@/core'
import { levelMap } from '../../../server/level.js'
import { applicationTitle, ParseRoleList } from './table.js'
import { filterUerLeveL, queryPermission } from '../../../util'
import getThrough from './getThrough'
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'proposer-record',
  mixins: [mixins.pageMixin],
  components: {
    getThrough
  },
  props: {
    stockNumber: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      pageSize: 10,
      applicationTitleList: [],
      level: '',
      through: false,
      levelMap,
      noPass: false,
      organName: '',
      beginTime: '',
      endTime: '',
      audit: '',
      recallRecordData: [],
      deviceNumber: 0,
      Application: '',
      noPassData: {
        remarks: ''
      },
      rules: { remarks: [{ required: true, message: '请输入审核意见', trigger: 'blur' }] }
    }
  },
  methods: {
    getUrl() {
      return 'applyCode/query'
    },
    getPageParams() {
      return {
        pageSize: this.pageSize,
        organName: this.organName,
        startDate: this.beginTime,
        endDate: this.endTime,
        status: this.audit
      }
    },
    toThroughShow() {
      this.through = false
    },
    handleRows(rows) {
      // this.deviceNumber = this.getExtra('number')
      this.recallRecordData = ParseRoleList(rows)
    },
    reset() {
      this.pageSize = ''
      this.organName = ''
      this.beginTime = ''
      this.endTime = ''
      this.audit = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    noPassClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.notPass()
        } else {
          return false
        }
      })
    },
    toNoPass(row) {
      this.Application = row
      this.noPass = true
    },
    toPass(row) {
      this.Application = row
      this.through = true
    },
    async notPass() {
      try {
        const res = await post({
          url: 'applyCode/notPass',
          data: {
            applyId: this.Application.applyId,
            remark: this.noPassData.remarks
          }
        })
        this.$message(res.data)
        this.noPass = false
        this.loadData()
        this.$emit('deliverySuccess')
      } catch (error) {
        console.log(error)
      }
    },
    toThroughSuccess() {
      this.through = false
      this.$emit('deliverySuccess')
      this.loadData()
    }
  },
  mounted() {
    this.loadData()
    this.applicationTitleList = filterUerLeveL(applicationTitle)
    this.level = localStorage.getItem('level')
  },
  computed: {
    canPass() {
      return queryPermission('pass')
    },
    canNotPass() {
      return queryPermission('notPass')
    }
  }
}
</script>

<style lang="css" scoped>
.totalNumber {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 14px;
}
</style>
