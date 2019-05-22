<template>
  <div>
    <el-dialog
      title="新增银行"
      :visible.sync="addBankshow"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addBankData"
        :rules='rules'
        ref='bankForm'
        label-width="120px"
      >
        <el-form-item
          label="银行名称"
          prop='btCode'
        >
          <el-select
            v-model="addBankData.btCode"
            placeholder="请选择"
            @change="findbank"
          >
            <el-option
              v-for="(item ,index) in ourbank"
              :key="index"
              :label="item.btName"
              :value="item.btCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="通道方银行编号"
          prop='thirdCode'
        >
          <el-input
            v-model="addBankData.thirdCode"
            style="width: 210px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="单日限额"
          prop='dailyLimit'
        >
          <el-input
            v-model="addBankData.dailyLimit"
            style="width: 200px"
          ></el-input> 元
        </el-form-item>
        <el-form-item
          label="单笔限额"
          prop='singleLimit'
        >
          <el-input
            v-model="addBankData.singleLimit"
            style="width: 200px"
          ></el-input> 元
        </el-form-item>
        <el-form-item
          label="单日消费笔数"
          prop='consumerNum'
        >
          <el-input
            v-model="addBankData.consumerNum"
            style="width: 200px"
          ></el-input> 笔
        </el-form-item>
        <el-form-item
          label="交易时间"
          required
        >
          <el-col :span="7">
            <el-form-item prop='startTime'>
              <el-input
                size="small"
                type="number"
                style="width:80px"
                v-model="addBankData.startTime"
                placeholder="请输入交易开始时间"
              >
              </el-input> 时
            </el-form-item>
          </el-col>
          <el-col
            class="line"
            :span="1"
          >-</el-col>
          <el-col :span="8">
            <el-form-item prop='endTime'>
              <el-input
                type="number"
                size="small"
                style="width:80px"
                v-model="addBankData.endTime"
                placeholder="请输入交易结束时间"
              >
              </el-input> 时
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="clean">取 消</el-button>
        <el-button
          type="primary"
          @click="addList('bankForm')"
        >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'add-bank-list',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    channelId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      addBankshow: false,
      ourbank: [],
      addBankData: {
        bankName: '',
        dailyLimit: 0,
        singleLimit: 0,
        consumerNum: 0,
        btCode: '',
        thirdCode: '',
        startTime: '',
        endTime: ''
      },
      rules: {
        btCode: [
          {
            required: true,
            message: '请选择银行',
            trigger: 'change'
          }
        ],
        thirdCode: [
          {
            required: true,
            message: '请输入通道银行编号',
            trigger: 'blur'
          }
        ],
        dailyLimit: [
          {
            required: true,
            message: '请输入单日限额',
            trigger: 'blur'
          }
        ],
        singleLimit: [
          {
            required: true,
            message: '请输入单笔限额',
            trigger: 'blur'
          }
        ],
        consumerNum: [
          {
            required: true,
            message: '请输入单日消费笔数',
            trigger: 'blur'
          }
        ],
        startTime: [
          {
            required: true,
            message: '请输入交易开始时间',
            trigger: 'blur'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请输入交易结束时间',
            trigger: 'blur'
          }
        ]
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
    addList(formName) {
      if (this.addBankData.startTime < 0 || this.addBankData.startTime > 23) {
        this.$message({
          type: 'warning',
          message: '交易时间范围为0-23时'
        })
      } else if (this.addBankData.endTime < 0 || this.addBankData.endTime > 23) {
        this.$message({
          type: 'warning',
          message: '交易时间范围为0-23时'
        })
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.addBank()
          }
        })
      }
    },
    // 获取银行列表
    async getbank() {
      try {
        const res = await post({
          url: 'channel/queryBankTrunk'
        })
        this.ourbank = res.data
      } catch (error) {
        console.log(error)
      }
    },
    findbank(btCode) {
      let bankinfo = {}
      bankinfo = this.ourbank.find(item => {
        return item.btCode === btCode
      })
      this.addBankData.btName = bankinfo.btName
    },
    // 点击保存
    async addBank() {
      try {
        const res = await post({
          url: 'channel/addSupportBank',
          data: {
            channelId: this.channelId,
            btName: this.addBankData.btName,
            btCode: this.addBankData.btCode,
            thirdCode: this.addBankData.thirdCode,
            dayAmtLimit: this.addBankData.dailyLimit,
            orderAmtLimit: this.addBankData.singleLimit,
            orderLimit: this.addBankData.consumerNum,
            tradeStartTime: this.addBankData.startTime,
            tradeEndTime: this.addBankData.endTime
          }
        })
        this.$emit('invoking')
        this.$message({ message: res.msg, type: 'success' })
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.addBankshow = this.flag
    this.getbank()
  }
}
</script>
<style scoped>
</style>
