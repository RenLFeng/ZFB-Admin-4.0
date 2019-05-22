<template>
  <el-dialog
    :title="title"
    :visible.sync="toLead"
    width="23%"
    :before-close="commandClose"
    :close-on-click-modal="false"
  >
    <div v-if="!loading">
      <el-form :inline="true">
        <el-form-item label="下级机构" v-if="operationType === 2||operationType === 3">
          <el-select v-model="toOrganId" filterable placeholder="请选择机构" @change="findOrganId">
            <el-option
              v-for="item in organizationData"
              :key="item.organId"
              :label="item.organName"
              :value="item.organId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备厂商">
          <el-select @change="clearBrandId" v-model="factoryId" placeholder="请选择厂商">
            <el-option
              v-for="item in manufacturerData"
              :key="item.brandId"
              :label="item.factorySubName"
              :value="item.factoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号">
          <el-select v-model="brandId" placeholder="请选择型号">
            <el-option
              v-for="item in selectDevModel"
              :key="item.brandId"
              :label="item.brandSubName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="level === levelMap.PLATFORM&operationType === 2">
        <el-radio v-model="profitStatus" :label="0" @change="recash">不参与返现奖励政策</el-radio>
        <el-radio v-model="profitStatus" :label="1" @change="recash">参与返现奖励政策</el-radio>
      </div>
    </div>
    <p slot="footer" class="dialog-footer" v-if="!loading">
      <el-button type="info" v-show="factoryId === '' || brandId === '' ">导入表格</el-button>
      <el-button type="primary" v-show="factoryId !== '' & brandId !== '' ">
        导入表格
        <input type="file" id="file" ref="upload" accept=".xls, .xlsx" class="fileslead">
      </el-button>
    </p>
    <p class="loading" v-if="loading">
      <i class="el-icon-loading"></i>
      <span>正在{{title}}，请稍后···</span>
    </p>
  </el-dialog>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
