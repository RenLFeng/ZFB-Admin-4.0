<template>
  <div>
    <el-dialog
      width="40%"
      :close-on-click-modal="false"
      :visible="true"
      :before-close="close"
      title="申请撤机"
    >
      <el-form :model="applyData" :rules="rules" ref="applyForm" label-width="100px">
        <el-form-item label="设备编号" prop="devNo">
          <el-input clearable v-model="applyData.devNo"></el-input>
        </el-form-item>
        <el-form-item label="回拨原因" prop="reason">
          <el-input clearable v-model="applyData.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="getDeviceInfo('applyForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      width="40%"
      :close-on-click-modal="false"
      :visible="isNext"
      :before-close="handleClose"
      title="申请撤机"
    >
      <el-card class="box-card">
        <div>
          设备编号
          <span style="padding:0 0 0 10px;">{{applyData.devNo}}</span>
        </div>
        <div>
          设备型号
          <span style="padding:0 0 0 10px;">{{deviceData.brandType}}</span>
        </div>
        <div>
          激活状态
          <span style="padding:0 0 0 10px;">{{deviceData.activateStatus}}</span>
        </div>
        <div>
          所属机构
          <span style="padding:0 0 0 10px;">{{deviceData.organ}}</span>
        </div>
        <div>
          所属合伙人
          <span style="padding:0 0 0 10px;">{{deviceData.partner}}</span>
        </div>
        <div>
          所属用户
          <span style="padding:0 0 0 10px;">{{deviceData.user}}</span>
        </div>
        <div>
          回拨原因
          <span style="padding:0 0 0 10px;">{{applyData.reason}}</span>
        </div>
      </el-card>

      <span slot="footer" class="dialog-footer">
        <el-button @click="modify">返回修改</el-button>
        <el-button type="primary" :disabled="canApply" @click="toApply()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
import { activateStatus } from '../own/status.js'
export default {
  data() {
    return {
      canApply: true,
      isNext: false,
      applyData: {
        devNo: '',
        reason: ''
      },
      deviceData: {
        brandType: '',
        activateStatus: '',
        organ: '',
        partner: '',
        user: ''
      },
      rules: {
        devNo: { required: true, message: '请输入设备编号', trigger: 'blur' },
        reason: { required: true, message: '请输入回拨原因', trigger: 'blur' }
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleClose() {
      this.isNext = false
    },
    async toApply() {
      // 调用申请撤机的接口及关闭两个弹窗和刷新
      const res = await post({
        url: 'device/oper/add',
        data: {
          operType: 1,
          devNo: this.applyData.devNo,
          enabled: 1,
          remark: this.applyData.reason
        }
      })
      this.$message({
        type: 'success',
        message: res.msg
      })
      this.isNext = false
      this.$emit('fresh')
    },
    getDeviceInfo(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.isNext = true
          this.deviceInfo()
        } else {
          return false
        }
      })
    },
    async deviceInfo() {
      try {
        const res = await post({
          url: 'device/oper/device',
          data: {
            devNo: this.applyData.devNo
          }
        })
        if (res.data) {
          this.canApply = false
          this.deviceData.brandType = res.data.brandType
          this.deviceData.organ = `${res.data.oneOrganName}(${res.data.oneOrganAccount})`
          this.deviceData.activateStatus = activateStatus[res.data.activityStatus]
          this.deviceData.partner = `${res.data.partner}(${res.data.partnerAccount})`
          this.deviceData.user = `${res.data.username}(${res.data.userAccount})`
        } else {
          this.canApply = true
        }
      } catch (err) {
        this.canApply = true
        console.log(err)
      }
    },
    modify() {
      this.isNext = false
      this.deviceData = {
        brandType: '',
        organ: '',
        activateStatus: '',
        partner: '',
        user: ''
      }
    }
  }
}
</script>
<style scoped>
</style>