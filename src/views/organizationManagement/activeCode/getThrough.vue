<template>
  <el-dialog
    title="审核通过"
    :visible.sync="throughShow"
    width="30%"
    :before-close="cancel"
    :close-on-click-modal="false"
  >
    <el-form :model="throughData" ref="pass" :rules="rules">
      <el-form-item label="申请机构" label-width="100px">
        <el-input v-model="Application.applyOrganName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="申请数量" label-width="100px">
        <el-input v-model="Application.applyNumber" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="下发数量" label-width="100px" prop="number">
        <el-input
          :placeholder="level !== levelMap.PLATFORM? hint : ''"
          v-model="throughData.number"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" label-width="100px">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3}"
          v-model="throughData.remarks"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="passClick('pass')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
import { levelMap } from '../../../server/level.js'
export default {
  name: 'get-through',
  props: {
    Application: {
      type: Object,
      default: () => {}
    },
    stockNumber: {
      type: Number,
      default: null
    }
  },
  data() {
    const checkStockNumber = (rule, value, callback) => {
      value = Number(value)
      if (!value) {
        return callback(new Error('请输入下发数量'))
      }
      if (!Number.isInteger(value) || value < 1) {
        callback(new Error('下发数量只能为正整数'))
      } else {
        if (value > this.Application.applyNumber) {
          callback(new Error('不能超过申请数量'))
        }
        if (this.level !== this.levelMap.PLATFORM) {
          if (value > this.stockNumber) {
            callback(new Error(`库存不足，最多只能下发${this.stockNumber}个`))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    return {
      hint: `最多可下发${this.stockNumber}个`,
      level: '',
      levelMap,
      throughShow: true,
      throughData: {
        number: '',
        remarks: ''
      },
      rules: {
        number: [{ required: true, validator: checkStockNumber, trigger: 'blur' }]
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('toThroughShow')
    },
    passClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.confirmOut()
        } else {
          return false
        }
      })
    },
    async confirmOut() {
      console.log(this.Application)
      try {
        const res = await post({
          url: 'codeOut/confirmOut',
          data: {
            applyId: this.Application.applyId,
            toOrganId: this.Application.applyOrganId,
            toOrganName: this.Application.applyOrganName,
            applyNumber: this.Application.applyNumber,
            number: this.throughData.number,
            remark: this.throughData.remarks
          }
        })
        this.$message({
          type: 'success',
          message: res.data
        })
        this.$emit('toThroughSuccess')
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
  }
}
</script>
