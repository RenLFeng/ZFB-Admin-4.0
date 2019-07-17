<template>
  <el-dialog :title="title" :visible.sync="showDevModel" width="40%" :before-close="handleClose" :close-on-click-modal="false">
    <el-form :inline='true' :rules='rules' ref='modelForm' :model="ModelData" label-width="100px" size="small">
      <el-form-item v-if="statusData.status === 1" label="设备型号" prop='brandName'>
        <el-input v-model="ModelData.brandName"></el-input>
      </el-form-item>
      <el-form-item v-if="statusData.status === 2" label="设备型号" prop='brandName'>
        <el-input v-model="ModelData.brandName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item v-if="statusData.status === 1" label="型号简称" prop='brandSubName'>
        <el-input v-model="ModelData.brandSubName"></el-input>
      </el-form-item>
      <el-form-item v-if="statusData.status === 2" label="型号简称" prop='brandSubName'>
        <el-input v-model="ModelData.brandSubName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="设备厂商" prop='factoryId'>
        <el-select v-model="ModelData.factoryId">
            <el-option v-for="(item,index) in manufacturerData" :key="index" :label="item.factoryName" :value="item.factoryId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售价格" prop='price'>
        <el-input type='Number' min='0' v-model="ModelData.price"></el-input>
      </el-form-item>
       <el-form-item label="型号长度" prop='brandLength'>
         <el-input v-model="ModelData.brandLength" v-if="statusData.status === 1"></el-input>
         <el-input v-model="ModelData.brandLength" v-if="statusData.status === 2" :disabled="true"></el-input>
      </el-form-item>
      <div style="background-color: #efefef;padding-top:15px">
        <el-form-item label="激活奖励" prop='cardReward'>
            <el-input type='Number' min='0' v-model="ModelData.cardReward" style="width:480px"></el-input>
        </el-form-item>
        <el-form-item>元</el-form-item>
        <el-form-item label="直接合伙人" prop='cardProvinceReward'>
            <el-input type='Number' min='0' v-model="ModelData.cardProvinceReward"></el-input>
        </el-form-item>
        <el-form-item>元</el-form-item>
        <el-form-item label="间接合伙人" prop='cardOrganReward'>
            <el-input type='Number' min='0' v-model="ModelData.cardOrganReward"></el-input>
        </el-form-item>
        <el-form-item>元</el-form-item>
      </div>
      <div style="background-color: #efefef;padding-top:15px;margin-top: 15px;">
        <el-form-item label="机构奖励" prop='activateReward'>
            <el-input type='Number' min='0' v-model="ModelData.activateReward" style="width:480px"></el-input>
        </el-form-item>
        <el-form-item>元</el-form-item>
        <el-form-item label="分公司奖励" prop='activateProvinceReward'>
            <el-input type='Number' min='0' v-model="ModelData.activateProvinceReward"></el-input>
        </el-form-item>
        <el-form-item>元</el-form-item>
        <el-form-item label="子公司" prop='activateOrganReward'>
            <el-input type='Number' min='0' v-model="ModelData.activateOrganReward"></el-input>
        </el-form-item>
        <el-form-item>元</el-form-item>
      </div>
      <div style="background-color: #efefef;padding-top:15px;margin-top: 15px;">
        <el-form-item type='Number' min='0' label="端口总数" prop='totalPort'>
            <el-input v-model="ModelData.totalPort" style="width:480px"></el-input>
        </el-form-item>
        <el-form-item type='Number' min='0' label="默认激活" prop='defaultPort'>
            <el-input v-model="ModelData.defaultPort"></el-input>
        </el-form-item>
        <el-form-item type='Number' min='0' label="自带端口" prop='selfPort'>
            <el-input v-model="ModelData.selfPort"></el-input>
        </el-form-item>
        <el-form-item label="激活单价" prop='portReward'>
            <el-input type='Number' min='0' v-model="ModelData.portReward" style="width:480px"></el-input>
        </el-form-item>
        <el-form-item>元</el-form-item>
        <el-form-item label="分公司奖励" prop='portProvinceReward'>
            <el-input type='Number' min='0' v-model="ModelData.portProvinceReward"></el-input>
        </el-form-item>
        <el-form-item>元</el-form-item>
        <el-form-item label="机构奖励" prop='portOrganReward'>
            <el-input type='Number' min='0' v-model="ModelData.portOrganReward"></el-input>
        </el-form-item>
        <el-form-item>元</el-form-item>
      </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clean">取 消</el-button>
        <el-button type="primary" @click="confirmModel('modelForm')">确 定</el-button>
      </span>
  </el-dialog>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
