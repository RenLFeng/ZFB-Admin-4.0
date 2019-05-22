<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item="机构管理,机构列表"></Breadcrumb>
      <el-button v-if="canCreateOrganization" type="text" @click="newBtn" icon="el-icon-plus">新建机构</el-button>
    </div>
    <div class="G_grid_1">
      <!-- 搜索 -->
      <div class="searchBox">
        <p style="text-align:right">
          <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
        </p>
        <el-form :inline="true" label-width="100px" v-show="activeNames">
          <el-form-item label="机构名称">
            <el-input clearable v-model="organName" placeholder="机构名称"></el-input>
          </el-form-item>
          <el-form-item label="机构编号">
            <el-input clearable v-model="organNumber" placeholder="机构编号"></el-input>
          </el-form-item>
          <el-form-item label="机构账号">
            <el-input clearable v-model="loginAccount" placeholder="机构账号"></el-input>
          </el-form-item>
          <el-form-item label="机构类型">
            <el-select
              v-model="organType"
              v-if="level <= levelMap.PROVINCIAL"
              clearable
              placeholder="机构类型"
            >
              <el-option v-if="level === levelMap.PLATFORM" label="分公司" value="2"></el-option>
              <el-option label="子公司" value="3"></el-option>
              <el-option label="高级合伙人" value="9"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="level <= levelMap.PROVINCIAL" label="上级机构">
            <el-select v-model="upOrganId" clearable placeholder="选择上级机构">
              <el-option
                v-for="(v, i) in orgSelectData"
                :key="i"
                :label="v.organName"
                :value="v.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登陆状态">
            <el-select v-model="organStatus" clearable placeholder="登陆状态">
              <el-option label="正常" value="1"></el-option>
              <el-option label="冻结" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账户状态">
            <el-select v-model="disableState" clearable placeholder="账户状态">
              <el-option label="正常" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建日期">
            <el-date-picker
              v-model="startDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="创建开始日期"
              style="width:210px"
            ></el-date-picker>&nbsp;至
            <el-date-picker
              v-model="endDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="创建结束日期"
              style="width:210px"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 10px">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
      <!-- 机构列表 -->
      <el-table :data="listData" border style="width: 100%" size="small">
        <el-table-column
          v-for="(v,i) in TableList"
          :prop="v.prop"
          :label="v.title"
          :key="i"
          :width="v.width"
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="canResetOrganizationPassword"
              type="text"
              size="small"
              @click="resetPwdBtn(scope.row.organId)"
            >重置密码</el-button>
            <el-button
              v-if="canOrganizationDetail"
              type="text"
              size="small"
              @click="organDetail(scope.row.organId)"
            >详情</el-button>
            <el-button
              type="text"
              style="color:red"
              v-if="scope.row.disableState === 1&&canDisableOrganization"
              size="small"
              @click="disableBtn(scope.row.organId)"
            >禁用</el-button>
            <el-button
              type="text"
              style="color:red"
              v-if="scope.row.disableState === 0&&canEnableOrganization"
              size="small"
              @click="activationBtn(scope.row.organId)"
            >激活</el-button>
            <el-button
              type="text"
              style="color:red"
              v-if="scope.row.organStatus === 1&&canFreezeOrganization"
              size="small"
              @click="freezeBtn(scope.row.organId)"
            >冻结</el-button>
            <el-button
              type="text"
              style="color:red"
              v-if="scope.row.organStatus === 0&&canUnFreezeOrganization"
              size="small"
              @click="unfreezeBtn(scope.row.organId)"
            >解冻</el-button>
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
            layout="total, prev, pager, next,sizes"
            :total="paging.total"
          ></el-pagination>
        </div>
      </div>
      <!-- 添加机构 -->
      <add-organ
        :orgSelectData="orgSelectData"
        v-if="newOrgan"
        @addOrg="addOrg"
        @organHide="organHide"
      ></add-organ>
      <!-- 详情 -->
    </div>
  </div>
</template>

