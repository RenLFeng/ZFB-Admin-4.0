<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
        <el-breadcrumb-item>激活码</el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <el-button
          type="text"
          @click="clickDelivery"
          v-if="level!== levelMap.PLATFORM&&canCodeApply"
        >
          <span class="el-icon-sort"></span>&nbsp;申请
        </el-button>
        <el-button type="text" @click="clickRecall" v-if="canCodeReturn">
          <span class="el-icon-lx-qiehuan"></span>&nbsp;回拨
        </el-button>
      </div>
    </div>
    <div class="total">
      <span v-if="level !== levelMap.PLATFORM">申请数量：{{totalCode.applyNumber}}个&nbsp;&nbsp;</span>
      <span v-if="level !== levelMap.PLATFORM">入库数量：{{totalCode.putNumber}}个&nbsp;&nbsp;</span>
      <span v-if="level !== levelMap.SECONDORGAN">下发数量：{{totalCode.outNumber}}个&nbsp;&nbsp;</span>
      <span v-if="level !== levelMap.SECONDORGAN">回拨数量：{{totalCode.returnNumber}}个&nbsp;&nbsp;</span>
      <span v-if="level !== levelMap.PLATFORM">库存数量：{{totalCode.stockNumber}}个&nbsp;&nbsp;</span>
    </div>
    <el-tabs v-model="currentTabName" type="border-card" :tab-click="reload">
      <el-tab-pane label="申请记录" name="proposer-record" v-if="canactivateCodeApplyRecord">
        <proposer-record
          v-if="isRouterAlive"
          @deliverySuccess="deliverySuccess"
          :stockNumber="totalCode.stockNumber"
        ></proposer-record>
      </el-tab-pane>
      <el-tab-pane
        label="下发记录"
        name="active-code-deliver-record"
        v-if="level !== levelMap.SECONDORGAN&&canactivateCodeOutRecord"
      >
        <active-code-deliver-record v-if="isRouterAlive"></active-code-deliver-record>
      </el-tab-pane>
      <el-tab-pane
        label="回拨记录"
        name="active-code-recall-record"
        v-if="level !== levelMap.SECONDORGAN&&canactivateCodeReturn"
      >
        <active-code-recall-record v-if="isRouterAlive"></active-code-recall-record>
      </el-tab-pane>
    </el-tabs>
    <delivery
      v-if="deliveryShow"
      @cancelDelivery="cancelDelivery"
      @deliverySuccess="deliverySuccess"
    ></delivery>
    <recall
      v-if="recallShow"
      @cancelRecall="cancelRecall"
      :organizationData="organizationData"
      @recallSuccess="recallSuccess"
    ></recall>
  </div>
</template>
<script>
import activeCodeRecallRecord from './activeCodeRecallRecord.vue'
import activeCodeDeliverRecord from './activeCodeDeliverRecord.vue'
import proposerRecord from './proposerRecord'
import delivery from './delivery'
import recall from './recall'
import { queryPermission } from '@/util'
import { post } from '../../../store/requestFacade.js'
import { levelMap } from '../../../server/level.js'
export default {
  components: {
    proposerRecord,
    activeCodeRecallRecord,
    activeCodeDeliverRecord,
    delivery,
    recall
  },
  name: 'active-code',
  data() {
    return {
      organizationData: [],
      totalCode: {},
      currentTabName: '',
      deliveryShow: false,
      recallShow: false,
      level: '',
      levelMap,
      isRouterAlive: true
    }
  },
  computed: {
    canRecallActiveCode() {
      return queryPermission('recallActiveCode')
    },
    canDeliverActiveCode() {
      return queryPermission('deliverActiveCode')
    },
    canactivateCodeApplyRecord() {
      // 申请记录
      return queryPermission('activateCodeApplyRecord')
    },
    canactivateCodeOutRecord() {
      // 下发记录
      return queryPermission('activateCodeOutRecord')
    },
    canactivateCodeReturn() {
      // 回拨记录
      return queryPermission('activateCodeReturn')
    },
    canCodeApply() {
      return queryPermission('codeApply')
    },
    canCodeReturn() {
      return queryPermission('codeReturn')
    },
    tabNames() {
      return [proposerRecord, activeCodeRecallRecord, activeCodeDeliverRecord].map(
        ({ name }) => name
      )
    }
  },
  mounted() {
    this.statistics()
    this.level = localStorage.getItem('level')
    this.currentTabName = this.tabNames[0]
  },
  methods: {
    clickDelivery() {
      this.deliveryShow = true
    },
    cancelDelivery() {
      this.deliveryShow = false
    },
    clickRecall() {
      this.recallShow = true
    },
    cancelRecall() {
      this.recallShow = false
    },
    deliverySuccess() {
      this.deliveryShow = false
      this.reload()
    },
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
      this.statistics()
    },
    recallSuccess() {
      this.recallShow = false
      this.reload()
    },
    async statistics() {
      try {
        const res = await post({
          url: 'codeStock/statistics'
        })
        this.totalCode = res.data
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  margin: 15px 0;
}
.total {
  font-size: 14px;
  color: #606266;
  /* float: right; */
  text-align: right;
}
</style>
