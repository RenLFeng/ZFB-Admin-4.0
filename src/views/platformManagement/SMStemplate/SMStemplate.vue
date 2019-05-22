<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item='平台管理,短信模板'></Breadcrumb>
    </div>
    <div class="messageTemplate">
      <div class="templateCategory">
        <el-button
          type="text"
          @click="addCategory"
          style="width:50%;text-align:right"
        ><i class="el-icon-lx-tianjia"></i> 新建</el-button>
        <el-table
          border
          style="width: 50%"
          size="small"
        >
          <el-table-column
            prop="factoryName"
            label="模板类别"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <newCategory
        v-if="categoryPop"
        @closeCategory='closeCategory'
      ></newCategory>
      <div class="categoryChild">
        <el-button
          style="width:90%;text-align:right"
          type="text"
          @click="addCategoryChild"
        ><i class="el-icon-lx-tianjia"></i> 新建</el-button>
        <el-table
          border
          style="width: 90%"
          size='small'
        >
          <el-table-column
            v-for="(v, i) in table"
            :prop="v.tableProp"
            :label="v.tableLabel"
            :width="v.width"
            :key="i"
          >
          </el-table-column>
          <el-table-column
            prop="factorySubName"
            label="启用状态"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
              >启用</el-button>
              <el-button
                type="text"
                size="small"
              >暂停</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <newCategoryChild
      v-if="categoryChildPop"
      @closeCategoryChild='closeCategoryChild'
    ></newCategoryChild>
  </div>
</template>
<script>
import { smsColumn } from '../own/SMStemplate.js'
import { post } from '../../../store/requestFacade.js'
import newCategory from './newCategory'
import newCategoryChild from './newCategoryChild'
export default {
  components: {
    newCategory,
    newCategoryChild
  },
  data() {
    return {
      table: smsColumn,
      categoryPop: false,
      categoryChildPop: false
    }
  },
  methods: {
    addCategory() {
      this.categoryPop = true
    },
    addCategoryChild() {
      this.categoryChildPop = true
    },
    closeCategory() {
      this.categoryPop = false
    },
    closeCategoryChild() {
      this.categoryChildPop = false
    }
  }
}
</script>
<style scoped>
</style>
