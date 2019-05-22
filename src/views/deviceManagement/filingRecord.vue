<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item='设备管理,报备记录'></Breadcrumb>
    </div>
    <div class="searchBox">
      <el-form
        :inline="true"
        size="small"
      >
        <el-form-item>
          <el-input
            clearable
            placeholder="用户姓名"
            v-model="userName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            placeholder="用户手机号码"
            v-model="userPhone"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            v-model="bank"
            placeholder="发卡行"
          >
            <el-option
              v-for="(item ,index) in ourbank"
              :key="index"
              :label="item.btName"
              :value="item.btCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            clearable
            placeholder="卡类型"
            v-model="cardType"
          >
            <el-option
              v-for="(item, index)  in cardTypes"
              :label="item.value"
              :value='item.id'
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            placeholder="设备编号"
            v-model="deviceNumber"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="model"
            clearable
            placeholder="设备型号"
          >
            <el-option
              v-for="(item,index) in modelData"
              :key="index"
              :label="item.brandSubName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="status"
            clearable
            placeholder="报备状态"
          >
            <el-option
              v-for="(item,index) in statusData"
              :key="index"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="startTime"
            type="date"
            placeholder="报备开始时间"
            clearable
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="endTime"
            type="date"
            placeholder="报备结束时间"
            clearable
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      size='small'
      style="width:100%"
    >
      <el-table-column
        v-for="(v, i) in table"
        :prop="v.tableProp"
        :label="v.tableLabel"
        :key="i"
      >
      </el-table-column>
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
import { recordColumn } from './own/filingRecord.js'
import { post } from '../../store/requestFacade.js'
import { mixins } from '@/core'
export default {
  mixins: [mixins.pageMixin],
  data() {
    return {
      table: recordColumn,
      userName: '',
      userPhone: '',
      bank: '',
      cardType: '',
      deviceNumber: '',
      status: '',
      cardTypes: [
        {
          id: 1,
          value: '磁条卡'
        },
        {
          id: 2,
          value: '芯片卡'
        }
      ],
      statusData: [
        {
          id: 1,
          value: '报备成功'
        },
        {
          id: 2,
          value: '报备失败'
        }
      ],
      startTime: '',
      endTime: '',
      model: '',
      ourbank: [],
      modelData: []
    }
  },
  methods: {
    // 型号
    async getModel() {
      try {
        const res = await post({
          url: 'posBrand/queryBrand'
        })
        this.modelData = res.data.rows
      } catch (err) {
        console.log(err)
      }
    },
    // 发卡行
    async getbank() {
      try {
        const res = await post({
          url: 'channel/queryBankTrunk'
        })
        this.ourbank = res.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.getModel()
    this.getbank()
  }
}
</script>
