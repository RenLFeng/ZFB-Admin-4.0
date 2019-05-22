<template>
  <div>
    <!-- 发布商品 -->
    <el-dialog
      :title="title"
      :visible="true"
      :close-on-click-modal="false"
      :before-close="productHide"
    >
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form
              :inline="true"
              :model="currentProduct"
              :rules="rules"
              ref="productForm"
              class="demo-ruleForm"
              label-width="100px"
              size="small"
            >
              <el-form-item label="商品名称" prop="packageName">
                <el-input v-model="currentProduct.packageName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="关联活动" v-show="isChange">
                <el-select
                  clearable
                  v-model="currentProduct.activityName"
                  @change="linkActivity"
                  @clear="clearActivity"
                >
                  <el-option :label="activeList.activityName" :value="activeList.activityId"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="关联活动" v-show="!isChange&&product.activityName">
                <el-input type="text" disabled v-model="currentProduct.activityName"></el-input>
              </el-form-item>-->
              <el-form-item label="设备型号" prop="brandId">
                <el-select
                  :disabled="isLinkActivity"
                  v-model="currentProduct.brandId"
                  placeholder="设备型号"
                  @change="getPrice(currentProduct.brandId)"
                >
                  <el-option
                    v-for="(item,index) in allModel"
                    :key="index"
                    :label="item.brandSubName"
                    :value="item.brandId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单价" prop="price">
                <el-input disabled v-model="currentProduct.price"></el-input>
              </el-form-item>
              <span style="display:inline-block;line-height:32px">元</span>
              <el-form-item label="套装数量" prop="deviceNum">
                <el-input
                  :disabled="isLinkActivity"
                  type="number"
                  min="0"
                  @input="countSum"
                  v-model="currentProduct.deviceNum"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="销售价格" prop="packagePrice">
                <el-input :disabled="isLinkActivity" v-model="currentProduct.packagePrice"></el-input>
              </el-form-item>
              <span style="display:inline-block;line-height:32px">元</span>
              <el-form-item width="100%" label="序号" prop="orderNo">
                <el-input v-model="currentProduct.orderNo" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="5">商品大图</el-col>
            <el-col :span="18">
              <div class="grid-content bg-purple-light">
                <div class="bigImgBox">
                  <span
                    class="el-icon-plus"
                    v-show="bigPlus"
                    style="width:100%;font-size:50px;text-align:center;line-height:200px"
                  ></span>
                  <img
                    class="bigProductPic"
                    @click="clickBigPicture($event)"
                    :src="currentProduct.bigPic"
                  >
                  <input type="file" class="hidden_file_input" @change="getBigPicture($event)">
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row style="padding-top:10px">
            <el-col :span="5">商品小图</el-col>
            <el-col :span="18">
              <div class="grid-content bg-purple-light">
                <div class="smallImgBox">
                  <span
                    class="el-icon-plus"
                    v-show="smallPlus"
                    style="width:100%;font-size:20px;text-align:center;line-height:80px"
                  ></span>
                  <img
                    class="smallProductPic"
                    @click="clickSmallPicture($event)"
                    :src="currentProduct.smallPic"
                  >
                  <input
                    type="file"
                    class="hidden_file_input"
                    ref="uploadSmallPicture"
                    @change="getSmallPicture($event)"
                  >
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="productHide">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnStatus"
          :disabled="btnValid"
          @click="actRelease('productForm')"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { post, postWithFile } from '../../store/requestFacade.js'
