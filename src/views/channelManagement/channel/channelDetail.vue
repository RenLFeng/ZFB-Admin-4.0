<template>
  <div>
    <div class="btn">
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        @click="toback"
        size="small"
      >返回</el-button>
      <el-button
        type="primary"
        size="small"
        style="float: right"
        @click="addChannelInfo('channelForm')"
      >保存</el-button>
    </div>
    <div class="channelDetail">
      <el-tag style="margin-bottom: 15px">{{title}}</el-tag>
      <el-form
        label-width="150px"
        ref="channelForm"
        :model="channelInfo"
        :rules='rules'
      >
        <el-row :gutter="20">

          <el-col :span="8">
            <el-form-item
              label="通道名称"
              prop="channelRealName"
            >
              <el-input
                v-model="channelInfo.channelRealName"
                size="small"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="通道别名"
              prop='channelName'
            >
              <el-input
                v-model="channelInfo.channelName"
                size="small"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="通道编号"
              prop="channelCode"
            >
              <el-input
                v-model="channelInfo.channelCode"
                size="small"
                style="width:200px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="通道公司"
              prop="companyId"
            >
              <el-select
                v-model="channelInfo.companyId"
                placeholder="请选择"
                style="width:200px"
                size="small"
              >
                <el-option
                  v-for="(item,index) in companyData"
                  :key="index"
                  :label="item.companyAlias"
                  :value="item.companyId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="绑卡鉴权类型">
              <el-radio-group v-model="channelInfo.authType">
                <el-radio :label="3">免验证</el-radio>
                <el-radio :label="0">验证码</el-radio>
                <el-radio :label="1">链接</el-radio>
                <el-radio :label="2">H5Code</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="消费鉴权类型">
              <el-radio-group v-model="channelInfo.consumeType">
                <el-radio :label="3">免验证</el-radio>
                <el-radio :label="0">验证码</el-radio>
                <el-radio :label="1">链接</el-radio>
                <el-radio :label="2">H5Code</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="鉴权手续费"
              prop='authFee'
            >
              <el-input
                type="number"
                v-model="channelInfo.authFee"
                size="small"
                style="width:180px"
              ></el-input> 元
            </el-form-item>
            <el-form-item
              label="绑卡限制数量"
              prop='bindCardLimit'
            >
              <el-input
                type="number"
                v-model="channelInfo.bindCardLimit"
                size="small"
                style="width:180px"
              ></el-input> 张
            </el-form-item>
            <el-form-item
              label="交易时间"
              required
            >
              <el-col :span="8">
                <el-form-item prop='startTime'>
                  <el-input
                    size="small"
                    type="number"
                    style="width:80px"
                    v-model="channelInfo.startTime"
                    placeholder="请输入交易开始时间"
                  >
                  </el-input> 时
                </el-form-item>
              </el-col>
              <el-col
                class="line"
                :span="2"
              >-</el-col>
              <el-col :span="8">
                <el-form-item prop='endTime'>
                  <el-input
                    type="number"
                    size="small"
                    style="width:80px"
                    v-model="channelInfo.endTime"
                    placeholder="请输入交易结束时间"
                  >
                  </el-input> 时
                </el-form-item>
              </el-col>
            </el-form-item>

            <el-form-item
              label="单日代付限额"
              v-if="channelType === 2"
              prop="dayMaxPaymentAmount"
            >
              <el-input
                type="number"
                v-model="channelInfo.dayMaxPaymentAmount"
                size="small"
                style="width:180px"
              ></el-input> 元
            </el-form-item>
            <el-form-item
              label="单笔代付最低限额"
              v-if="channelType === 2"
              prop="minPaymentAmount"
            >
              <el-input
                type="number"
                v-model="channelInfo.minPaymentAmount"
                size="small"
                style="width:180px"
              ></el-input> 元
            </el-form-item>
            <el-form-item
              label="单笔代付最高限额"
              v-if="channelType === 2"
              prop="maxPaymentAmount"
            >
              <el-input
                type="number"
                v-model="channelInfo.maxPaymentAmount"
                size="small"
                style="width:180px"
              ></el-input> 元
            </el-form-item>
            <el-checkbox
              v-model="channelInfo.net"
              :true-label="0"
              :false-label="1"
            >是否需要入网</el-checkbox>
            <el-checkbox
              v-model="channelInfo.bindCard"
              :true-label="0"
              :false-label="1"
            >是否需要绑卡</el-checkbox>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="channelType === 1 ? '还款计划手续费率' : '用户收款手续费率'"
              prop='fee'
            >
              <el-input
                type="number"
                v-model="channelInfo.fee"
                size="small"
                style="width:180px"
              ></el-input> %
            </el-form-item>
            <el-form-item
              :label="channelType === 1 ? '通道代扣成本费率(D0)' : '收款通道成本费率'"
              prop='costFee'
            >
              <el-input
                type="number"
                v-model="channelInfo.costFee"
                size="small"
                style="width:180px"
              ></el-input> %
            </el-form-item>
            <el-form-item
              :label="channelType === 1 ? '单笔代还手续费':'单笔手续费'"
              prop="fixedFee"
            >
              <el-input
                type="number"
                v-model="channelInfo.fixedFee"
                size="small"
                style="width:180px"
              ></el-input> 元
            </el-form-item>
            <el-form-item
              label="单笔手续费封顶"
              prop='topFee'
            >
              <el-input
                type="number"
                v-model="channelInfo.topFee"
                size="small"
                style="width:180px"
              ></el-input> 元
            </el-form-item>
            <el-form-item
              :label="channelType === 1 ?'单日限额':'单日消费限额'"
              prop='dayMaxAmount'
            >
              <el-input
                type="number"
                v-model="channelInfo.dayMaxAmount"
                size="small"
                style="width:180px"
              ></el-input> 元
            </el-form-item>
            <el-form-item
              :label="channelType === 1 ?'单笔最低限额': '单笔消费最低限额'"
              prop='minAmount'
            >
              <el-input
                type="number"
                v-model="channelInfo.minAmount"
                size="small"
                style="width:180px"
              ></el-input> 元
            </el-form-item>
            <el-form-item
              :label="channelType === 1 ? '单笔最高限额' :'单笔消费最高限额'"
              prop='maxAmount'
            >
              <el-input
                type="number"
                v-model="channelInfo.maxAmount"
                size="small"
                style="width:180px"
              ></el-input> 元
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'

