<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>平台管理</el-breadcrumb-item>
        <el-breadcrumb-item>意见反馈</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="searchBox">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item>
          <el-date-picker
            v-model="beginTime"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetime"
            placeholder="创建开始时间"
          ></el-date-picker>至
          <el-date-picker
            v-model="endTime"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetime"
            placeholder="创建结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="feedbackList" border style="width: 100%">
      <el-table-column
        :prop="v.tableProp"
        :label="v.tableLabel"
        :key="v.tableLabel"
        v-for="v in table.slice(0,2)"
      ></el-table-column>
      <el-table-column prop="address" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" alt>
        </template>
      </el-table-column>
      <el-table-column
        :prop="v.tableProp"
        :label="v.tableLabel"
        :key="v.tableProp"
        v-for="v in table.slice(2)"
      ></el-table-column>
    </el-table>
    <div style="padding: 16px; background: white; overflow: hidden;">
      <div style="float: right;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="paging.currentPage"
          :page-size="paging.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paging.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { suggestionBaseColumn, parseSuggestion } from './own/suggestion.js'
import { mixins } from '@/core'
export default {
  name: 'suggestion',
  mixins: [mixins.pageMixin],
  data() {
    return {
      table: [],
      beginTime: '',
      endTime: '',
      feedbackList: []
    }
  },
  methods: {
    search() {
      this.loadData(true)
    },
    getUrl() {
      return 'feedBank/feedBank'
    },
    getPageParams() {
      return {
        beginTime: this.beginTime,
        endTime: this.endTime
      }
    },
    handleRows(rows) {
      this.feedbackList = parseSuggestion([].concat(rows))
    }
  },
  mounted() {
    this.loadData()
    this.table = suggestionBaseColumn()
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
