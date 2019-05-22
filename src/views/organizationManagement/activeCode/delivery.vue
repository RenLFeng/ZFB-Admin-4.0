<template>
  <div>
    <el-dialog
      title="激活码申请"
      :visible="true"
      :before-close="deliveryHide"
      width="25%"
      :close-on-click-modal="false"
    >
      <el-form label-position="left" :model="applyForNum" ref="applyFor" :rules="rules">
        <el-form-item label="申请数量" label-width="100px" prop="devNumber">
          <el-input type="number" v-model="applyForNum.devNumber" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('applyFor')">提交申请</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'delivery',
  data() {
    const checkdevNumber = (rule, value, callback) => {
      value = Number(value)
      if (!value) {
        return callback(new Error('请输入申请数量'))
      }
      if (!Number.isInteger(value) || value < 1) {
        callback(new Error('申请数量只能为正整数'))
      } else {
        callback()
      }
    }
    return {
      applyForNum: {
        devNumber: ''
      },
      rules: { devNumber: [{ required: true, validator: checkdevNumber, trigger: 'blur' }] }
    }
  },
  methods: {
    deliveryHide() {
      this.$emit('deliverySuccess')
    },
    cancel() {
      this.$emit('cancelDelivery')
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.apply()
        } else {
          return false
        }
      })
    },
    async apply() {
      try {
        const res = await post({
          url: 'applyCode/apply',
          data: {
            number: this.applyForNum.devNumber
          }
        })
        this.$message({ type: 'success', message: res.data })
        this.deliveryHide()
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {}
}
</script>
<style scoped>
</style>
