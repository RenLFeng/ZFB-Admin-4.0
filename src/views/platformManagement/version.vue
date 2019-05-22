<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>平台管理</el-breadcrumb-item>
        <el-breadcrumb-item>版本列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="text" v-if="canVersionAdd" @click="newVersion">
        <span class="el-icon-plus"></span>新建版本
      </el-button>
    </div>
    <el-table :data="listData" border style="width: 100%" show-overflow-tooltip="true">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form>
            <el-row class="expand">
              <el-col :span="2">版本信息</el-col>
              <el-col
                :span="22"
                style="textAlign:left"
              >{{ props.row.sysTemTypeText}} - {{props.row.versionName}} - {{props.row.versionNumber}}</el-col>
            </el-row>
            <el-row class="expand">
              <el-col :span="2">更新内容</el-col>
              <el-col :span="22" style="textAlign:left">{{ props.row.newContent }}</el-col>
            </el-row>
            <el-row class="expand">
              <el-col :span="2">下载链接</el-col>
              <el-col :span="22" style="textAlign:left">{{ props.row.downloadLinks }}</el-col>
            </el-row>
            <el-row class="expand">
              <el-col :span="2">存储链接</el-col>
              <el-col :span="22" style="textAlign:left">{{ props.row.storageLinks }}</el-col>
            </el-row>
            <el-row class="expand">
              <el-col :span="2">更新类型</el-col>
              <el-col :span="22" style="textAlign:left">{{ props.row.updateTypeText}}</el-col>
            </el-row>
            <el-row class="expand">
              <el-col :span="2">备注信息</el-col>
              <el-col :span="22" style="textAlign:left">{{ props.row.remark || '暂无'}}</el-col>
            </el-row>
            <el-row class="expand">
              <el-col :span="2">发布状态</el-col>
              <el-col :span="22" style="textAlign:left">{{ props.row.enableText || '暂无'}}</el-col>
            </el-row>
            <el-row class="expand" v-if="props.row.releaseCode">
              <el-col :span="2">发布方式</el-col>
              <el-col :span="22" style="textAlign:left">{{ calcGaryReleaseRangeTXT (props.row)}}</el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        :prop="v.tableTitle"
        :label="v.tableLabel"
        :key="v.tableTitle"
        :width="v.width"
        v-for="v in table"
      ></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <div v-if="Number(scope.row.enable) !== 3">
            <el-button
              type="text"
              v-if="canVersionEdit"
              @click="operation(scope.row)"
              v-text="calcReleaseBtnText(scope.row.enable)"
            ></el-button>
            <el-button
              type="text"
              v-if="Number(scope.row.enable) == 0 ? true : false "
              @click="editVersion(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              style="color:red"
              size="small"
              @click="delVerBtn(scope.row.sysTeamId,scope.row.versionName)"
            >删除</el-button>
          </div>
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
    <create-version
      v-if="verVisible"
      :perVersion="perVersion"
      :GrayscaleReleaseList="GrayscaleReleaseList"
      @versionHide="versionHide"
      @addVer="addVer"
    ></create-version>
    <el-dialog title="发布" :visible.sync="releaseDialogVisible" width="30%">
      <span>确定发布【 {{currentReleaseName}} 】版本？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="releaseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSureRelease">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="取消发布" :visible.sync="cancelReleaseDialogVisible" width="30%">
      <span>取消发布【 {{currentReleaseName}} 】版本？</span>
      <el-input type="textarea" :rows="3" placeholder="取消发布原因" v-model="remark"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelReleaseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCancelRelease">确定取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryPermission } from '@/util'
