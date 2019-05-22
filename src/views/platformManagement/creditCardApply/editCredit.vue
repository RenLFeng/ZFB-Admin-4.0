<template>
  <div>
    <el-dialog
      :visible='true'
      :title="title"
      :before-close="clickClose"
    >
      <el-form
        label-width="100px"
        :rules='rules'
        :model='currentCredit'
        ref='crdForm'
      >
        <el-form-item
          label="序号"
          prop='soft'
        >
          <el-input
            v-model="currentCredit.soft"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="银行名称"
          prop='bankname'
        >
          <el-input
            v-model='currentCredit.bankname'
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-row style="padding-left:10px">
          <el-col style="padding:0 0 10px 50px;">Logo</el-col>
          <el-col
            :span='4'
            style="padding-left:50px"
          >
            <div class="grid-content bg-purple-light">
              <div class="logoBox">
                <img
                  class="logoPic"
                  @click="clickLogo($event)"
                  :src="currentCredit.imgUrl"
                >
                <input
                  type="file"
                  class="hidden_file_input"
                  @change="getlogo($event)"
                >
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="padding:0 0 20px 10px">
          <el-col style="padding:10px 0 10px 50px;">海报</el-col>
          <el-col
            :span='4'
            style="padding-left:50px"
          >
            <div class="grid-content bg-purple-light">
              <div class="posterBox">
                <img
                  class="posterPic"
                  @click="clickLogo($event)"
                  :src="currentCredit.bannerUrl"
                >
                <input
                  type="file"
                  class="hidden_file_input"
                  @change="getposter($event)"
                >
              </div>
            </div>
          </el-col>
        </el-row>
        <el-form-item
          label="推广描述"
          prop='details'
        >
          <el-input
            v-model='currentCredit.details'
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="链接地址"
          prop='webUrl'
        >
          <el-input
            v-model='currentCredit.webUrl'
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="text-indent:.8em"
          label="是否展示"
        >
          <el-radio-group v-model="currentCredit.exhibition">
            <el-radio
              v-for="v in getExhibition"
              :label='v.id'
              :key="v.id"
            >{{v.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          style="text-indent:.8em"
          label="是否推荐"
        >
          <el-radio-group v-model="currentCredit.recommend">
            <el-radio
              v-for="v in getRecommend"
              :label='v.id'
              :key="v.id"
            >{{v.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :loading="btnStatus"
          :disabled="btnValid"
          type="primary"
          @click="actCredit('crdForm')"
        > 保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getExhibition, getRecommend } from '../own/credit.js'
import { postWithFile } from '../../../store/requestFacade.js'
import { img } from '../../../core'
export default {
  props: {
    creditInfo: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      getExhibition: getExhibition,
      getRecommend: getRecommend,
      btnStatus: false,
      btnValid: false,
      title: '',
      logoPic: '',
      poster: '',
      currentCredit: {
        soft: '',
        bankname: '',
        imgUrl: '',
        details: '',
        exhibition: 1,
        recommend: 1,
        webUrl: '',
        bannerUrl: '',
        applyId: ''
      },
      rules: {
        soft: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        bankname: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
        details: [{ required: true, message: '请输入推广描述', trigger: 'blur' }],
        webUrl: [{ required: true, message: '请输入链接地址', trigger: 'blur' }]
      }
    }
  },
  methods: {
    actCredit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.creditInfo) {
            this.editCredit()
          } else {
            this.addCredit()
          }
        } else {
          return false
        }
      })
    },
    clickClose() {
      this.$emit('creditHide')
    },
    // 上传logo
    clickLogo(e) {
      e.currentTarget.nextElementSibling.click()
    },
    getlogo(e) {
      const [logoPic] = e.currentTarget.files
      this.logoPic = logoPic
      const isLt3M = logoPic.size / 1024 / 1024
      if (isLt3M > 3) {
        this.btnValid = true
        this.$message({
          type: 'info',
          message: '上传图片大小不能超过3M'
        })
      } else {
        this.btnValid = false
      }
    },
    // 海报
    getposter(e) {
      const [poster] = e.currentTarget.files
      this.poster = poster
      const isLt3M = poster.size / 1024 / 1024
      if (isLt3M > 3) {
        this.btnValid = true
        this.$message({
          type: 'info',
          message: '上传图片大小不能超过3M'
        })
      } else {
        this.btnValid = false
      }
    },
    // 添加信用卡
    async addCredit() {
      this.btnStatus = true
      try {
        const res = await postWithFile({
          url: 'BackCreditcardApply/add',
          data: {
            bankname: this.currentCredit.bankname,
            webUrl: this.currentCredit.webUrl,
            soft: this.currentCredit.soft,
            exhibition: this.currentCredit.exhibition,
            recommend: this.currentCredit.recommend,
            details: this.currentCredit.details
          },
          fileForm: {
            bankLogo: this.logoPic,
            bankBanner: this.poster
          }
        })
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.btnStatus = false
        this.$emit('modifyCredit')
      } catch (err) {
        this.btnStatus = false
        console.log(err)
      }
    },
    // 编辑信用卡
    async editCredit() {
      this.btnStatus = true
      try {
        const res = await postWithFile({
          url: 'BackCreditcardApply/edit',
          data: {
            applyId: this.currentCredit.applyId,
            bankname: this.currentCredit.bankname,
            webUrl: this.currentCredit.webUrl,
            soft: this.currentCredit.soft,
            exhibition: this.currentCredit.exhibition,
            recommend: this.currentCredit.recommend,
            details: this.currentCredit.details
          },
          fileForm: {
            bankLogo: this.logoPic,
            bankBanner: this.poster
          }
        })
        this.btnStatus = false
        this.$emit('modifyCredit')
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        this.btnStatus = false
      }
    }
  },
  mounted() {
    if (!this.creditInfo) {
      this.title = '新建'
    } else {
      this.title = '编辑'
      Object.keys(this.creditInfo).forEach(key => {
        let value = this.creditInfo[key]
        this.$set(this.currentCredit, key, value)
      })
    }
  },
  watch: {
    async logoPic(newVal, oldVal) {
      this.currentCredit.imgUrl = await img.readFile(newVal)
    },
    async poster(newVal, oldVal) {
      this.currentCredit.bannerUrl = await img.readFile(newVal, oldVal)
    }
  }
}
</script>
<style scoped>
.logoBox {
  width: 60px;
  height: 60px;
  border: 1px solid #ccc;
  position: relative;
}
.posterBox {
  width: 300px;
  height: 150px;
  border: 1px solid #ccc;
  position: relative;
}
.logoPic,
.posterPic {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
img[src=''] {
  opacity: 0;
}
.hidden_file_input {
  display: none;
}
</style>
