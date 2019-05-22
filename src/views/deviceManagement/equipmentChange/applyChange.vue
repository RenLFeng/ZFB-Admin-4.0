<template>
  <div style="padding:20px 0 0 20px">
    <el-button size="small" icon="el-icon-arrow-left" @click="goback">返回</el-button>
    <el-form :model="changeInfo" :rules="rules" ref="changeForm">
      <el-row :gutter="16" style="margin:0">
        <el-col :span="8">
          <el-form-item label="原设备编号" prop="devNo">
            <el-input type="number" v-model="changeInfo.devNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2" style="margin-top:45px;text-align:center">
          <i class="el-icon-lx-qiehuan" style="font-size:32px"></i>
        </el-col>
        <el-col :span="8">
          <el-form-item label="新设备编号" prop="newDevNo">
            <el-input type="number" v-model="changeInfo.newDevNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="换机类型" prop="type">
        <el-radio-group v-model="changeInfo.type">
          <el-radio v-for="o in changeType" :label="o.id" :key="o.id">{{o.value}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="换机原因" prop="reason">
        <el-input type="textarea" style="width:1200px" :rows="4" v-model="changeInfo.reason"></el-input>
      </el-form-item>
      <el-form-item style="text-align:center">
        <el-button type="primary" @click="getInfo('changeForm')">申请换机</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="申请换机" :close-on-click-modal="false" :before-close="close" :visible="isChange">
      <el-row :gutter="18">
        <el-col :span="9">
          <p style="padding-bottom:10px">原设备编号 {{changeInfo.devNo}}</p>
          <el-card class="box-card">
            <div class="cardDiv">
              设备型号
              <span>{{deviceData.brandType}}</span>
            </div>
            <div class="cardDiv">
              激活状态
              <span>{{deviceData.activateStatus}}</span>
            </div>
            <div class="cardDiv">
              所属机构
              <span>{{deviceData.organ}}</span>
            </div>
            <div class="cardDiv">
              所属合伙人
              <span>{{deviceData.partner}}</span>
            </div>
            <div class="cardDiv">
              所属用户
              <span>{{deviceData.user}}</span>
            </div>
            <div class="cardDiv">
              下发时间
              <span>{{deviceData.purchaseDate}}</span>
            </div>
            <div class="cardDiv">
              激活时间
              <span>{{deviceData.activateDate}}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="9">
          <p style="padding-bottom:10px">新设备编号 {{changeInfo.newDevNo}}</p>
          <el-card class="box-card">
            <div class="cardDiv">
              设备型号
              <span>{{newDeviceData.brandType}}</span>
            </div>
            <div class="cardDiv">
              激活状态
              <span>{{newDeviceData.activateStatus}}</span>
            </div>
            <div class="cardDiv">
              所属机构
              <span>{{newDeviceData.organ}}</span>
            </div>
            <div class="cardDiv">
              所属合伙人
              <span>{{newDeviceData.partner}}</span>
            </div>
            <div class="cardDiv">
              所属用户
              <span>无</span>
            </div>
            <div class="cardDiv">
              下发时间
              <span>无</span>
            </div>
            <div class="cardDiv">
              激活时间
              <span>无</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4" style="color:red;padding:50px 0 0 0">
          <div class="noteDiv">
            <p v-show="deviceData.brandType != newDeviceData.brandType">
              <span class="el-icon-error"></span>设备型号不一致
            </p>
          </div>
          <div class="noteDiv">
            <p v-show="newDeviceData.status === 1">
              <span class="el-icon-error"></span>该设备已激活
            </p>
          </div>
          <div class="noteDiv">
            <p v-show="deviceData.organ != newDeviceData.organ">
              <span class="el-icon-error"></span>所属机构不一致
            </p>
          </div>
          <div class="noteDiv">
            <p v-show="deviceData.partner != newDeviceData.partner&&newDeviceData.partner!='无'">
              <span class="el-icon-error"></span>所属合伙人不一致
            </p>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modify">返回修改</el-button>
        <el-button type="primary" :disabled="canApply" @click="toApply()">提交申请</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
import { activateStatus } from '../own/status.js'
import { formateTime } from '../../../util.js'
export default {
  name: 'apply-change',
  data() {
    return {
      canApply: false,
      isChange: false,
      changeInfo: {
        devNo: '',
        newDevNo: '',
        type: 0,
        reason: ''
      },
      deviceData: {
        brandType: '',
        activateStatus: '',
        organ: '',
        partner: '',
        user: '',
        purchaseDate: '',
        activateDate: ''
      },
      newDeviceData: {
        status: '',
        brandType: '',
        activateStatus: '',
        organ: '',
        partner: ''
      },
      changeType: [
        {
          id: 0,
          value: '故障机'
        },
        {
          id: 1,
          value: '非故障机'
        }
      ],
      rules: {
        devNo: { required: true, message: '请输入原设备编号', trigger: 'blur' },
        newDevNo: { required: true, message: '请输入新设备编号', trigger: 'blur' },
        reason: { required: true, message: '请输入换机原因', trigger: 'blur' },
        type: { required: true, message: '请选择换机类型', trigger: 'change' }
      }
    }
  },
  methods: {
    getInfo(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.isChange = true
          this.judge()
        } else {
          return false
        }
      })
    },
    async judge() {
      await this.deviceInfo()
      await this.newDeviceInfo()
      if (
        this.deviceData.brandType === this.newDeviceData.brandType &&
        this.newDeviceData.status === 0 &&
        this.deviceData.organ === this.newDeviceData.organ &&
        (this.deviceData.partner === this.newDeviceData.partner ||
          this.newDeviceData.partner === '无')
      ) {
        this.canApply = false
      } else {
        this.canApply = true
      }
    },
    close() {
      this.isChange = false
    },
    goback() {
      this.$emit('goback')
    },
    async toApply() {
      const res = await post({
        url: 'device/oper/add',
        data: {
          devNo: this.changeInfo.devNo,
          newDevNo: this.changeInfo.newDevNo,
          operType: 2,
          enabled: this.changeInfo.type,
          remark: this.changeInfo.reason
        }
      })
      this.$message({
        type: 'success',
        message: res.msg
      })
      this.isChange = false
      this.$emit('fresh')
    },
    // 原设备信息
    async deviceInfo() {
      if (this.changeInfo.devNo) {
        try {
          const res = await post({
            url: 'device/oper/device',
            data: {
              devNo: this.changeInfo.devNo
            }
          })
          if (res.data) {
            this.deviceData.brandType = res.data.brandType
            this.deviceData.organ = `${res.data.oneOrganName}(${res.data.oneOrganAccount})`
            this.deviceData.activateStatus = activateStatus[res.data.activityStatus]
            this.deviceData.partner = `${res.data.partner}(${res.data.partnerAccount})`
            this.deviceData.user = `${res.data.username}(${res.data.userAccount})`
            this.deviceData.purchaseDate = formateTime(res.data.purchaseDate)
            this.deviceData.activateDate = formateTime(res.data.activateDate)
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    async newDeviceInfo() {
      if (this.changeInfo.newDevNo) {
        try {
          const res = await post({
            url: 'device/oper/device',
            data: {
              devNo: this.changeInfo.newDevNo
            }
          })
          if (res.data) {
            this.newDeviceData.brandType = res.data.brandType
            this.newDeviceData.organ = `${res.data.oneOrganName}(${res.data.oneOrganAccount})`
            this.newDeviceData.status = res.data.activityStatus
            this.newDeviceData.activateStatus = activateStatus[res.data.activityStatus]
            this.newDeviceData.partner = res.data.partner
              ? `${res.data.partner}(${res.data.partnerAccount})`
              : '无'
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    modify() {
      this.isChange = false
      this.deviceData = {
        brandType: '',
        activateStatus: '',
        organ: '',
        partner: '',
        user: '',
        purchaseDate: '',
        activateDate: ''
      }
      this.newDeviceData = {
        brandType: '',
        activateStatus: '',
        status: '',
        organ: '',
        partner: ''
      }
    }
  }
}
</script>
<style scoped lang='scss'>
@import './style.scss';
</style>