import createVersion from './createVersion'
import { mixins } from '@/core'
import { post } from '../../store/requestFacade.js'
import { versionTableHead, accessSystemTypeName, calcGaryReleaseRangeTXT } from './sup/map'
import {
  formateTableData,
  calcGrayscaleReleaseList,
  calcRowDetails,
  calcReleaseBtnText
} from './sup/calc'
export default {
  name: 'version',
  mixins: [mixins.pageMixin],
  components: {
    createVersion
  },
  data() {
    return {
      table: [],
      verVisible: false,
      versionInfo: [],
      perVersion: null,
      sysTeamId: '',
      GrayscaleReleaseList: [],
      releaseDialogVisible: false,
      cancelReleaseDialogVisible: false,
      currentReleaseName: '',
      currentItem: '',
      remark: ''
    }
  },
  methods: {
    calcGaryReleaseRangeTXT(obj) {
      const allList = this.GrayscaleReleaseList
      return calcGaryReleaseRangeTXT(obj, allList)
    },
    // 获取版本列表API
    getUrl() {
      return 'sysTemVersion/getAll'
    },
    getPageParams() {
      return {}
    },
    handleRows(rows) {
      this.versionInfo = rows.map((_, index) => {
        _.index = index + 1
        return _
      })
    },
    newVersion() {
      this.verVisible = true
      this.perVersion = null
    },
    versionHide() {
      this.verVisible = false
    },
    addVer() {
      this.verVisible = false
      this.loadData()
    },
    // 把每行的数据传给子组件
    editVersion(row) {
      console.log('row: ', row)
      this.verVisible = true
      this.perVersion = calcRowDetails(row)
    },
    calcReleaseBtnText(num) {
      return calcReleaseBtnText(num)
    },
    // 获取机构列表
    async getOrganlist() {
      try {
        const res = await post({
          url: 'version/organlist',
          data: {}
        })
        this.GrayscaleReleaseList = calcGrayscaleReleaseList(res.data)
      } catch (err) {
        console.log(err)
      }
    },
    // 操作
    async operation(item) {
      //   release: 1, // 发布
      //   cancelRelease: 3   // 取消发布
      if (Number(item.enable) !== 1) {
        this.toRelease(item)
      } else {
        console.log('cancel')
        this.toCancelRelease(item)
      }
    },
    // 发布
    toRelease(item) {
      this.currentReleaseName = `${accessSystemTypeName(item)} ${item.versionName}`
      this.currentItem = item
      this.releaseDialogVisible = true
    },
    toCancelRelease(item) {
      this.currentReleaseName = `${accessSystemTypeName(item)} ${item.versionName}`
      this.currentItem = item
      this.cancelReleaseDialogVisible = true
    },
    // 确认发布版本
    async handleSureRelease() {
      try {
        const res = await post({
          url: '/sysTemVersion/release',
          data: {
            versionId: this.currentItem.sysTeamId,
            releaseStatus: 1,
            remark: ''
          }
        })
        if (res.data === '发布成功') {
          this.releaseDialogVisible = false
          this.currentItem = ''
          this.$message.success(`${this.currentReleaseName}发布成功`)
          this.loadData()
        }
      } catch (err) {
        console.log(err)
      }
    },
    //
    async handleCancelRelease() {
      if (this.remark === '') {
        this.$message.info('请填写取消发布原因')
        return
      }
      try {
        const res = await post({
          url: '/sysTemVersion/release',
          data: {
            versionId: this.currentItem.sysTeamId,
            releaseStatus: 3,
            remark: this.remark
          }
        })
        if (res.msg === '成功') {
          this.cancelReleaseDialogVisible = false
          this.$message.success(`${this.currentReleaseName}成功取消！`)
          this.loadData()
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 删除版本
    async delVer() {
      try {
        const res = await post({
          url: 'sysTemVersion/del',
          data: {
            sysTeamId: this.sysTeamId
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
    delVerBtn(id, name) {
      this.sysTeamId = id
      this.$confirm('是否确定删除版本' + name, '删除').then(() => {
        this.delVer()
      })
    }
  },
  mounted() {
    this.loadData()
    this.getOrganlist()
    this.table = versionTableHead
  },
  computed: {
    canVersionAdd() {
      return queryPermission('versionAdd')
    },
    canVersionEdit() {
      return queryPermission('versionEdit')
    },
    canVersionDelete() {
      return queryPermission('versionDelete')
    },
    listData() {
      return formateTableData(this.versionInfo)
    }
  }
}
</script>
<style scoped lang='css'>
.details {
  font-size: 0;
}
.details label {
  width: 90px;
  color: #99a9bf;
}
.details .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  text-align: left;
}
.expand {
  margin-bottom: 20px;
}
</style>