<script>
import { queryPermission } from '@/util'
import { post } from '../../store/requestFacade.js'
import { mixins } from '@/core'
import areaData from '../../assets/lib/jialian.json'
import { levelMap } from '../../server/level.js'
import { ParseRoleList, TableTitle } from './own.js'
import { filterUerLeveL } from '../../util'
export default {
  name: 'organizations',
  mixins: [mixins.pageMixin],

  data() {
    return {
      pageSize: 10,
      level: '',
      areaData: '',
      TableList: [],
      levelMap: levelMap,
      totalActivateNum: '',
      totalInventoryNum: '',
      totalIssuedNum: '',
      orgSelectData: {},
      organNumber: '',
      organName: '',
      loginAccount: '',
      listData: [],
      newOrgan: false,
      detailInfo: false,
      userId: '',
      organId: '',
      organType: '',
      upOrganId: '',
      startDate: '',
      endDate: '',
      organStatus: '',
      disableState: '',
      editOrganData: {
        organId: ''
      }
    }
  },
  filters: {
    // 地区编码转换为地区名
    codeIntoName(code) {
      try {
        for (var i = 0; i < areaData.length; i++) {
          if (code === areaData[i].value) {
            return areaData[i].text
          }
          for (var j = 0; j < areaData[i].children.length; j++) {
            if (code === areaData[i].children[j].value) {
              return areaData[i].children[j].text
            }
          }
        }
      } catch (error) {
        return ''
      }
    }
  },
  methods: {
    newBtn() {
      // this.$router.push({ path: '/addOrgan' })
      this.$emit('addorgan')
    },
    addOrg() {
      this.newOrgan = false
      this.loadData()
      this.orgSelect()
    },
    organHide() {
      this.newOrgan = false
    },
    editArea(value) {
      this.editOrganData.provinceCode = value[0]
      this.editOrganData.cityCode = value[1]
    },
    // 平台，分公司选择的所有列表
    async orgSelect() {
      try {
        const res = await post({
          url: 'organ/orgSelect'
        })
        this.orgSelectData = res.data
      } catch (err) {
        console.log(err)
      }
    },
    // 机构列表
    getUrl() {
      return 'organ/queryOrgan'
    },
    getPageParams() {
      return {
        organCode: this.organNumber,
        organName: this.organName,
        organAccount: this.loginAccount,
        organType: this.organType,
        upOrganId: this.upOrganId,
        startDate: this.startDate,
        endDate: this.endDate,
        organStatus: this.organStatus,
        disableState: this.disableState,
        pageSize: this.pageSize
      }
    },
    handleRows(rows) {
      this.listData = ParseRoleList(rows)
      this.totalActivateNum = this.getExtra('totalActivateNum')
      this.totalInventoryNum = this.getExtra('totalInventoryNum')
      this.totalIssuedNum = this.getExtra('totalIssuedNum')
    },

    reset() {
      this.organNumber = ''
      this.organName = ''
      this.loginAccount = ''
      this.organType = ''
      this.upOrganId = ''
      this.startDate = ''
      this.endDate = ''
      this.organStatus = ''
      this.disableState = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    // 重置密码
    async resetPwd() {
      try {
        const res = await post({
          url: 'organ/resetPwd',
          data: {
            organId: this.organId
          }
        })
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    resetPwdBtn(organId) {
      this.organId = organId
      this.$confirm('是否确定将机构的登录密码重置为a123456？', '重置密码')
        .then(() => {
          this.resetPwd()
        })
        .catch(() => {})
    },
    // 机构详情
    organDetail(organId) {
      this.$emit('toOrgan', organId)
    },
    // 冻结
    async freeze() {
      try {
        const res = await post({
          url: 'organ/freezeOrgan',
          data: {
            organId: this.organId
          }
        })
        this.loadData()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    freezeBtn(id) {
      this.organId = id
      this.$confirm('冻结账号后无法正常提现,您确定冻结账号操作吗？', '账号冻结')
        .then(() => {
          this.freeze()
        })
        .catch(() => {})
    },
    // 解冻
    unfreezeBtn(id) {
      this.organId = id
      this.$confirm('解冻账号后可以正常提现,您确定解冻账号操作吗？', '账号解冻')
        .then(() => {
          this.unfreeze()
        })
        .catch(() => {})
    },
    async unfreeze() {
      try {
        const res = await post({
          url: 'organ/unfreezeOrgan',
          data: {
            organId: this.organId
          }
        })
        this.loadData()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 激活
    async activation() {
      try {
        const res = await post({
          url: 'organ/unDisableOrgan',
          data: {
            organId: this.organId
          }
        })
        console.log(res)
        this.loadData()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    activationBtn(id) {
      this.organId = id
      this.$confirm('激活账号后可以正常登录后台,您确定激活账号操作吗？', '账号激活')
        .then(() => {
          this.activation()
        })
        .catch(() => {})
    },
    // 禁用
    disableBtn(id) {
      this.organId = id
      this.$confirm('禁用账号后无法正常登录后台,您确定禁用账号操作吗？', '账号禁用')
        .then(() => {
          this.unable()
        })
        .catch(() => {})
    },
    async unable() {
      try {
        const res = await post({
          url: 'organ/disableOrgan',
          data: {
            organId: this.organId
          }
        })
        console.log(res)
        this.loadData()
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    modalClose() {
      this.detailInfo = false
    },
    editSave() {
      this.detailInfo = false
      this.loadData()
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.TableList = filterUerLeveL(TableTitle)
    this.areaData = areaData
    this.orgSelect()
    this.loadData()
  },
  computed: {
    canCreateOrganization() {
      return queryPermission('createOrganization') // 新建机构
    },
    canResetOrganizationPassword() {
      return queryPermission('resetOrganizationPassword') // 重构机构密码
    },
    canOrganizationDetail() {
      return queryPermission('organizationDetail') // 机构详情
    },
    canDisableOrganization() {
      return queryPermission('disableOrganization') // 禁用机构
    },
    canEnableOrganization() {
      return queryPermission('enableOrganization') // 激活机构
    },
    canFreezeOrganization() {
      return queryPermission('freezeOrganization') // 冻结机构
    },
    canUnFreezeOrganization() {
      return queryPermission('unFreezeOrganization') // 解冻机构
    }
  }
}
</script>

<style lang="css" scoped>
.el-dialog__body {
  padding-top: 0;
}
.dialog_p {
  padding: 5px 0 10px 0;
}
.base-tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin: 0;
}
.total {
  font-size: 14px;
  color: #606266;
  margin-right: 30px;
  text-align: right;
}
</style>
