<template>
  <div>
    <el-dialog :title="title" :before-close="bankHide" :visible="true">
      <el-form
        size="small"
        :rules="rules"
        ref="bankForm"
        :model="currentBank"
        class="demo-form-inline"
      >
        <el-form-item label="银行名称" label-width="80px" prop="btName">
          <el-input v-model="currentBank.btName"></el-input>
        </el-form-item>
        <el-form-item label="银行编码" label-width="80px" prop="btCode">
          <el-input v-model="currentBank.btCode"></el-input>
        </el-form-item>
        <el-form-item style="text-indent:.8em" label="是否显示">
          <el-radio-group v-model="currentBank.isUse">
            <el-radio v-for="v in useStatus" :label="v.id" :key="v.id">{{v.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支持" style="text-indent:.8em;">
          <!-- <el-checkbox
            v-model="currentBank.onLine"
            :true-label="0"
            :false-label="1"
            style="padding-left:28px"
          >线上交易</el-checkbox>-->
          <el-checkbox v-model="currentBank.offline" :true-label="0" :false-label="1">线下交易</el-checkbox>
        </el-form-item>
        <el-row style="padding-left:10px">
          <el-col style="padding-bottom:10px">Logo</el-col>
          <el-col>
            <div class="grid-content bg-purple-light">
              <div class="logoBox">
                <img :class="[{ 'active': currentBank.isUpload }, 'logoPic']" @click="clickLogo($event)" :src="currentBank.bankLogo">
                <input type="file" class="hidden_file_input" @change="getlogo($event)">
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="actBank('bankForm')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { useStatus } from './own/bank.js'
import { postWithFile } from '../../store/requestFacade.js'
import { img } from '../../core'
export default {
  props: {
    bankData: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      useStatus: useStatus,
      title: '',
      currentBank: {
        btCode: '',
        bankId: '',
        bankLogo: '',
        isUpload:false,
        btName: '',
        isUse: 1,
        offline: 0
        // onLine: 0
      },
      logoPic: '',
      rules: {
        btName: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
        btCode: [{ required: true, message: '请输入银行编码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    actBank(formName) {
      if (this.currentBank.offline === 1 && this.currentBank.onLine === 1) {
        this.$message({
          type: 'warning',
          message: '线上交易和线下交易，请至少选择其中一种'
        })
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.bankData) {
              this.editBank()
            } else {
              this.addBank()
            }
          } else {
            return false
          }
        })
      }
    },
    bankHide() {
      this.$emit('bankHide')
    },
    // 上传logo
    clickLogo(e) {
      e.currentTarget.nextElementSibling.click()
    },
    getlogo(e) {
      console.log(e);
      const [logoPic] = e.currentTarget.files
      this.logoPic = logoPic
    },
    // 添加银行
    async addBank() {
      try {
        const res = await postWithFile({
          url: 'queryListBankTrunk/add',
          data: {
            btCode: this.currentBank.btCode,
            btName: this.currentBank.btName,
            offline: this.currentBank.offline,
            // onLine: this.currentBank.onLine,
            isUse: this.currentBank.isUse
          },
          fileForm: {
            bankLogo: this.logoPic
          }
        })
        this.$emit('addBank')
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑银行
    async editBank() {
      try {
        const res = await postWithFile({
          url: 'queryListBankTrunk/edit',
          data: {
            btCode: this.currentBank.btCode,
            bankId: this.currentBank.bankId,
            btName: this.currentBank.btName,
            offline: this.currentBank.offline,
            // onLine: this.currentBank.onLine,
            isUse: this.currentBank.isUse
          },
          fileForm: {
            bankLogo: this.logoPic
          }
        })
        this.$emit('addBank')
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  watch: {
    async logoPic(newVal, oldVal) {
      console.log(img.readFile(newVal))
      this.currentBank.bankLogo = await img.readFile(newVal);
      this.currentBank.isUpload=true;
    }
  },
  mounted() {
    if (!this.bankData) {
      this.title = '新建'
    } else {
      this.$set(this.currentBank, 'bankLogo', this.bankData.imgUrl)
      Object.keys(this.bankData).forEach(key => {
        let value = this.bankData[key]
        this.$set(this.currentBank, key, value)
      })
      this.title = '编辑'
      this.currentBank.isUpload=true;
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
.logoPic {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
img[src=''] {
  opacity: 0;
}
img.active.logoPic{
  opacity: 1;
}
.hidden_file_input {
  display: none;
}
</style>
