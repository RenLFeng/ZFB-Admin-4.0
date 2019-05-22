<template>
  <el-dialog
    :title="title"
    :visible.sync="companyShow"
    width="20%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      :inline='true'
      label-width="100px"
      size="small"
    >
      <el-form-item label="公司名称">
        <el-input
          @input='checkCompany'
          v-model="channelCompany"
        ></el-input>
        <p
          style="color:#F56C6C"
          v-show="noteShow"
        >请输入公司名称</p>
      </el-form-item>
      <el-form-item label="公司别名">
        <el-input
          @input='checkCompayAlias'
          v-model="companyAlias"
        ></el-input>
        <p
          style="color:#F56C6C"
          v-show="noteShow2"
        >请输入公司别名</p>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        type="primary"
        @click="toConfirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { post } from '../../../store/requestFacade.js'

const CompanyType = {
  ADD: 1,
  EDIT: 2
}
export default {
  name: 'edit-company',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    companyEdit: {
      type: Object,
      default: () => {}
    },
    companytype: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      title: '',
      channelCompany: '',
      companyAlias: '',
      companyShow: false,
      noteShow: false,
      noteShow2: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    // 新 增
    async addCompany() {
      try {
        const res = await post({
          url: 'company/add',
          data: {
            channelCompany: this.channelCompany,
            companyAlias: this.companyAlias
          }
        })
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$emit('invite')
      } catch (error) {
        console.log(error)
      }
    },
    // 编 辑
    async editCompany() {
      try {
        const res = await post({
          url: 'company/edit',
          data: {
            channelCompany: this.channelCompany,
            companyAlias: this.companyAlias,
            companyId: this.companyEdit.companyId
          }
        })
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$emit('invite')
      } catch (error) {
        console.log(error)
      }
    },
    toConfirm() {
      if (this.channelCompany === '') {
        this.noteShow = true
      } else if (this.companyAlias === '') {
        this.noteShow2 = true
      } else if (!this.noteShow && !this.noteShow2) {
        if (this.companytype === CompanyType.EDIT) {
          this.editCompany()
        }
        if (this.companytype === CompanyType.ADD) {
          this.addCompany()
        }
      }
    },
    checkCompany() {
      if (this.channelCompany === '') {
        this.noteShow = true
      } else {
        this.noteShow = false
      }
    },
    checkCompayAlias() {
      if (this.companyAlias === '') {
        this.noteShow2 = true
      } else {
        this.noteShow2 = false
      }
    }
  },
  mounted() {
    this.companyShow = this.flag
    if (this.companytype === CompanyType.EDIT) {
      this.title = '编辑通道公司'
      this.channelCompany = this.companyEdit.channelCompany
      this.companyAlias = this.companyEdit.companyAlias
      return
    }
    if (this.companytype === CompanyType.ADD) {
      this.title = '新增通道公司'
    }
  }
}
</script>
<style scoped>
</style>
