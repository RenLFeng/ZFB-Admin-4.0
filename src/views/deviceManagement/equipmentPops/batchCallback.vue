<template>
  <el-dialog
    title="批量回拨"
    :visible.sync="callback"
    width="38%"
    :before-close="callbackClose"
    :close-on-click-modal="false"
    @click="renewal"
  >
    <el-form :inline="true" :model="batchData" :rules="rules" ref="ruleForm">
      <el-form-item label="下级机构" prop="toOrganId">
        <el-select v-model="batchData.toOrganId" placeholder="请选择机构" style="width:480px">
          <el-option
            v-for="item in organizationData"
            :key="item.organId"
            :label="item.organName"
            :value="item.organId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备型号" prop="brandId">
        <el-select
          v-model="batchData.brandId"
          @change="setDevlength"
          placeholder="请选择型号"
          style="width:480px"
        >
          <el-option
            v-for="item in devModelData"
            :key="item.brandId"
            :label="item.brandSubName"
            :value="item.brandId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备编号前缀" prop="prefixNo">
        <el-input v-model="batchData.prefixNo"></el-input>
      </el-form-item>
      <el-form-item label="总长度" prop="devLength">
        <el-input v-model="batchData.devLength" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="设备编号区间" prop="startNo">
        <el-input v-model="batchData.startNo"></el-input>
      </el-form-item>
      <el-form-item>-</el-form-item>
      <el-form-item prop="endNo">
        <el-input v-model="batchData.endNo"></el-input>
      </el-form-item>
    </el-form>
    <div class="instructions">
      <h3>说明</h3>
      <p>为了降低人工回拨出错的概率，每次回拨都会生成批次，对每个设备编号进行检查是否异常</p>
      <p>先点击【生成批次】系统开始自动检查,此时设备并未真正回拨,需进入【库存记录】查看检查结果管理员仔细检查回拨信息是否有误.有误就操作【确定取消】;确认无误就操作【确认回拨】</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">生成批次</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'batch-callback',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    organizationData: {
      type: Array,
      default: () => []
    },
    devModelData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      callback: false,
      batchData: {
        devLength: '',
        prefixNo: '',
        startNo: '',
        endNo: '',
        factoryId: '',
        brandId: ''
      },
      rules: {
        toOrganId: [{ required: true, message: '请选择下级机构', trigger: 'change' }],
        brandId: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
        prefixNo: [{ required: true, message: '请输入设备编号前缀', trigger: 'blur' }],
        startNo: [{ required: true, message: '请输入设备编号区间(开始)', trigger: 'blur' }],
        endNo: [{ required: true, message: '请输入设备编号区间(结束)', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addOutPosBath()
        } else {
          return false
        }
      })
    },
    async addOutPosBath() {
      if (
        this.batchData.startNo.length + this.batchData.prefixNo.length >
        this.batchData.devLength
      ) {
        this.$message('超出设备编号总长度')
      } else {
        try {
          const res = await post({
            url: 'posBatch/addOutPosBath',
            data: {
              devLength: this.batchData.devLength,
              prefixNo: this.batchData.prefixNo,
              startNo: this.batchData.startNo,
              endNo: this.batchData.endNo,
              toOrganId: this.batchData.toOrganId,
              inOrganAccount: this.batchData.inOrganAccount
            }
          })
          this.$emit('renewal')
          this.callback = false
          this.$message({ message: res.data, type: 'success' })
        } catch (err) {
          console.log(err)
        }
      }
    },
    setDevlength() {
      console.log(this.devModelData)
      this.devModelData.filter(item => {
        if (item.brandId === this.batchData.brandId) {
          this.batchData.devLength = item.brandLength
        }
      })
    },
    cancel() {
      this.$emit('callbackClose')
    },
    callbackClose() {
      this.$emit('callbackClose')
    },
    renewal() {
      this.$emit('renewal')
    }
  },
  mounted() {
    this.callback = this.flag
  }
}
</script>
<style scoped>
.instructions p {
  margin-top: 10px;
  text-indent: 2em;
}
</style>
