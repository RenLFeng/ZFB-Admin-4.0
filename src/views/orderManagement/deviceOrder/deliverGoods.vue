<template>
  <div>
    <el-dialog
      title="订单发货"
      :visible.sync="showShipments"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="order">
        <el-form
          :model="deliverData"
          :rules="rules"
          ref="ruleForm"
          label-width="90px"
          label-position="right"
        >
          <el-form-item label="配送信息"></el-form-item>
          <div class="info">
            <el-form-item label="收货人">
              <span>{{shippingInfo.username}} {{shippingInfo.phone}}</span>
            </el-form-item>
            <el-form-item label="收货地址">
              <span>{{shippingInfo.address}}</span>
            </el-form-item>
            <el-form-item label="配送方式" prop="distributionType" style="margin-bottom: 5px;">
              <el-select v-model="deliverData.distributionType" placeholder="请选择配送方式" size="medium">
                <el-option label="当面配送" :value="1"></el-option>
                <el-option label="物流配送" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="快递单号"
              v-if="deliverData.distributionType === 2"
              prop="trackingNumber"
              style="margin-bottom: 10px;"
            >
              <el-input
                size="medium"
                v-model="deliverData.trackingNumber "
                style="width:300px;"
                placeholder="快递单号"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <p class="hint">提示：订单数量为{{shipmentsData.totalNum}}台，请选择{{shipmentsData.totalNum}}台设备</p>
            </el-form-item>
          </div>
          <el-form-item label="设备信息" prop="devNo">
            <el-select
              v-model="deliverData.devNo"
              placeholder="请添加设备编号"
              multiple
              style="width:75%"
              filterable
            >
              <el-option v-for="item in devNoData" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-button
              icon="el-icon-delete"
              type="text"
              class="del"
              @click="deliverData.devNo = []"
            >清空所有</el-button>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">发 货</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'deliver-goods',
  props: {
    toshow: {
      type: Boolean,
      default: false
    },
    shipmentsData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const devNoRule = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('请添加设备编号'))
      } else if (value.length !== this.shipmentsData.totalNum) {
        callback(
          new Error(
            `订单数量为${this.shipmentsData.totalNum}台，请选择${this.shipmentsData.totalNum}台设备`
          )
        )
      } else {
        callback()
      }
    }
    return {
      showShipments: false,
      deviceNo: '',
      shippingInfo: {},
      devNoData: [],
      deliverData: {
        trackingNumber: '',
        distributionType: '',
        devNo: []
      },
      rules: {
        distributionType: { required: true, message: '请选择配送方式', trigger: 'change' },
        trackingNumber: { required: true, message: '请输入快递单号', trigger: 'blur' },
        devNo: { required: false, validator: devNoRule, trigger: 'change' }
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('theShow', this.showShipments)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.shipments()
        } else {
          return false
        }
      })
    },
    // 获取详情
    async getoutDevice() {
      try {
        const res = await post({
          url: 'orderPos/outDevice',
          data: {
            orderNo: this.shipmentsData.payOrderId
          }
        })
        this.shippingInfo = res.data
        this.getDevNo()
      } catch (err) {
        console.log(err)
      }
    },
    // 获取设备号
    async getDevNo() {
      try {
        const res = await post({
          url: 'stock/getDevNo',
          data: {
            brandId: this.shippingInfo.brandId
          }
        })
        this.devNoData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 点击发货
    async shipments() {
      try {
        const res = await post({
          url: 'orderPos/confirmOut',
          data: {
            orderNo: this.shipmentsData.payOrderId,
            devNo: this.deliverData.devNo,
            trackingNumber: this.deliverData.trackingNumber,
            distributionType: this.deliverData.distributionType
          }
        })
        this.$emit('invoking', this.showShipments)
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    }
    // }
  },
  mounted() {
    this.getoutDevice()
    this.showShipments = this.toshow
  }
}
</script>
<style scoped>
.order {
  margin-top: -30px;
}
.el-form-item {
  font-weight: bold;
  margin-bottom: 0;
}
span,
p {
  font-weight: normal;
}
.hint {
  font-size: 12px;
  color: #f56c6c;
}
.info {
  margin-left: 30px;
}
.del {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
}
</style>
