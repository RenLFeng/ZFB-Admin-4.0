<template>
  <el-dialog title="新建厂商" :visible.sync="addFirmShow" width="20%" :before-close="handleClose" :close-on-click-modal="false">
    <el-form :inline='true' :model="firmData" label-width="100px" size="small">
      <el-form-item label="厂商名称">
        <el-input v-model="firmData.factoryName"></el-input>
      </el-form-item>
      <el-form-item label="厂商别名">
        <el-input v-model="firmData.factorySubName"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="clean">取 消</el-button>
      <el-button type="primary" @click="addFactoty">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'add-firm',
  props: {
    toshow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addFirmShow: false,
      firmData: {
        factoryName: '',
        factorySubName: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    clean() {
      this.$emit('handleClose')
    },
    async addFactoty() {
      if (this.firmData.factoryName === '' || !this.firmData.factorySubName === '') {
        this.$message('请将信息填写完整')
      } else {
        try {
          const res = await post({
            url: 'posFactory/addFactory',
            data: {
              factoryName: this.firmData.factoryName,
              factorySubName: this.firmData.factorySubName
            }
          })
          this.$emit('invoking')
          this.$message({ message: res.msg, type: 'success' })
        } catch (err) {
          console.log(err)
        }
      }
    }
  },
  mounted() {
    this.addFirmShow = this.toshow
  }
}
</script>
<style scoped>

</style>
