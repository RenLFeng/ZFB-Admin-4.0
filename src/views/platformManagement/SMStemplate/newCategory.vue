<template>
  <div>
    <el-dialog
      title='新增'
      :visible='true'
      :before-close='handClose'
      width='30%'
    >
      <el-form>
        <el-form-item
          label="模板类别"
          label-width='80px'
        >
          <el-input
            :maxlength="fixedLength"
            onkeyup="value=value.replace(/\s/g,'')"
            @input="countLength"
            v-model="categoryName"
          ></el-input>
          <i
            style="position:absolute;right:5px"
            :class="{'red':overLength === true}"
          >{{length}}/{{fixedLength}}</i>
        </el-form-item>
      </el-form>
      <div
        slot='footer'
        class='dialog-footer'
      >
        <el-button
          type='primary'
          @click='handClose'
        >
          取消
        </el-button>
        <el-button>保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      categoryName: '',
      length: 0,
      overLength: false,
      fixedLength: 20
    }
  },
  methods: {
    handClose() {
      this.$emit('closeCategory')
    },
    countLength() {
      this.length = this.categoryName.trim().length
      if (this.categoryName.length >= this.fixedLength) {
        this.overLength = true
      } else {
        this.overLength = false
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