import { img } from '../../core'
export default {
  props: {
    allModel: {
      type: Array,
      default: () => []
    },
    product: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      title: '',
      isLinkActivity: false,
      activeList: {},
      isChange: true,
      btnStatus: false,
      btnValid: false,
      currentProduct: {
        packageId: '',
        packageName: '',
        brandId: '',
        price: '',
        deviceNum: '',
        packagePrice: '',
        orderNo: '',
        packageStatus: 0,
        activityName: '',
        bigPic: null,
        smallPic: null
      },
      smallpic: null,
      bigPic: null,
      bigPlus: true,
      smallPlus: true,
      rules: {
        packageName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        brandId: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
        deviceNum: [{ required: true, message: '请输入套装数量', trigger: 'blur' }],
        packagePrice: [{ required: true, message: '请输入销售价格', trigger: 'blur' }],
        orderNo: [{ required: true, message: '请输入序号', trigger: 'blur' }]
      }
    }
  },
  watch: {
    async bigPic(newVal, oldVal) {
      this.currentProduct.bigPic = await img.readFile(newVal)
    },
    async smallpic(newVal, oldVal) {
      this.currentProduct.smallPic = await img.readFile(newVal)
    }
  },
  methods: {
    linkActivity() {
      if (this.currentProduct.activityName) {
        this.isLinkActivity = true
        this.currentProduct.brandId = this.activeList.brandId
        this.currentProduct.price = this.activeList.price
        this.currentProduct.deviceNum = this.activeList.number
        this.currentProduct.packagePrice = this.activeList.activityAmt
      } else {
        this.isLinkActivity = false
      }
    },
    clearActivity() {
      this.isLinkActivity = false
      this.currentProduct.brandId = ''
      this.currentProduct.deviceNum = ''
    },
    actRelease(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.product) {
            this.modify()
          } else {
            this.releaseBtn()
          }
        } else {
          return false
        }
      })
    },
    // 根据设备型号获取价格
    async getPrice(brandId) {
      console.log('price' + brandId)
      try {
        const res = await post({
          url: 'posBrand/getBrand',
          data: {
            brandId: brandId
          }
        })
        this.currentProduct.price = res.data.price
      } catch (err) {
        console.log(err)
      }
    },
    // 计算总价格
    countSum() {
      this.currentProduct.packagePrice = this.currentProduct.price * this.currentProduct.deviceNum
    },
    productHide() {
      this.$emit('productHide')
    },
    clickBigPicture(e) {
      console.log(e.currentTarget.nextElementSibling)
      e.currentTarget.nextElementSibling.click()
    },
    clickSmallPicture(e) {
      e.currentTarget.nextElementSibling.click()
    },
    getBigPicture(e) {
      this.bigPlus = false
      const [bigPicture] = e.currentTarget.files
      this.bigPic = bigPicture
      console.log(e.currentTarget.files)
      const isLt3M = bigPicture.size / 1024 / 1024
      if (isLt3M > 3) {
        this.btnValid = true
        this.$message({
          type: 'info',
          message: '上传图片大小不能超过3M'
        })
      } else {
        this.btnValid = false
      }
    },
    getSmallPicture(e) {
      this.smallPlus = false
      const [smallPicture] = e.currentTarget.files
      this.smallpic = smallPicture
      const isLt3M = smallPicture.size / 1024 / 1024
      if (isLt3M > 3) {
        this.btnValid = true
        this.$message({
          type: 'info',
          message: '上传图片大小不能超过3M'
        })
      } else {
        this.btnValid = false
      }
    },
    // 活动列表
    async getActiveList() {
      try {
        const res = await post({
          url: 'activity/getActivity'
        })
        this.activeList = res.data
        if (!res.data.activityName) {
          this.activeList.activityId = ''
          this.activeList.activityName = ''
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 添加商品
    async releaseBtn() {
      if (!this.currentProduct.activityName) {
        this.activeList.activityId = ''
        this.activeList.activityName = ''
      }
      this.btnStatus = true
      const params = {
        brandId: this.currentProduct.brandId,
        packageName: this.currentProduct.packageName,
        packagePrice: this.currentProduct.packagePrice,
        price: this.currentProduct.price,
        deviceNum: this.currentProduct.deviceNum,
        orderNo: this.currentProduct.orderNo,
        packageStatus: this.currentProduct.packageStatus,
        activityId: this.activeList.activityId,
        activityName: this.activeList.activityName
      }
      try {
        const res = await postWithFile({
          url: 'devicePackage/addDevicePackage',
          data: params,
          fileForm: {
            small_pic: this.smallpic,
            big_pic: this.bigPic
          }
        })
        this.$emit('modifyEnd')
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.btnStatus = false
      } catch (error) {
        this.$message(error.message)
        this.btnStatus = false
      }
    },
    // 修改商品
    async modify() {
      if (!this.currentProduct.activityName) {
        this.activeList.activityId = ''
        this.activeList.activityName = ''
      }
      this.btnStatus = true
      const params = {
        packageId: this.currentProduct.packageId,
        brandId: this.currentProduct.brandId,
        packageName: this.currentProduct.packageName,
        packagePrice: this.currentProduct.packagePrice,
        price: this.currentProduct.price,
        deviceNum: this.currentProduct.deviceNum,
        orderNo: this.currentProduct.orderNo,
        packageStatus: this.currentProduct.packageStatus,
        activityId: this.activeList.activityId,
        activityName: this.activeList.activityName
      }
      try {
        const res = await postWithFile({
          url: 'devicePackage/editDevicePackage',
          data: params,
          fileForm: {
            small_pic: this.smallpic,
            big_pic: this.bigPic
          }
        })
        this.btnStatus = false
        this.$emit('modifyEnd')
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (error) {
        this.$message(error.message)
        this.btnStatus = false
      }
    }
  },
  mounted() {
    this.getActiveList()
    if (!this.product) {
      this.title = '发布商品'
    } else {
      if (this.product.activityName) {
        this.isLinkActivity = true
        this.isChange = true
      } else {
        this.isChange = false
      }
      this.bigPlus = false
      this.smallPlus = false
      this.title = '编辑商品'
      Object.keys(this.product).forEach(key => {
        this.$set(this.currentProduct, key, this.product[key])
      })
      console.log(this.currentProduct.bigPic)
    }
  }
}
</script>
<style scoped>
.bigImgBox {
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  position: relative;
}
.smallImgBox {
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
  position: relative;
}
.bigProductPic {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.smallProductPic {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.hidden_file_input {
  display: none;
}
</style>
