<template>
  <el-dialog :title="title" :visible="true" :before-close="versionHide">
    <el-form :model="currentVer" :rules="rules" ref="verForm">
      <!-- 系统类型 -->
      <el-form-item label="系统类型" prop="sysTemType">
        <el-radio-group
          v-model="currentVer.sysTemType"
          @change="handleRadioClick"
          :disabled="title === '编辑'"
        >
          <el-radio-button :label="v.id" v-for="v in SystemTypeArr" :key="v.id">{{v.value}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 更新类型类型 -->
      <el-form-item label="更新类型" prop="updateType">
        <el-radio-group v-model="currentVer.updateType">
          <el-radio :label="String(v.id)" v-for="v in UpdateTypeArr" :key="v.id">{{v.value}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 卡槽数目 -->
      <el-form-item
        v-if="isEquipment(Number(currentVer.sysTemType))"
        label="卡槽数目"
        prop="psoCardSlotNum"
      >
        <el-radio-group v-model="currentVer.posCardSlotNum">
          <el-radio label="4">4卡槽</el-radio>
          <el-radio label="16">16卡槽</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 发布范围 -->
      <el-form-item
        v-if="isEquipment(Number(currentVer.sysTemType))"
        label="发布范围"
        prop="releaseCode"
      >
        <el-select
          v-model="currentVer.releaseCode"
          placeholder="请选择"
          class="mr30"
          @change="resetMultipleList"
        >
          <el-option
            v-for="item in GrayscaleReleaseList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            size="medium"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="currentVer.releaseCode && currentVer.releaseCode !==100"
        label="灰度范围"
        prop="multipleRange"
      >
        <el-select v-model="currentVer.multipleRange" multiple placeholder="请选择灰度区域">
          <el-option
            v-for="item in multipleRangeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 发布范围 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="版本名称" label-width="80px" prop="versionName">
            <el-input v-model="currentVer.versionName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="版本号" label-width="80px" prop="versionNumber">
            <el-input v-model="currentVer.versionNumber" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="更新内容" label-width="80px" prop="newContent">
        <el-input type="textarea" v-model="currentVer.newContent" max="140"></el-input>
      </el-form-item>
      <el-form-item label="下载链接" label-width="80px" prop="downloadLinks">
          <el-input v-if="!currentVer.downloadLinks2" v-model="currentVer.downloadLinks"></el-input>
          <el-input v-if="currentVer.downloadLinks2" v-model="currentVer.downloadLinks2"></el-input>
      </el-form-item>
      <el-form-item label="储存链接" label-width="80px">
        <el-input :placeholder="currentVer.storageLinks?currentVer.storageLinks:currentVer.downloadLinks" :disabled="true">.</el-input>
      </el-form-item>
    </el-form>
    <div class="upload_area">
      <el-upload
        ref="upload"
        drag
        :action="uploadAPKapi"
        :on-success="handleZIPsuccess"
        :on-error="handleZIPSfailed"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将
          <em>{{systemTypeName}}安装包</em>文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save('verForm')">保 存</el-button>
    </div>
  </el-dialog>
</template>


<script>
import { SystemTypeArr, UpdateTypeArr, isEquipment, accessDeviceZipName } from './sup/map'
import { ReleaseListObj } from './sup/calc'
import { uploadAPKapi, addNewRelease, editorRelease } from '../../server/Interface'
export default {
  props: {
    perVersion: {
      type: Object,
      default: () => null
    },
    GrayscaleReleaseList: {
      type: Array,
      default: () => null
    }
  },
  data() {
    return {
      title: '',
      uploadAPKapi: uploadAPKapi,
      currentVer: {
        sysTeamId: '',
        sysTemType: 1,
        versionName: '',
        versionNumber: '',
        newContent: '',
        downloadLinks: 'https://dibaqu.com/SZZX',
        downloadLinks2: '',
        updateType: '0',
        posCardSlotNum: '4',
        storageLinks: '',
        releaseCode: 100,
        multipleRange: []
      },
      rules: {
        sysTemType: [{ required: true, message: '请选择系统类型', trigger: 'blur' }],
        versionName: [{ required: true, message: '请输入版本名称', trigger: 'blur' }],
        versionNumber: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        newContent: [{ required: true, message: '请输入更新内容', trigger: 'blur' }],
        downloadLinks: [{ required: true, message: '请输入APP链接', trigger: 'blur' }],
        updateType: [{ required: true, message: '请选择更新类型', trigger: 'blur' }],
        posCardSlotNum: [{ required: true, message: '请选择卡槽数目', trigger: 'blur' }],
        releaseCode: [{ required: true, message: '请选择发布范围', trigger: 'blur' }],
        multipleRange: [{ required: true, message: '请选择灰度范围', trigger: 'blur' }]
      },
      SystemTypeArr,
      UpdateTypeArr
    }
  },
  computed: {
    multipleRangeOptions() {
      const list = ReleaseListObj(this.GrayscaleReleaseList)[this.currentVer.releaseCode]
      const rawArray = list ? list.children : []
      return rawArray.map(v => ({
        value: v.organId,
        label: `${v.organName}(${v.lowerLevelNum})`
      }))
    },
    systemTypeName() {
      const typeId = Number(this.currentVer.sysTemType)
      return typeId === 1
        ? 'iOS'
        : typeId === 2
        ? 'Android'
        : `设备(${this.currentVer.posCardSlotNum}卡槽)`
    }
  },
  methods: {
    isEquipment(number) {
      return isEquipment(number)
    },
    handleZIPsuccess(res, file) {
       this.currentVer.storageLinks = res.data
      if(this.currentVer.sysTemType!=1){
        this.currentVer.downloadLinks2= res.data
      }
      this.$message.success(`${file.name}文件上传成功`)
    },
    handleRadioClick(id) {
      console.log('id: ', id)
      this.$refs.upload.clearFiles()
      this.currentVer.sysTemType = id
       this.currentVer.storageLinks = 'https://dibaqu.com/SZZX'
      this.currentVer.downloadLinks= 'https://dibaqu.com/SZZX'
       this.currentVer.downloadLinks2= ''
    },
    handleZIPSfailed(res) {
      this.$message.error(`${res.msg}`)
    },
    resetMultipleList() {
      this.currentVer.multipleRange = []
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.perVersion) {
            this.editVer()
          } else {
            this.addVer()
          }
        } else {
          return false
        }
      })
    },
    versionHide() {
      this.$emit('versionHide')
    },
    // 添加版本
    async addVer() {
      try {
        if (!this.currentVer.storageLinks) {
          this.$message.error(`没有上传【 ${this.systemTypeName} 安装包 】文件`)
          return
        }
        const body = {
          sysTemType: this.currentVer.sysTemType, // 系统类型（1 1-ios，2-安卓，3-设备
          versionName: this.currentVer.versionName, // 版本名称
          versionNumber: this.currentVer.versionNumber, // 版本号
          newContent: this.currentVer.newContent, // 更新内容
          downloadLinks: this.currentVer.downloadLinks, // 下载链接
          storageLinks: this.currentVer.storageLinks, // 存储链接
          updateType: this.currentVer.updateType, // 更新类型 0 正常更新 1 强制更新
          pkgName: accessDeviceZipName(Number(this.currentVer.posCardSlotNum)), // 包名（只有发布设备版本会有）
          releaseCode: this.currentVer.releaseCode, // 设备灰度发布标识（100-整体发布，200-部分分公司发布，300 部分一级发布，只有发布设备版本会有）
          oneOrganId: this.currentVer.multipleRange, // 灰度发布子公司（只有发布设备版本会有）
          provinceId: this.currentVer.multipleRange // 灰度发布分公司（只有发布设备版本会有）
        }
        this.$axios.post(addNewRelease, body).then(res => {
          this.$emit('addVer')
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑版本
    async editVer() {
      try {
        const body = {
          sysTemType: this.currentVer.sysTemType, // 系统类型（1 1-ios，2-安卓，3-设备
          versionName: this.currentVer.versionName, // 版本名称
          versionNumber: this.currentVer.versionNumber, // 版本号
          newContent: this.currentVer.newContent, // 更新内容
          downloadLinks: this.currentVer.downloadLinks, // 下载链接
          storageLinks: this.currentVer.storageLinks, // 存储链接
          updateType: this.currentVer.updateType, // 更新类型 0 正常更新 1 强制更新
          pkgName: accessDeviceZipName(Number(this.currentVer.posCardSlotNum)), // 包名（只有发布设备版本会有）
          releaseCode: this.currentVer.releaseCode, // 设备灰度发布标识（100-整体发布，200-部分分公司发布，300 部分一级发布，只有发布设备版本会有）
          oneOrganId: this.currentVer.multipleRange, // 灰度发布子公司（只有发布设备版本会有）
          provinceId: this.currentVer.multipleRange, // 灰度发布分公司（只有发布设备版本会有）
          sysTeamId: this.currentVer.sysTeamId
        }
        this.$axios.post(editorRelease, body).then(res => {
          this.$emit('addVer')
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    if (this.perVersion) {
      Object.keys(this.perVersion).forEach(key => {
        let value = this.perVersion[key]
        this.$set(this.currentVer, key, value)
      })
      this.title = '编辑'
    } else {
      this.title = '添加'
    }
    // console.log(this._data)
  }
}
</script>

<style scoped>
.mr30 {
  margin-right: 30px;
}
.upload_area {
  width: 40%;
}
</style>
