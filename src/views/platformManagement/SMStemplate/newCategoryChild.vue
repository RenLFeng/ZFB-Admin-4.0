<template>
  <div>
    <el-dialog
      :title='title'
      :visible='true'
      :before-close='handClose'
      width='35%'
    >
      <el-form :model='categoryChildData'>
        <el-form-item
          label-width='80px'
          label='模板类别'
        >
          <el-select
            v-model="value"
            placeholder='请选择'
          >
            <el-option value='1'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label-width='80px'
          label='类别子项'
        >
          <el-input
            placeholder="请输入内容"
            :maxlength="fixedSubCategoryLength"
            v-model="subCategory"
            onkeyup="value=value.replace(/\s/g,'')"
            @input="calSubCategoryLength"
          ></el-input>
          <i
            style="position:absolute;right:5px"
            :class="{'red':subCategoryLenthWarn === true}"
          >{{getSubCategoryLength}}/{{fixedSubCategoryLength}}</i>
        </el-form-item>
        <el-form-item
          label-width='80px'
          label='模板内容'
        >
          <el-input
            :maxlength="fixedTemContentLength"
            type="textarea"
            resize="none"
            :rows="5"
            v-model="temContent"
            placeholder="请输入内容"
            onkeyup="value=value.replace(/\s/g,'')"
            @input='calTemContentLength'
          >
          </el-input>
          <i
            style="position:absolute;right:5px;bottom:-3px"
            :class="{'red':temContentWarn === true}"
          >{{getTemContentLength}}/{{fixedTemContentLength}}</i>
        </el-form-item>
        <el-form-item
          label-width='80px'
          label='发送形式'
        >
          <el-checkbox v-model="value">自动发送</el-checkbox>
          <el-checkbox v-model="value">手动发送</el-checkbox>
        </el-form-item>
      </el-form>
      <div
        class="dialog-footer"
        slot='footer'
      >
        <el-button @click="handClose">
          取消
        </el-button>
        <el-button type="primary">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      title: '',
      subCategory: '',
      temContent: '',
      categoryChildData: {},
      getSubCategoryLength: 0,
      getTemContentLength: 0,
      fixedSubCategoryLength: 10,
      fixedTemContentLength: 100,
      subCategoryLenthWarn: false,
      temContentWarn: false
    }
  },
  methods: {
    handClose() {
      this.$emit('closeCategoryChild')
    },
    calSubCategoryLength() {
      this.getSubCategoryLength = this.subCategory.trim().length
      if (this.subCategory.length >= this.fixedSubCategoryLength) {
        this.subCategoryLenthWarn = true
      } else {
        this.subCategoryLenthWarn = false
      }
    },
    calTemContentLength() {
      this.getTemContentLength = this.temContent.trim().length
      if (this.temContent.length >= this.fixedTemContentLength) {
        this.temContentWarn = true
      } else {
        this.temContentWarn = false
      }
    }
  }
}
</script>
<style scoped>
.el-input >>> .el-input__inner {
  padding-right: 45px;
}
.red {
  color: red;
}
</style>
