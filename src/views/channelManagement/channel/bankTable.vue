<template>
  <div>
    <div class="btn">
      <el-button type="primary" icon="el-icon-arrow-left" @click="toback" size="small">返回</el-button>
      <el-button type="primary" size="small" style="float: right" @click="addBankshow = true">新增</el-button>
    </div>
    <el-table :data="bankList" border style="width: 100%" size='small'>
      <el-table-column prop="serialNum" label="序号">
      </el-table-column>
      <el-table-column prop="btName" label="银行">
      </el-table-column>
      <el-table-column prop="orderAmtLimit" label="单日限额">
      </el-table-column>
      <el-table-column prop="thirdCode" label="通道方银行编号">
      </el-table-column>
      <el-table-column prop="dayAmtLimit" label="单笔限额">
      </el-table-column>
      <el-table-column prop="orderLimit" label="单日消费笔数">
      </el-table-column>
      <el-table-column prop="tradeStartTime" label="交易时间">
        <template slot-scope="scope">
          <p>{{scope.row.tradeStartTime|cutdate}}:00 - {{scope.row.tradeEndTime|cutdate}}:00</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style='color:red' @click="delbank(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-bank-list v-if="addBankshow" :flag="addBankshow" :channelId="channelId" @handleClose="handleClose" @invoking="invoking"></add-bank-list>
  </div>
</template>
<script>
import addBankList from './addBankList'
// import { mixins } from '@/core'
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'bank-table',
  // mixins: [mixins.pageMixin],
  components: {
    addBankList
  },
  props: {
    channelId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      showModule: 1,
      bankList: [],
      addBankshow: false
    }
  },
  methods: {
    toback() {
      this.$emit('toback', this.showModule)
    },
    // 获取银行列表
    async getBankList() {
      try {
        const res = await post({
          url: 'channel/querySupportBank',
          data: {
            channelId: this.channelId
          }
        })
        this.bankList = res.data.map((item, index) => {
          return Object.assign({}, item, { serialNum: index + 1 })
        })
      } catch (error) {
        console.log(error)
      }
    },
    handleClose() {
      this.addBankshow = false
    },
    invoking() {
      this.addBankshow = false
      this.getBankList()
    },
    // 删除
    async delbank(row) {
      try {
        await this.$confirm('您确定删除【' + row.btName + '】?', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        const res = await post({
          url: 'channel/deleteSupportBank',
          data: {
            channelId: row.channelId,
            btCode: row.btCode
          }
        })
        this.$message({ message: res.msg, type: 'success' })
        this.getBankList()
      } catch (error) {}
    }
  },
  mounted() {
    this.getBankList()
  },
  filters: {
    cutdate(time) {
      if (Number(time) < 10) {
        return '0' + time
      }
      return time
    }
  }
}
</script>
<style scoped>
.btn {
  margin: 15px 15px;
}
</style>
