<template>
  <div>
    <el-dialog
      title="激活码回拨"
      :visible="true"
      :before-close="recallHide"
      width="25%"
      :close-on-click-modal="false"
    >
      <el-form label-position="left" :model="callbackData" ref="callback" :rules="rules">
        <el-form-item label="回拨机构" label-width="100px" prop="organId">
          <el-select
            v-model="callbackData.organId"
            filterable
            placeholder="请选择机构"
            @change="callbackNum"
          >
            <el-option
              v-for="item in organizationList"
              :label="item.organName"
              :value="item.organId"
              :key="item.index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回拨数量" label-width="100px" prop="recallNumber">
          <el-input
            type="number"
            v-model="callbackData.recallNumber"
            autocomplete="off"
            :placeholder="hint"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="100px" prop="remarks">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3}"
            v-model="callbackData.remarks"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('callback')">回拨</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'recall',
  data() {
    var checkAge = (rule, value, callback) => {
      value = Number(value)
      if (!value) {
        return callback(new Error('请输入回拨数量'))
      }
      if (!Number.isInteger(value) || value < 1) {
        callback(new Error('回拨个数只能为正整数'))
      } else if (value > this.hintNum) {
        callback(new Error(`最多只能回拨${this.hintNum}个`))
      } else {
        callback()
      }
    }
    return {
      hint: '最多可回拨0个',
      hintNum: '',
      organizationList: [],
      callbackData: {
        organId: '',
        recallNumber: '',
        remarks: ''
      },
      rules: {
        organId: [{ required: true, message: '请选择回拨机构', trigger: 'change' }],
        recallNumber: [{ required: true, validator: checkAge, trigger: 'blur' }],
        remarks: [{ required: true, message: '请输入备注信息', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.codeCallBack()
        } else {
          return false
        }
      })
    },
    async codeCallBack() {
      try {
        const res = await post({
          url: 'codeCallBack/codeCallBack',
          data: {
            organId: this.callbackData.organId,
            number: this.callbackData.recallNumber,
            remark: this.callbackData.remarks
          }
        })
        this.recallHide()
        this.$message({
          type: 'success',
          message: res.data
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 获取机构库存列表
    async getorganization() {
      try {
        const res = await post({
          url: 'codeOut/organStock'
        })
        this.organizationList = res.data
      } catch (err) {
        console.log(err)
      }
    },
    callbackNum() {
      this.organizationList.map(item => {
        if (this.callbackData.organId === item.organId) {
          this.hint = `最多可回拨${item.stock}个`
          this.hintNum = item.stock
        }
      })
    },
    recallHide() {
      this.$emit('recallSuccess')
    },
    cancel() {
      this.$emit('cancelRecall')
    }
  },
  computed: {},
  mounted() {
    this.getorganization()
  }
}
</script>
<style scoped>
</style>
