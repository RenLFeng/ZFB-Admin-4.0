<template>
  <div>
    <div class="base-tit">
      <Breadcrumb item='设备管理,设备退单'></Breadcrumb>
    </div>
    <div class="searchBox">
      <el-form
        :inline="true"
        size="small"
      >
        <el-form-item>
          <el-date-picker
            v-model="startTime"
            type="date"
            placeholder="申请开始时间"
            clearable
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>至</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="endTime"
            type="date"
            placeholder="申请结束时间"
            clearable
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            placeholder='合伙人姓名'
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            placeholder="合伙人手机号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            placeholder="直属机构名称或编号"
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
            v-model="orderStatus"
            clearable
            placeholder="订单状态"
          >
            <el-option
              v-for="(item,index) in getOrderStatus"
              :key="index"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="auditStatus"
            clearable
            placeholder="审核状态"
          >
            <el-option
              v-for="(item,index) in getAuditStatus"
              :key="index"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data='chargebackInfo'
      border
      size='small'
    >
      <el-table-column
        v-for="(v, i) in table.slice(0,5)"
        :prop="v.tableProp"
        :label="v.tableLabel"
        :key="i"
      >
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <span style="color:#67C23A">审核通过</span>
          <span style="color:#F56C6C">审核不通过</span>
          <span>待审核</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="v in table.slice(5)"
        :prop="v.tableProp"
        :label="v.tableLabel"
        :key="v.tableLabel"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width=200
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="passBtn"
          >通过</el-button>
          <el-button
            type="text"
            style="color:red"
            @click="failBtn"
          >不通过</el-button>
        </template>
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
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="审核"
      :visible.sync="isFail"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        label-position='top'
        size="small"
      >
        <el-form-item label="审核意见">
          <el-input
            v-model="remark"
            type="textarea"
          >

          </el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="isFail = false">取 消</el-button>
        <el-button
          type="primary"
          @click="sureFail"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { chargebackColumn } from './own/chargeback.js'
import { post } from '../../store/requestFacade.js'
import { mixins } from '@/core'
export default {
  mixins: [mixins.pageMixin],
  data() {
    return {
      table: [],
      startTime: '',
      endTime: '',
      model: '',
      modelData: [],
      orderStatus: '',
      getOrderStatus: [
        {
          id: 1,
          value: '未收货'
        },
        {
          id: 2,
          value: '已发货'
        },
        {
          id: 3,
          value: '订单完成'
        },
        {
          id: 4,
          value: '退单成功'
        }
      ],
      auditStatus: '',
      getAuditStatus: [
        {
          id: 1,
          value: '待审核'
        },
        {
          id: 2,
          value: '审核通过'
        },
        {
          id: 3,
          value: '审核不通过'
        }
      ],
      chargebackInfo: [{ i: 0 }],
      remark: '',
      isFail: false
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
    passBtn() {
      this.$confirm('您确定同意退单申请吗？', '通过审核')
        .then(() => {
          // 调用接口
        })
        .catch(() => {})
    },
    failBtn() {
      this.isFail = true
    },
    sureFail() {
      if (this.remark === '') {
        this.$message({
          type: 'warning',
          message: '内容不能为空'
        })
      } else {
        // 调用接口
      }
    },
    handleClose() {
      this.isFail = false
    }
  },
  mounted() {
    this.table = chargebackColumn()
    this.getModel()
  }
}
</script>