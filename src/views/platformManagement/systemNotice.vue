<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>平台管理</el-breadcrumb-item>
        <el-breadcrumb-item>系统公告</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form style="position:relative;padding-top:40px">
      <el-button class="release" type="text" @click="releaseNotice">{{releaseText}}</el-button>
      <el-form-item label="公告标题" label-width="80px">
        <el-input @change="checkoutTitle" minlength="2" maxlength="20" v-model.trim="noticeTitle"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" label-width="80px" prop="newContent">
        <el-input
          type="textarea"
          @change="checkoutNoticeCon"
          :autosize="{ minRows: 10}"
          minlength="2"
          maxlength="500"
          v-model.trim="noticeContent"
        ></el-input>
      </el-form-item>
      <el-form-item label="有效期" label-width="80px">
        <el-date-picker
          v-model="noticeValidTime"
          :picker-options="pickerOptions"
          :clearable="false"
          format="yyyy-MM-dd"
          value-format="timestamp"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :unlink-panels="true"
          range-separator="至"
          style="margin-right:10px"
        ></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { post } from '../../store/requestFacade.js'
export default {
  data() {
    return {
      noticeTitle: '',
      noticeContent: '',
      noticeValidTime: [],
      releaseText: '发布',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    checkoutTitle() {
      console.log(this.noticeTitle.length)
      if (this.noticeTitle === '') {
        this.$message({
          message: '请输入标题'
        })
      } else if (this.noticeTitle.length < 2) {
        this.$message({
          message: '标题字数过短'
        })
      }
    },
    checkoutNoticeCon() {
      if (!this.noticeContent) {
        this.$message({
          message: '请输入公告内容'
        })
      } else if (this.noticeContent.length < 2) {
        this.$message({
          message: '公告内容字数过短'
        })
      }
    },
    async getNoticeInfo() {
      try {
        const res = await post({
          url: 'notice/query'
        })
        if (res.data) {
          this.releaseText = '重新发布'
          this.noticeTitle = res.data.noticeTitle
          this.noticeContent = res.data.noticeInfo
          this.noticeValidTime = [res.data.noticeStartTime, res.data.noticeEndTime]
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 时间戳转为日期字符串
    formatDate(time) {
      const d = new Date(time)
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const day = d.getDate()
      return year + '-' + month + '-' + day
    },
    async releaseNotice() {
      try {
        console.log(this.noticeValidTime)
        const res = await post({
          url: 'notice/edit',
          data: {
            noticeTitle: this.noticeTitle,
            noticeInfo: this.noticeContent,
            noticeStateDate: this.formatDate(this.noticeValidTime[0]),
            noticeEndDate: this.formatDate(this.noticeValidTime[1])
          }
        })
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getNoticeInfo()
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth()
    const day = new Date().getDate() + 7
    this.getNoticeInfo()
    const timestamp = new Date(year, month, day).getTime()
    this.noticeValidTime = [new Date().getTime(), timestamp]
  }
}
</script>
<style scoped>
.base-tit {
  padding-top: 12px;
  padding-bottom: 12px;
}
.release {
  position: absolute;
  top: 0;
  right: 5px;
}
</style>