const TaskType = {
  REPAY: 1,
  RECEIPT: 2
}
export default {
  name: 'channel-detail',
  props: {
    editData: {
      type: Object,
      default: () => {}
    },
    channelType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      title: '',
      showModule: 1,
      companyData: [],
      channelInfo: {
        channelRealName: '',
        channelName: '',
        channelCode: '',
        authFee: 0,
        authType: 0,
        consumeType: 0,
        bindCardLimit: 0,
        startTime: 9,
        endTime: 21,
        maxAmount: 0,
        minAmount: 0,
        dayMaxAmount: 0,
        maxPaymentAmount: 0,
        minPaymentAmount: 0,
        dayMaxPaymentAmount: 0,
        companyId: '',
        costFee: 0,
        fee: 0,
        fixedFee: 0,
        topFee: 0,
        net: 0,
        bindCard: 1
      },
      rules: {
        channelRealName: [{ required: true, message: '请输入通道名称', trigger: 'blur' }],
        channelName: [{ required: true, message: '请输入通道别名', trigger: 'blur' }],
        channelCode: [{ required: true, message: '请输入通道编号', trigger: 'blur' }],
        companyId: [{ required: true, message: '请选择通道公司', trigger: 'change' }],
        authFee: [{ required: true, message: '请输入鉴权手续费', trigger: 'blur' }],
        bindCardLimit: [{ required: true, message: '请输入绑卡限制数量', trigger: 'blur' }],
        startTime: [{ required: true, message: '请输入交易开始时间', trigger: 'change' }],
        endTime: [
          {
            required: true,
            message: '请输入交易结束时间',
            trigger: 'change'
          }
        ],
        dayMaxPaymentAmount: [
          {
            required: true,
            message: '请输入单日代付限额',
            trigger: 'blur'
          }
        ],
        minPaymentAmount: [
          {
            required: true,
            message: '请输入单日代付最低限额',
            trigger: 'blur'
          }
        ],
        maxPaymentAmount: [
          {
            required: true,
            message: '请输入单笔代付最高限额',
            trigger: 'blur'
          }
        ],
        fee: [
          {
            required: true,
            message: '请输入手续费率',
            trigger: 'blur'
          }
        ],
        costFee: [
          {
            required: true,
            message: '请输入成本费率',
            trigger: 'blur'
          }
        ],
        fixedFee: [
          {
            required: true,
            message: '请输入手续费',
            trigger: 'blur'
          }
        ],
        topFee: [
          {
            required: true,
            message: '请输入单笔手续费封顶',
            trigger: 'blur'
          }
        ],
        dayMaxAmount: [
          {
            required: true,
            message: '请输入单日限额'
          }
        ],
        minAmount: [
          {
            required: true,
            message: '请输入单笔最低限额',
            trigger: 'blur'
          }
        ],
        maxAmount: [
          {
            required: true,
            message: '请输入单笔最高限额',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    toback() {
      this.$emit('toback', this.showModule)
    },
    // 编辑 || 新建
    addChannelInfo(formName) {
      if (this.channelInfo.startTime < 0 || this.channelInfo.startTime > 23) {
        this.$message({
          type: 'warning',
          message: '交易时间范围为0-23时'
        })
      } else if (this.channelInfo.endTime < 0 || this.channelInfo.endTime > 23) {
        this.$message({
          type: 'warning',
          message: '交易时间范围为0-23时'
        })
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (!this.editData) {
              this.addChannel()
            } else {
              this.editChannel()
            }
          } else {
            return false
          }
        })
      }
    },
    // 添加通道
    async addChannel() {
      try {
        const res = await post({
          url: 'channel/add',
          data: {
            channelRealName: this.channelInfo.channelRealName,
            channelName: this.channelInfo.channelName,
            channelCode: this.channelInfo.channelCode,
            authFee: this.channelInfo.authFee,
            companyId: this.channelInfo.companyId,
            net: this.channelInfo.net,
            bindCard: this.channelInfo.bindCard,
            bindCardLimit: this.channelInfo.bindCardLimit,
            startTime: this.channelInfo.startTime,
            endTime: this.channelInfo.endTime,
            authType: this.channelInfo.authType,
            consumeType: this.channelInfo.consumeType,
            fee: this.channelInfo.fee,
            costFee: this.channelInfo.costFee,
            fixedFee: this.channelInfo.fixedFee,
            topFee: this.channelInfo.topFee,
            dayMaxAmount: this.channelInfo.dayMaxAmount,
            minAmount: this.channelInfo.minAmount,
            maxAmount: this.channelInfo.maxAmount,
            channelType: this.channelType,
            dayMaxPaymentAmount: this.channelInfo.dayMaxPaymentAmount,
            minPaymentAmount: this.channelInfo.minPaymentAmount,
            maxPaymentAmount: this.channelInfo.maxPaymentAmount
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        this.$emit('toback', this.showModule)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取编辑数据
    async channelDetail(channelId) {
      try {
        const res = await post({
          url: 'channel/detail',
          data: {
            channelId: channelId
          }
        })
        Object.keys(res.data).forEach(key => {
          this.$set(this.channelInfo, key, res.data[key])
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 获取公司
    async companyQuery() {
      try {
        const res = await post({
          url: 'company/query'
        })
        this.companyData = res.data
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑通道
    async editChannel() {
      try {
        const res = await post({
          url: 'channel/edit',
          data: {
            channelRealName: this.channelInfo.channelRealName,
            channelName: this.channelInfo.channelName,
            channelCode: this.channelInfo.channelCode,
            authFee: this.channelInfo.authFee,
            companyId: this.channelInfo.companyId,
            net: this.channelInfo.net,
            bindCard: this.channelInfo.bindCard,
            bindCardLimit: this.channelInfo.bindCardLimit,
            startTime: this.channelInfo.startTime,
            endTime: this.channelInfo.endTime,
            authType: this.channelInfo.authType,
            consumeType: this.channelInfo.consumeType,
            fee: this.channelInfo.fee,
            costFee: this.channelInfo.costFee,
            fixedFee: this.channelInfo.fixedFee,
            topFee: this.channelInfo.topFee,
            dayMaxAmount: this.channelInfo.dayMaxAmount,
            minAmount: this.channelInfo.minAmount,
            maxAmount: this.channelInfo.maxAmount,
            channelType: this.channelType,
            dayMaxPaymentAmount: this.channelInfo.dayMaxPaymentAmount,
            minPaymentAmount: this.channelInfo.minPaymentAmount,
            maxPaymentAmount: this.channelInfo.maxPaymentAmount,
            channelId: this.editData.channelId
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        this.$emit('toback', this.showModule)
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.companyQuery()
    if (this.editData) {
      this.channelDetail(this.editData.channelId)
    }
    if (this.channelType === TaskType.REPAY) {
      this.title = '还款通道信息'
      return
    }
    if (this.channelType === TaskType.RECEIPT) {
      this.title = '收款通道信息'
    }
  }
}
</script>
<style scoped>
.btn {
  margin: 15px 15px;
}
.channelDetail {
  background-color: #fff;
  height: 700px;
  padding: 15px 15px;
}
.xuanz {
  position: absolute;
  top: 245px;
}
</style>
