<template>
  <div>
    <el-dialog
      title="划拨"
      :visible.sync="transfer"
      width="23%"
      :before-close="transferClose"
      :close-on-click-modal="false"
    >
      <el-form :inline="true" :model="transferData" ref="transfer">
        <el-form-item
          label="划拨至："
          prop="toOrganId"
          :rules="[{ required: true, message: '请选择下级机构', trigger: 'change' }]"
        >
          <el-select
            v-model="transferData.toOrganId"
            filterable
            placeholder="请选择机构"
            @change="getOrganName"
          >
            <el-option
              v-for="item in organizationData"
              :key="item.id"
              :label="item.organ"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="level === levelMap.PLATFORM">
        <el-radio v-model="profitStatus" :label="0" @change="recash">不参与返现奖励政策</el-radio>
        <el-radio v-model="profitStatus" :label="1" @change="recash">参与返现奖励政策</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferClose">取消</el-button>
        <el-button type="primary" @click="submitForm('transfer')">确定</el-button>
      </span>
    </el-dialog>
    <!-- 设备列表 -->
    <equipment-list
      :equipmentData="this.equipmentData"
      v-if="addOrderVisible"
      :flag="addOrderVisible"
      @modalClose="modalClose"
    ></equipment-list>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
import { levelMap } from '../../../server/level.js'
import equipmentList from './equipmentList'
export default {
  name: 'to-lead',
  components: {
    equipmentList
  },
  props: {
    selectionData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      level: '',
      levelMap: levelMap,
      addOrderVisible: false,
      transfer: true,
      transferData: {
        toOrganId: ''
      },
      profitStatus: 0,
      organizationData: [],
      organName: [],
      equipmentData: {
        batchNo: '',
        batchType: '',
        batchStatus: '',
        sucNum: '',
        failNum: '',
        organName: ''
      }
    }
  },
  methods: {
    transferClose() {
      this.$emit('transferClose')
    },
    modalClose() {
      this.addOrderVisible = false
      this.$emit('renewal')
    },
    getOrganName() {
      this.organName = this.organizationData.filter(v => {
        return this.transferData.toOrganId === v.id
      })
    },
    // 获取目标机构
    async getOrgan() {
      try {
        const res = await post({
          url: 'transfer/transOrgan'
        })
        this.organizationData = res.data.map(v => ({
          ...v,
          organ: `${v.organName}(${v.organCode})`
        }))
      } catch (error) {
        console.log(error)
      }
    },
    recash() {
      const text =
        this.profitStatus === 0
          ? '确定该批设备不参与返现奖励政策？'
          : '确定该批设备参与返现奖励政策？'
      this.$alert(text)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.reminder()
        } else {
          return false
        }
      })
    },
    async reminder() {
      const cashNum = profitStatus =>
        this.selectionData.map(item => {
          if (item.profitStatus === profitStatus) {
            return item.profitStatus
          }
        })
      let notCallCashNum = this.selectionData.map(item => {
        if (item.profitStatus === 0) {
          return item.profitStatusText
        }
      })
      const callCashNum = cashNum(1).filter(Boolean).length
      const sentDownNum = cashNum(2).filter(Boolean).length
      notCallCashNum = notCallCashNum.filter(Boolean).length
      const Cashtext = this.profitStatus === 0 ? '不参与返现奖励' : '参与返现奖励'
      const callCashNumText = callCashNum === 0 ? '' : `${callCashNum}台<b>参与返现奖励</b><br>`
      const sentDownNumText = sentDownNum === 0 ? '' : `${sentDownNum}台<b>未下发</b><br>`
      const notCallCashNumText =
        notCallCashNum === 0 ? '' : `${notCallCashNum}台<b>不参与返现奖励</b><br>`
      let text
      if (this.level === levelMap.PLATFORM) {
        text = `选择的设备中存在<br>${sentDownNumText}${callCashNumText}${notCallCashNumText}您确定将这${
          this.selectionData.length
        }台设备全部设为<b>${Cashtext}</b>吗？`
      } else {
        text = `选择的设备中存在<br>${callCashNum}台<b>参与返现奖励</b><br>${notCallCashNum}台<b>不参与返现奖励</b><br>您确定将设备按照以上规则划拨吗？`
      }
      try {
        await this.$confirm(text, '划拨', {
          dangerouslyUseHTMLString: true
        })
        this.toTransfer()
      } catch (error) {}
    },
    async toTransfer() {
      const device = this.selectionData.map(v => ({
        devNo: v.devNo
      }))
      try {
        const res = await post({
          url: 'transfer/transfer',
          data: {
            toOrganId: this.transferData.toOrganId,
            profitStatus: this.profitStatus,
            device: JSON.stringify(device)
          }
        })
        this.equipmentData.batchNo = res.data
        this.equipmentData.batchType = 4
        this.equipmentData.batchStatus = 1
        this.equipmentData.sucNum = 0
        this.equipmentData.failNum = device.length
        this.equipmentData.organName = this.organName[0].organName
        try {
          await this.$confirm(
            `您已成功划拨${device.length}台设备至【${this.organName[0].organName}】`,
            '划拨成功',
            {
              type: 'success',
              confirmButtonText: '查看【库存记录】',
              showCancelButton: false,
              center: true,
              dangerouslyUseHTMLString: true
            }
          )
          this.addOrderVisible = true
        } catch (error) {
          this.$emit('renewal')
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  async mounted() {
    this.level = localStorage.getItem('level')
    this.getOrgan()
  }
}
</script>
<style scoped>
</style>
