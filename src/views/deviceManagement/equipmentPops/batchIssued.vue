<template>
  <el-dialog
    title="批次下发"
    :visible.sync="sentDown"
    width="38%"
    :before-close="issuedClose"
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
        <el-input type="number" v-model="batchData.startNo"></el-input>
      </el-form-item>
      <el-form-item>-</el-form-item>
      <el-form-item prop="endNo">
        <el-input type="number" v-model="batchData.endNo"></el-input>
      </el-form-item>
    </el-form>
    <div v-if="level === levelMap.PLATFORM">
      <el-radio v-model="profitStatus" :label="0" @change="recash">不参与返现奖励政策</el-radio>
      <el-radio v-model="profitStatus" :label="1" @change="recash">参与返现奖励政策</el-radio>
    </div>
    <!-- <el-checkbox v-model="profitStatus" :true-label="1" :false-labe="0">是否</el-checkbox> -->
    <div class="instructions">
      <h3>说明</h3>
      <p>为了降低人工下发出错的概率，每次下发都会生成批次，对每个设备编号进行检查是否异常</p>
      <p>先点击【生成批次】系统开始自动检查,此时设备并未真正下发,需进入【库存记录】查看检查结果管理员仔细检查下发信息是否有误.有误就操作【确定取消】;确认无误就操作【确定下发】</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">生成批次</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
import { levelMap } from '../../../server/level.js'
export default {
  name: 'batch-issued',
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
      sentDown: false,
      profitStatus: 0,
      manufacturerData: [],
      level: '',
      levelMap: levelMap,
      batchData: {
        devLength: '',
        prefixNo: '',
        startNo: '',
        endNo: '',
        toOrganId: '',
        factoryId: '',
        brandId: ''
      },
      rules: {
        toOrganId: [{ required: true, message: '请选择下级机构', trigger: 'change' }],
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addOutPosBath()
        } else {
          return false
        }
      })
    },
    clearBrandId() {
      this.batchData.brandId = ''
      this.batchData.devLength = ''
    },
    setDevlength() {
      this.devModelData.filter(item => {
        if (item.factoryId === this.batchData.factoryId) {
          this.batchData.devLength = item.brandLength
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
              factoryId: this.batchData.factoryId,
              brandId: this.batchData.brandId,
              profitStatus: this.profitStatus
            }
          })
          this.$emit('renewal')
          this.sentDown = false
          this.$confirm(
            `您将要下发${this.batchData.endNo -
              this.batchData.startNo +
              1}个设备，请稍等片刻后在【库存记录】中查看入库结果`,
            res.data,
            {
              type: 'success',
              showConfirmButton: false,
              showCancelButton: false,
              center: true
            }
          )
        } catch (err) {
          console.log(err)
        }
      }
    },
    cancel() {
      this.$emit('issuedClose')
    },
    issuedClose() {
      this.$emit('issuedClose')
    },
    renewal() {
      this.$emit('renewal')
    },
    recash() {
      const text =
        this.profitStatus === 0
          ? '确定该批设备不参与返现奖励政策？'
          : '确定该批设备参与返现奖励政策？'
      this.$alert(text)
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.sentDown = this.flag
    this.getmanufacturer()
  }
}
</script>
<style scoped>
.instructions {
  margin-top: 10px;
}
.instructions p {
  margin-top: 10px;
  text-indent: 2em;
}
</style>