export default {
  name: 'dev-model',
  props: {
    toshow: {
      type: Boolean,
      default: false
    },
    manufacturerData: {
      type: Array,
      default: () => []
    },
    statusData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: '',
      showDevModel: false,
      ModelData: {
        brandName: '',
        brandSubName: '',
        factoryId: '',
        price: '',
        cardReward: '',
        cardProvinceReward: '',
        cardOrganReward: '',
        activateReward: '',
        activateProvinceReward: '',
        activateOrganReward: '',
        selfPort: '',
        defaultPort: '',
        totalPort: '',
        portReward: '',
        portProvinceReward: '',
        portOrganReward: '',
        brandLength: ''
      },
      rules: {
        brandName: [
          { required: true, message: '请输入设备型号', trigger: 'blur' }
        ],
        brandSubName: [
          { required: true, message: '请输入型号简称', trigger: 'blur' }
        ],
        factoryId: [
          { required: true, message: '请选择设备厂商', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入销售价格', trigger: 'blur' }
        ],
        cardReward: [
          { required: true, message: '请输入合伙人奖励', trigger: 'blur' }
        ],
        cardProvinceReward: [
          { required: true, message: '请输入直接合伙人', trigger: 'blur' }
        ],
        cardOrganReward: [
          { required: true, message: '请输入间接合伙人', trigger: 'blur' }
        ],
        activateReward: [
          { required: true, message: '请输入机构奖励', trigger: 'blur' }
        ],
        activateProvinceReward: [
          { required: true, message: '请输入分公司奖励', trigger: 'blur' }
        ],
        activateOrganReward: [
          { required: true, message: '请输入子公司', trigger: 'blur' }
        ],
        totalPort: [
          { required: true, message: '请输入端口总数', trigger: 'blur' }
        ],
        defaultPort: [
          { required: true, message: '请输入默认激活', trigger: 'blur' }
        ],
        selfPort: [
          { required: true, message: '请输入自带端口', trigger: 'blur' }
        ],
        portReward: [
          { required: true, message: '请输入激活单价', trigger: 'blur' }
        ],
        portProvinceReward: [
          { required: true, message: '请输入分公司奖励', trigger: 'blur' }
        ],
        portOrganReward: [
          { required: true, message: '请输入机构奖励', trigger: 'blur' }
        ],
        brandLength: [
          { required: true, message: '请输入型号长度', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击显示隐藏
    handleClose() {
      this.$emit('theShow', this.showDevModel)
    },
    // 点击取消
    clean() {
      this.$emit('theShow', this.showDevModel)
    },
    // 编辑获取数据
    async showEdit() {
      try {
        const res = await post({
          url: 'posBrand/getBrand',
          data: {
            brandId: this.statusData.brandId
          }
        })
        this.ModelData.brandName = res.data.brandName
        this.ModelData.brandSubName = res.data.brandSubName
        this.ModelData.factoryId = res.data.factoryId
        this.ModelData.price = res.data.price
        this.ModelData.cardReward = res.data.cardReward
        this.ModelData.cardProvinceReward = res.data.cardProvinceReward
        this.ModelData.cardOrganReward = res.data.cardOrganReward
        this.ModelData.activateReward = res.data.activateReward
        this.ModelData.activateProvinceReward = res.data.activateProvinceReward
        this.ModelData.activateOrganReward = res.data.activateOrganReward
        this.ModelData.selfPort = res.data.selfPort
        this.ModelData.defaultPort = res.data.defaultPort
        this.ModelData.totalPort = res.data.totalPort
        this.ModelData.portReward = res.data.portReward
        this.ModelData.portProvinceReward = res.data.portProvinceReward
        this.ModelData.portOrganReward = res.data.portOrganReward
        this.ModelData.brandLength = res.data.brandLength
      } catch (err) {
        console.log(err)
      }
    },
    // 添加型号
    async addBrand() {
      this.addDevModel = false
      try {
        const res = await post({
          url: 'posBrand/addBrand',
          data: {
            brandName: this.ModelData.brandName,
            brandSubName: this.ModelData.brandSubName,
            factoryId: this.ModelData.factoryId,
            price: this.ModelData.price,
            cardReward: this.ModelData.cardReward,
            cardProvinceReward: this.ModelData.cardProvinceReward,
            cardOrganReward: this.ModelData.cardOrganReward,
            activateReward: this.ModelData.activateReward,
            activateProvinceReward: this.ModelData.activateProvinceReward,
            activateOrganReward: this.ModelData.activateOrganReward,
            selfPort: this.ModelData.selfPort,
            defaultPort: this.ModelData.defaultPort,
            totalPort: this.ModelData.totalPort,
            portReward: this.ModelData.portReward,
            portProvinceReward: this.ModelData.portProvinceReward,
            portOrganReward: this.ModelData.portOrganReward,
            brandLength: this.ModelData.brandLength
          }
        })
        console.log(res)
        this.$emit('invoking', this.showDevModel)
        this.$message({ message: res.msg, type: 'success' })
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑型号
    async editFactoryData() {
      this.editBox = false
      try {
        const res = await post({
          url: 'posBrand/editBrand',
          data: {
            brandId: this.statusData.brandId,
            brandName: this.ModelData.brandName,
            brandSubName: this.ModelData.brandSubName,
            factoryId: this.ModelData.factoryId,
            price: this.ModelData.price,
            cardReward: this.ModelData.cardReward,
            cardProvinceReward: this.ModelData.cardProvinceReward,
            cardOrganReward: this.ModelData.cardOrganReward,
            activateReward: this.ModelData.activateReward,
            activateProvinceReward: this.ModelData.activateProvinceReward,
            activateOrganReward: this.ModelData.activateOrganReward,
            selfPort: this.ModelData.selfPort,
            defaultPort: this.ModelData.defaultPort,
            totalPort: this.ModelData.totalPort,
            portPrice: this.ModelData.portPrice,
            portProvinceReward: this.ModelData.portProvinceReward,
            portOrganReward: this.ModelData.portOrganReward,
            brandLength: this.ModelData.brandLength,
            portReward: this.ModelData.portReward
          }
        })
        this.$emit('invoking', this.showDevModel)
        this.$message({ message: res.msg, type: 'success' })
      } catch (err) {
        console.log(err)
      }
    },
    // 点击确认
    confirmModel(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.statusData.status === 1) {
            this.addBrand()
          } else if (this.statusData.status === 2) {
            this.editFactoryData()
          }
        } else {
          return false
        }
      })
    }
  },
  mounted() {
    this.showDevModel = this.toshow
    if (this.statusData.status === 1) {
      this.title = '新增型号'
    } else if (this.statusData.status === 2) {
      this.showEdit()
      this.title = '编辑型号'
    }
  }
}
</script>
<style scoped>
</style>
