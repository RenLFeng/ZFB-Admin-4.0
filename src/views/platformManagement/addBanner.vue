 <template>
    <div>
        <el-dialog :title='title' :visible='true' :before-close='bannerHide'>
            <el-form :rules='rules' ref="banForm" :model='currentBan'>
                <el-form-item label="轮播图" label-width="80px" label-height='100px'>
                  <div class="bannerBox" >
                    <img class="bannerPic" @click="clickBanner($event)" :src="currentBan.imgUrl">
                    <input type="file" class="hidden_file_input"  @change="getbanner($event)">
                  </div>
                </el-form-item>
                <el-form-item label="序号" label-width="80px" prop='sort'>
                    <el-input v-model='currentBan.sort'></el-input>
                </el-form-item>
                <el-form-item label="跳转链接" label-width="80px" prop='linkUrl'>
                    <el-input v-model="currentBan.linkUrl"></el-input>
                </el-form-item>
                <el-form-item style="text-indent:.8em" label="是否显示">
                    <el-radio v-model="currentBan.enable" label=1>显示</el-radio>
                    <el-radio v-model='currentBan.enable' label=0>不显示</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="actSave('banForm')"> 保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { postWithFile } from '../../store/requestFacade.js'
import { img } from '../../core'
export default {
  props: {
    perBan: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      title: '',
      banPic: '',
      currentBan: {
        sort: '',
        linkUrl: '',
        enable: '1',
        imgUrl: '',
        adId: ''
      },
      rules: {
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    actSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.perBan) {
            this.editBan()
          } else {
            this.addBan()
          }
        } else {
          return false
        }
      })
    },
    bannerHide() {
      this.$emit('bannerHide')
    },
    clickBanner(e) {
      e.currentTarget.nextElementSibling.click()
    },
    getbanner(e) {
      const [banPic] = e.currentTarget.files
      this.banPic = banPic
    },
    // 新增轮播图
    async addBan() {
      try {
        const res = await postWithFile({
          url: 'adInfo/adInfoAdd',
          data: {
            sort: this.currentBan.sort,
            linkUrl: this.currentBan.linkUrl,
            enable: this.currentBan.enable
          },
          fileForm: {
            ad: this.banPic
          }
        })
        this.$emit('addBan')
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 编辑轮播图
    async editBan() {
      try {
        const res = await postWithFile({
          url: 'adInfo/adInfoEdit',
          data: {
            adId: this.currentBan.adId,
            sort: this.currentBan.sort,
            linkUrl: this.currentBan.linkUrl,
            enable: this.currentBan.enable
          },
          fileForm: {
            ad: this.banPic
          }
        })
        this.$emit('addBan')
        this.$message({
          message: res.msg,
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  watch: {
    async banPic(newVal, oldVal) {
      this.currentBan.imgUrl = await img.readFile(newVal)
    }
  },
  mounted() {
    console.log(this.perBan)
    if (this.perBan) {
      this.title = '编辑'
      Object.keys(this.perBan).forEach(key => {
        let value = String(this.perBan[key])
        this.$set(this.currentBan, key, value)
      })
    } else {
      this.title = '添加'
    }
  }
}
</script>
<style scoped>
.bannerBox {
    width: 200px;
    height: 100px;
    border: 1px solid #ccc;
    position: relative;
}
.bannerPic {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
}
img[src='']{
    opacity:0
}
.hidden_file_input {
    display: none;
}
</style>
