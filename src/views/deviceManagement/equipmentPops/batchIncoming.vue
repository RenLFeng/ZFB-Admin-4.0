<template>
  <div>
    <el-dialog
      title="批次入库"
      :visible.sync="batchIncoming"
      width="40%"
      :before-close="comingClose"
      :close-on-click-modal="false"
      @click="renewal"
    >
      <el-form :inline="true" :model="batchData" :rules="rules" ref="ruleForm">
        <el-form-item label="设备厂商" prop="factoryId">
          <el-select
            @change="clearBrandId"
            v-model="batchData.factoryId"
            placeholder="请选择厂商"
            style="width:480px"
          >
            <el-option
              v-for="item in manufacturerData"
              :key="item.brandId"
              :label="item.factorySubName"
              :value="item.factoryId"
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
              v-for="item in selectDevModel"
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
        <p>为了降低人工入库出错的概率，每次入库都会生成批次，对每个设备编号进行检查是否异常</p>
        <p>先点击【生成批次】系统开始自动检查,此时设备并未真正入库,需进入【库存批次】查看检查结果管理员仔细检查入库信息是否有误.有误就操作【确定取消】;确认无误就操作【确定入库】</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">生成批次</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'batch-incoming',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    devModelData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      batchIncoming: false,
      manufacturerData: [],
      batchData: {
        factoryId: '',
        brandId: '',
        devLength: '',
        prefixNo: '',
        startNo: '',
        endNo: ''
      },
      rules: {
        factoryId: [{ required: true, message: '请选择设备厂商', trigger: 'change' }],
        brandId: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
        prefixNo: [{ required: true, message: '请输入设备编号前缀', trigger: 'blur' }],
        startNo: [{ required: true, message: '请输入设备编号区间(开始)', trigger: 'blur' }],
        endNo: [{ required: true, message: '请输入设备编号区间(结束)', trigger: 'blur' }]
      }
    }
  },
  computed: {
    // 根据厂商筛选对应的设备型号
    selectDevModel() {
      return this.devModelData.filter(item => {
        return item.factoryId === this.batchData.factoryId
      })
    }
  },
  methods: {
    clearBrandId() {
      this.batchData.brandId = ''
      this.batchData.devLength = ''
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addPutPosBath()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取厂商
    async getmanufacturer() {
      try {
        const res = await post({
          url: 'posFactory/queryFactory'
        })
        this.manufacturerData = res.data
      } catch (err) {
        console.log(err)
      }
    },
    setDevlength() {
      this.devModelData.filter(item => {
        if (item.factoryId === this.batchData.factoryId) {
          this.batchData.devLength = item.brandLength
        }
      })
    },
    // 生成批次
    async addPutPosBath() {
      if (
        this.batchData.startNo.length + this.batchData.prefixNo.length >
        this.batchData.devLength
      ) {
        this.$message('超出设备编号总长度')
      } else {
        try {
          const res = await post({
            url: 'posBatch/addPutPosBath',
            data: {
              factoryId: this.batchData.factoryId,
              brandId: this.batchData.brandId,
              devLength: this.batchData.devLength,
              prefixNo: this.batchData.prefixNo,
              startNo: this.batchData.startNo,
              endNo: this.batchData.endNo
            }
          })
          this.$emit('renewal')
          this.batchIncoming = false
          this.$confirm(
            `您共需要入库${this.batchData.endNo -
              this.batchData.startNo +
              1}个设备,请稍等片刻后在【库存批次】中查看入库结果`,
            res.data,
            {
              type: 'success',
              showConfirmButton: false,
              showCancelButton: false,
              center: true
            }
          ).catch(_ => {})
        } catch (err) {
          console.log(err)
        }
      }
    },
    cancel() {
      this.$emit('comingClose')
      this.batchIncoming = false
    },
    comingClose() {
      this.$emit('comingClose')
      this.batchIncoming = false
    },
    renewal() {
      this.$emit('renewal')
    }
  },
  mounted() {
    this.batchIncoming = this.flag
    this.getmanufacturer()
  }
}
</script>
<style scoped>
.instructions p {
  margin-top: 10px;
  text-indent: 2em;
}
</style>
