<template>
  <div>
    <el-dialog :title="title" :visible="true" :before-close="hide">
      <p
        style="padding-bottom:15px"
      >{{date}} 【{{organDetailData.organName}}】总分润:{{totalData.totalProfit|normAmount}} 元，总交易量: {{totalData.totalPerformance|normAmount}} 元</p>
      <el-tabs
        v-model="activeName"
        v-if="Number(organDetailData.organType) === Number(levelMap.ORGAN)"
      >
        <el-tab-pane label="合伙人" name="first">
          <team-list :dealType="dealType" :organDetailData="organDetailData"></team-list>
        </el-tab-pane>
        <el-tab-pane label="二级机构" name="second">
          <secorgan-list :dealType="dealType" :organDetailData="organDetailData"></secorgan-list>
        </el-tab-pane>
      </el-tabs>
      <team-list v-else :dealType="dealType" :organDetailData="organDetailData"></team-list>
    </el-dialog>
  </div>
</template>
<script>
import { post } from '../../../../store/requestFacade.js'
import { mixins } from '@/core'
import { levelMap } from '../../../../server/level.js'
import teamList from './teamList'
import secorganList from './secorganList'

const dealTypeMap = {
  REPAY: 2,
  RECEIPT: 1
}
export default {
  name: 'org-repay-distribution-detail',
  mixins: [mixins.pageMixin],
  props: {
    dealType: {
      type: Number,
      default: null
    },
    organDetailData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    teamList,
    secorganList
  },
  data() {
    return {
      levelMap: levelMap,
      detailsData: [],
      title: '',
      dealTypeMap: dealTypeMap,
      totalData: '',
      activeName: 'first'
    }
  },
  computed: {
    date: function() {
      return this.SettlementTime(this.organDetailData.addDate)
    },
    addDate: function() {
      return this.SetTime(this.organDetailData.addDate)
    }
  },
  methods: {
    hide() {
      this.$emit('closeDetail')
    },
    SettlementTime(addDate) {
      if (!addDate) return ''
      const time = new Date(addDate)
      let y = time.getFullYear()
      let MM = time.getMonth() + 1
      if (MM < 10) {
        return y + '年0' + MM + '月'
      }
      return y + '年' + MM + '月'
    },
    SetTime(addDate) {
      if (!addDate) return ''
      const time = new Date(addDate)
      let y = time.getFullYear()
      let MM = time.getMonth() + 1
      if (MM < 10) {
        return y + '-0' + MM
      }
      return y + '-' + MM
    },
    async getAllData() {
      try {
        const res = await post({
          url: 'organProfit/accountProfit',
          data: {
            organId: this.organDetailData.organId,
            date: this.addDate,
            type: this.dealType
          }
        })
        this.totalData = res.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.getAllData()
    const typeMap = {
      1: '收款',
      2: '还款'
    }
    this.title = `${typeMap[this.dealType]}分润详情`
  }
}
</script>
