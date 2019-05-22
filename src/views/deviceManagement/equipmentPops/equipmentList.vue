<template>
  <div>
    <el-dialog
      :visible.sync="equipment"
      :before-close="modalClose"
      @click="invoking"
      :close-on-click-modal="false"
      width="50%"
    >
      <p class="devType"></p>
      <el-tag
        type="success"
        class="devType"
        v-if="equipmentData.batchStatus === 1"
      >{{variousType}}{{batchStatus}}</el-tag>
      <el-tag
        type="danger"
        class="devType"
        v-if="equipmentData.batchStatus === 2"
      >{{variousType}}{{batchStatus}}</el-tag>

      <p style="margin-bottom:10px">
        {{equipmentData.variousType}}批次【{{equipmentData.batchNo}}】检查出异常设备{{equipmentData.failNum}}台 ,正常设备{{equipmentData.sucNum}}台
        <span
          v-if="equipmentData.batchType === 4"
        >划拨至【{{equipmentData.organName}}】</span>
      </p>
      <el-tabs v-model="activeName" v-if="this.equipmentData.batchStatus === 2">
        <el-tab-pane label="异常设备" name="queryFail">
          <abnormal-form :batchNo="equipmentData.batchNo" :batchType="equipmentData.batchType"></abnormal-form>
        </el-tab-pane>
        <el-tab-pane label="正常设备" name="normalFail">
          <normal-form :batchNo="equipmentData.batchNo" :batchType="equipmentData.batchType"></normal-form>
        </el-tab-pane>
      </el-tabs>
      <normal-form
        :batchNo="equipmentData.batchNo"
        :batchType="equipmentData.batchType"
        v-if="this.equipmentData.batchStatus === 1"
      ></normal-form>
    </el-dialog>
  </div>
</template>
<script>
// import { queryPermission } from '@/util'
import normalForm from './normalForm'
import abnormalForm from './abnormalForm'
export default {
  name: 'equipment-list',
  components: {
    normalForm,
    abnormalForm
  },
  props: {
    equipmentData: {
      type: Object,
      default: () => {}
    },
    flag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      equipment: false,
      activeName: 'queryFail',
      variousType: '',
      batchStatus: ''
    }
  },
  methods: {
    modalClose() {
      this.$emit('modalClose')
      this.equipment = false
    },
    invoking() {
      this.$emit('invoking')
    }
  },
  mounted() {
    this.equipment = this.flag
    const batchTypeMap = {
      1: '入库',
      2: '下发',
      3: '回拨',
      4: '划拨',
      5: '撤回'
    }
    this.variousType = batchTypeMap[this.equipmentData.batchType]
    const batchStatuMap = {
      1: '成功',
      2: '失败'
    }
    this.batchStatus = batchStatuMap[this.equipmentData.batchStatus]
  }
}
</script>
<style scoped>
.operatingBtn {
  position: absolute;
  right: 10%;
  top: 75px;
}
.devType {
  margin: -50px 0 20px;
  font-size: 18px;
}
</style>
