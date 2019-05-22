<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item label="选择活动" prop="ruleId">
        <el-select v-model="ruleForm.ruleId" placeholder="请选择活动">
          <el-option
            v-for="v in cashPledgeData.filter(v=>v.ruleStatus === 2)"
            :key="v.ruleId"
            :label="v.ruleName"
            :value="v.ruleId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">开 启</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { post } from '../../../../store/requestFacade.js'

export default {
  props: {
    type: {
      type: String,
      default: null
    },
    cashPledgeData: {
      type: Array,
      default: () => []
    },
    brandId: {
      type: Number,
      default: null
    },
    enableRuleNameId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      title: '',
      dialogVisible: true,
      ruleForm: {
        ruleId: ''
      },
      rules: {
        ruleId: { required: true, message: '请选择需开启的活动', trigger: 'change' }
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.type === 'open') {
            this.ruleEnable()
          } else {
            this.togglerRule()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async ruleEnable() {
      try {
        const res = await post({
          url: 'depositUser/ruleEnable',
          data: {
            ruleId: this.ruleForm.ruleId,
            brandId: this.brandId
          }
        })
        this.$message.success(res.data)
        this.$emit('updata')
      } catch (error) {
        console.log(error)
      }
    },
    async togglerRule() {
      try {
        const res = await post({
          url: 'depositUser/ruleSwitch',
          data: {
            ruleStart: this.ruleForm.ruleId,
            brandId: this.brandId,
            ruleEnd: this.enableRuleNameId
          }
        })
        this.$message.success(res.data)
        this.$emit('updata')
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.title = this.type === 'open' ? '开启活动' : '切换活动'
  }
}
</script>
<style scoped>
</style>