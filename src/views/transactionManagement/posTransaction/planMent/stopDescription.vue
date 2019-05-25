<template>
  <div>
    <el-dialog :visible="true" @close="closeDialog">请输入暂停原因
      <el-select v-model="currentReasonIndex" placeholder="请选择" style="margin-bottom: 16px;">
        <el-option
          v-for="item in initSmsContent"
          :key="item.index"
          :label="item.desc"
          :value="item.index"
        ></el-option>
      </el-select>
      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="smsContent"/>
      <div style="margin-top: 16px;">
        <el-button @click="ensure">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'stop-description',
  props: {
    cardNo: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    closeDialog() {
      this.$emit('cancel')
    },
    ensure() {
      console.log(typeof this.currentReasonIndex)
      const reasonIndex = this.currentReasonIndex - 1
      if (reasonIndex < 0) {
        this.$message('请选择原因')
        return
      }
      const { index, desc } = this.initSmsContent[reasonIndex]
      this.$emit('ensure', { index, desc, smsContent: this.smsContent })
    },
    cutCardNo(num) {
      if (!num) return ''
      return num.slice(length - 4, num.length)
    }
  },
  data() {
    return {
      currentReasonIndex: undefined,
      initSmsContent: [
        {
          index: 1,
          desc: '交易受限',
          message: cardNo => `尊敬的用户：您的卡(${cardNo})交易权限受限，导致消费失败（计划已暂停，详情请咨询您的发卡行），取消限制后，请联系三众客服恢复计划。电话：400-843-3388`
        },
        {
          index: 2,
          desc: '信息失效',
          message: cardNo => `尊敬的用户：您的卡(${cardNo})信息已失效。导致消费失败（计划已被取消，请先解绑卡片，再重新绑卡制定计划）如有疑问请联系三众客服，电话：400-843-3388\n信息已失效包括：卡片超过有效期、持卡人身份证超过有效期、持卡人身份信息有误、预留手机号码、CVN2信息有误`
        },
        {
          index: 3,
          desc: '金额限制',
          message: cardNo => `尊敬的用户：您的卡(${cardNo})单笔消费金额超过2000元限额，导致消费失败（计划已被取消，请降低账单金额，再重新制定计划）。如有疑问请联系三众客服，电话：400-843-3388\n注：限额包括（银行，通道的限额）`
        },
        {
          index: 4,
          desc: '余额不足',
          message: cardNo => `尊敬的用户：您的卡(${cardNo})余额不足，导致消费失败（计划已暂停，请确保卡内可用额度足够），如有疑问请联系三众客服，电话：400-843-3388`
        },
        {
          index: 5,
          desc: '设备出错',
          message: cardNo => `尊敬的用户：您的卡(${cardNo})因网络原因导致消费失败（计划已暂停，请确保设备网络畅通稳定），如有疑问请联系三众客服，电话：400-843-3388\n原因包括：未插卡（计划已暂停，请确保卡已插好）、设备通讯出错（计划已暂停，请确保设备电量充足）`
        }
      ],
      smsContent: ''
    }
  },
  watch: {
    currentReasonIndex() {
      console.log('reason index change', this.currentReasonIndex)
      if (typeof this.currentReasonIndex === 'undefined') {
        return
      }
      this.smsContent = (
        this.initSmsContent[this.currentReasonIndex - 1] || { message: () => {} }
      ).message(this.cutCardNo(this.cardNo))
    }
  },
  mounted() {
    console.log(this.cardNo)
  }
}
</script>

<style lang="css" scoped>
</style>