import { levelMap } from '../../../server/level.js'
import { excel } from '@/core'
export default {
  name: 'to-lead',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    operationType: {
      type: Number,
      default: null
    },
    devModelData: {
      type: Array,
      default: () => []
    },
    organizationData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      level: '',
      levelMap: levelMap,
      profitStatus: 0,
      toLead: false,
      title: '',
      manufacturerData: [],
      factoryId: '',
      brandId: '',
      outputs: [],
      toOrganId: '',
      organName: ''
    }
  },
  methods: {
    commandClose() {
      this.$emit('commandClose')
    },
    // 获取厂商
    async getmanufacturer() {
      try {
        const res = await post({
          url: 'posFactory/queryFactory'
        })
        this.manufacturerData = res.data
      } catch (err) {
        console.log(err)
      }
    },
    clearBrandId() {
      this.brandId = ''
    },
    // 入库导入
    async excelPut() {
      this.loading = true
      try {
        const res = await post({
          url: 'batchExcel/excelPut',
          data: {
            factoryId: this.factoryId,
            brandId: this.brandId,
            device: JSON.stringify(this.outputs)
          }
        })
        // console.log(res)
        this.$emit('renewal')
        this.$confirm(
          `您共需要入库${this.outputs.length}个设备，请稍等片刻后在【库存批次】中查看入库结果`,
          `生成批次${res.msg}`,
          {
            type: 'success',
            showConfirmButton: false,
            showCancelButton: false,
            center: true
          }
        )
      } catch (error) {
        console.log(error)
      }
    },
    // 下发导入
    async excelOut() {
      this.loading = true
      try {
        const res = await post({
          url: 'batchExcel/excelOut',
          data: {
            device: JSON.stringify(this.outputs),
            toOrganId: this.toOrganId,
            factoryId: this.factoryId,
            brandId: this.brandId,
            profitStatus: this.profitStatus
          }
        })
        this.$emit('renewal')
        this.$confirm(
          `您将要下发${this.outputs.length}个设备给【${
            this.organName
          }】，请稍等片刻后在【库存批次】中查看下发结果`,
          `生成批次${res.msg}`,
          {
            type: 'success',
            showConfirmButton: false,
            showCancelButton: false,
            center: true
          }
        )
      } catch (error) {
        console.log(error)
      }
    },
    // 回拨导入
    async excelCallBack() {
      this.loading = true
      try {
        const res = await post({
          url: 'batchExcel/excelCallBack',
          data: {
            device: JSON.stringify(this.outputs),
            toOrganId: this.toOrganId,
            factoryId: this.factoryId,
            brandId: this.brandId,
            profitStatus: this.profitStatus
          }
        })
        this.$emit('renewal')
        if (res.data) {
          try {
            await this.$confirm(
              `您将要回拨${this.outputs.length}个设备给【${this.organName}】<br>检查出${
                res.data
              }个`,
              '回拨失败',
              {
                type: 'error',
                // confirmButtonText: '查看【库存记录】',
                showCancelButton: false,
                showConfirmButton: false,
                center: true,
                dangerouslyUseHTMLString: true
              }
            )
          } catch (error) {}
        } else {
          try {
            await this.$confirm(
              `您将要回拨${this.outputs.length}个设备给【${this.organName}】<br>检查出正常设备${
                this.outputs.length
              }个`,
              '回拨成功',
              {
                type: 'success',
                // confirmButtonText: '查看【库存记录】',
                showCancelButton: false,
                showConfirmButton: false,
                center: true,
                dangerouslyUseHTMLString: true
              }
            )
          } catch (error) {}
        }
      } catch (error) {
        console.log(error)
      }
    },
    findOrganId(organId) {
      let organinfo = {}
      organinfo = this.organizationData.find(item => {
        return item.organId === organId
      })
      this.organName = organinfo.organName
    },
    recash() {
      const text =
        this.profitStatus === 0
          ? '确定该批设备不参与返现奖励政策？'
          : '确定该批设备参与返现奖励政策？'
      this.$alert(text)
    }
  },
  computed: {
    // 根据厂商筛选对应的设备型号
    selectDevModel() {
      return this.devModelData.filter(item => {
        return item.factoryId === this.factoryId
      })
    }
  },
  async mounted() {
    this.level = localStorage.getItem('level')
    this.toLead = this.flag
    this.getmanufacturer()
    if (this.operationType === 1) {
      this.title = '批量入库'
    }
    if (this.operationType === 2) {
      this.title = '批量下发'
    }
    if (this.operationType === 3) {
      this.title = '批量回拨'
    }
    // console.log(this);
    this.$refs.upload.addEventListener('change', async e => {
      const files = await excel.readExcel(e)
      for (var i = 0; i < files.length; i++) {
        var sheetData = {
          devNo: files[i].设备编号
        }
        this.outputs.push(sheetData)
      }
      let newOutputs = this.outputs.map(v => {
        return v.devNo
      })
      newOutputs = new Set(newOutputs)
      if (JSON.stringify(this.outputs).slice(1, 3) === '{}') {
        this.$emit('commandClose')
        this.$confirm('导入文件有误,请检查文件重新导入', '导入失败', {
          type: 'error',
          showConfirmButton: false,
          showCancelButton: false,
          center: true
        })
      } else if (newOutputs.size !== this.outputs.length) {
        this.$emit('commandClose')
        this.$confirm('导入文件有误,请检查文件重新导入', '导入失败', {
          type: 'error',
          showConfirmButton: false,
          showCancelButton: false,
          center: true
        })
      } else {
        if (this.operationType === 1) {
          this.excelPut()
        }
        if (this.operationType === 2) {
          this.excelOut()
        }
        if (this.operationType === 3) {
          this.excelCallBack()
        }
      }
    })
  }
}
</script>
<style scoped>
.fileslead {
  width: 84px;
  height: 40px;
  opacity: 0;
  position: absolute;
  right: 20px;
}
i {
  display: block;
  font-size: 50px;
}
.loading {
  text-align: center;
  padding-bottom: 40px;
}
</style>
