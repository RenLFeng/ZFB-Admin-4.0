<template>
  <div>
    <div class="save">
      <el-form ref="form" label-width="200px" :label-position="labelPosition" :inline="true">
        <el-form-item label="设备还款分润费率">
          <el-tooltip content="只能输入整数或一位小数" placement="top" effect="light">
            <i class="el-icon-info" style="color:#e6a23c"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="万" label-width="30px">
          <el-input
            type="number"
            v-model="posPayFeeMinFee"
            @change="fixNumber({id:1,number:posPayFeeMinFee})"
          ></el-input>
        </el-form-item>
        <el-form-item>—</el-form-item>
        <el-form-item label="万" label-width="30px">
          <el-input
            type="number"
            v-model="posPayFeeMaxFee"
            @change="fixNumber({id:2,number:posPayFeeMaxFee})"
          ></el-input>
        </el-form-item>
        <br>
        <el-form-item label="设备收款分润费率">
          <el-tooltip content="只能输入整数或一位小数" placement="top" effect="light">
            <i class="el-icon-info" style="color:#e6a23c"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="万" label-width="30px">
          <el-input
            type="number"
            v-model="posRepayFeeMinFee"
            @change="fixNumber({id:3,number:posRepayFeeMinFee})"
          ></el-input>
        </el-form-item>
        <el-form-item>—</el-form-item>
        <el-form-item label="万" label-width="30px">
          <el-input
            type="number"
            v-model="posRepayFeeMaxFee"
            @change="fixNumber({id:4,number:posRepayFeeMaxFee})"
          ></el-input>
        </el-form-item>
        <br>
        <el-form-item label="快捷还款分润费率">
          <el-tooltip content="只能输入整数或一位小数" placement="top" effect="light">
            <i class="el-icon-info" style="color:#e6a23c"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="万" label-width="30px">
          <el-input
            type="number"
            v-model="quickPayFeeMinFee"
            @change="fixNumber({id:5,number:quickPayFeeMinFee})"
          ></el-input>
        </el-form-item>
        <el-form-item>—</el-form-item>
        <el-form-item label="万" label-width="30px">
          <el-input
            type="number"
            v-model="quickPayFeeMaxFee"
            @change="fixNumber({id:6,number:quickPayFeeMaxFee})"
          ></el-input>
        </el-form-item>
        <br>
        <el-form-item label="快捷收款分润费率">
          <el-tooltip content="只能输入整数或一位小数" placement="top" effect="light">
            <i class="el-icon-info" style="color: #e6a23c"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="万" label-width="30px">
          <el-input
            type="number"
            v-model="quickRepayFeeMinFee"
            @change="fixNumber({id:7,number:quickRepayFeeMinFee})"
          ></el-input>
        </el-form-item>
        <el-form-item>—</el-form-item>
        <el-form-item label="万" label-width="30px">
          <el-input
            type="number"
            v-model="quickRepayFeeMaxFee"
            @change="fixNumber({id:8,number:quickRepayFeeMaxFee})"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="saveFee">保存配置</el-button>
    </div>
  </div>
</template>
<script>
import { saveFee } from '../../../../server/Interface'
const obj = {
  posPayFee: {
    maxFee: 0,
    minFee: 0
  },
  posRepayFee: {
    maxFee: 0,
    minFee: 0
  },
  quickRepayFee: {
    maxFee: 0,
    minFee: 0
  },
  quickPayFee: {
    maxFee: 0,
    minFee: 0
  }
}
export default {
  name: 'sysem-fee-details',
  props: {
    feeData: {
      type: Object,
      default: function() {
        return obj
      }
    }
  },
  data() {
    return {
      labelPosition: 'left',
      posPayFeeMinFee: this.feeData.posPayFee.minFee,
      posPayFeeMaxFee: this.feeData.posPayFee.maxFee,
      posRepayFeeMinFee: this.feeData.posRepayFee.minFee,
      posRepayFeeMaxFee: this.feeData.posRepayFee.maxFee,
      quickPayFeeMinFee: this.feeData.quickPayFee.minFee,
      quickPayFeeMaxFee: this.feeData.quickPayFee.maxFee,
      quickRepayFeeMinFee: this.feeData.quickRepayFee.minFee,
      quickRepayFeeMaxFee: this.feeData.quickRepayFee.maxFee
    }
  },
  methods: {
    async saveFee() {
      const body = {
        type: this.feeData.type,
        posPayFee: {
          minFee: Number(this.posPayFeeMinFee),
          maxFee: Number(this.posPayFeeMaxFee)
        },
        posRepayFee: {
          minFee: Number(this.posRepayFeeMinFee),
          maxFee: Number(this.posRepayFeeMaxFee)
        },
        quickPayFee: {
          minFee: Number(this.quickPayFeeMinFee),
          maxFee: Number(this.quickPayFeeMaxFee)
        },
        quickRepayFee: {
          minFee: Number(this.quickRepayFeeMinFee),
          maxFee: Number(this.quickRepayFeeMaxFee)
        }
      }
      this.$axios.post(saveFee, body).then(res => {
        this.$message({
          type: 'success',
          message: res.data.data
        })
        this.$emit('feeUpdate')
      })
    },
    fixNumber(obj) {
      if (obj.id === 1) {
        this.posPayFeeMinFee = Number(obj.number).toFixed(1)
      }
      if (obj.id === 2) {
        this.posPayFeeMaxFee = Number(obj.number).toFixed(1)
      }
      if (obj.id === 3) {
        this.posRepayFeeMinFee = Number(obj.number).toFixed(1)
      }
      if (obj.id === 4) {
        this.posRepayFeeMaxFee = Number(obj.number).toFixed(1)
      }
      if (obj.id === 5) {
        this.quickPayFeeMinFee = Number(obj.number).toFixed(1)
      }
      if (obj.id === 6) {
        this.quickPayFeeMaxFee = Number(obj.number).toFixed(1)
      }
      if (obj.id === 7) {
        this.quickRepayFeeMinFee = Number(obj.number).toFixed(1)
      }
      if (obj.id === 8) {
        this.quickRepayFeeMaxFee = Number(obj.number).toFixed(1)
      }
    }
  },
  mounted() {}
}
</script>
<style scoped>
.save {
  width: 780px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
