<template>
<div>
    <el-dialog title="设备详情" :visible.sync="showParticulars" :before-close="modalClose" width="45%" >
        <p class="device"><span style="margin-left:10px">设备型号: {{particularsData.brandName}} </span> <span style="margin-left:10px">设备编号: {{particularsData.devNo}}</span></p>
        <el-table :data="particulars" border style="width: 100%" size="small">
            <el-table-column prop="possessName" label="拥有者" width="100">
            </el-table-column>
            <el-table-column prop="levelName" label="级别">
            </el-table-column>
            <el-table-column prop="upName" label="上级">
            </el-table-column>
            <el-table-column label="入库时间" width="135">
                <template slot-scope="scope">
                    <p>{{scope.row.putDate|cutTime}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="outDate" label="下发时间" width="135">
                <template slot-scope="scope">
                    <p>{{scope.row.outDate|cutTime}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="activateDate" label="激活时间" width="135">
                <template slot-scope="scope">
                    <p>{{scope.row.activateDate|cutTime}}</p>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'device-particulars',
  props: {
    particularsData: {
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
      level: '',
      particulars: [],
      showParticulars: false
    }
  },
  methods: {
    async getStockRecord() {
      try {
        const res = await post({
          url: 'stock/stockRecord',
          data: {
            devNo: this.particularsData.devNo,
            brandId: this.particularsData.brandId,
            activateStatus: this.particularsData.activateStatus
          }
        })
        this.particulars = res.data
      } catch (err) {
        console.log(err)
      }
    },
    modalClose() {
      this.$emit('modalClose')
      this.showParticulars = false
    }
  },

  mounted() {
    this.level = localStorage.getItem('level')
    this.showParticulars = this.flag
    this.getStockRecord()
  }
}
</script>
<style scoped>
.device {
  margin-bottom: 10px;
}
</style>
