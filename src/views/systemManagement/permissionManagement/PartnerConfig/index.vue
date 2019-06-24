<template>
  <div>
    <div style="margin:15px 0">
      <Breadcrumb item="系统管理,系统设置"></Breadcrumb>
    </div>
    <section class="wrap">
      <el-row>
        <!-- <el-col :span="22">
          <h1 v-if="getDetail.activityName">当前在线的活动是:{{getDetail.activityName}}</h1>
          <h1 v-else>当前在线的活动是:无</h1>
        </el-col>
          <el-col :span="2" style="float:right">
            <el-button type="primary" plain @click="newActivity">新建活动</el-button>
          </el-col> -->
        <!-- <el-col :span="24">
          <el-col :span="22">
            <el-button
              v-if="getDetail.activityName"
              type="primary"
              plain
              @click="currentActivity"
            >查看当前活动详情</el-button>
            <el-button type="primary" v-if="!getDetail.activityName" @click="openBtn" plain>开启活动</el-button>
            <el-button type="warning" v-if="getDetail.activityName" @click="switchBtn" plain>切换活动</el-button>
            <el-button type="danger" v-if="getDetail.activityName" @click="closeBtn" plain>关闭活动</el-button>
          </el-col>
          <el-col :span="2" style="float:right">
            <el-button type="primary" plain @click="newActivity">新建活动</el-button>
          </el-col>
        </el-col> -->
      </el-row>
    </section>
    <section>
      <el-table :data="dealData" class="modify" border>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="tableExpandLayout" style="text-align:left">
              <el-form size="small" :inline="true">
                <el-form-item label="活动名称">
                  <span>{{ props.row.activityName }}</span>
                </el-form-item>
                <div style="display:flex">
                  <div>
                    <h4>开通合伙人</h4>
                    <el-form-item label="开通费用">
                      <span>{{ props.row.activityAmount }} 元</span>
                    </el-form-item>
                  </div>
                  <div style="margin:0 0 0 50px">
                    <h4>手续费</h4>
                    <el-form-item label="平台">
                      <span>{{ props.row.platformProfitAmount }} 元</span>
                    </el-form-item>
                  </div>
                </div>
                <h4>
                  激活奖励
                  <span style="font-size:14px">(用户激活当日起，给予直属上两级合伙人奖励金)</span>
                </h4>
                <el-form-item label="设备型号" prop="brandSubName">
                  <span>{{ props.row.brandSubName}}</span>
                </el-form-item>
                <el-form-item label="设备数量">
                  <span>{{ props.row.posNums }} 台</span>
                </el-form-item>
                <el-form-item label="激活总金额">
                  <span>{{ props.row.activityRewardAmount }} 元</span>
                </el-form-item>
                <h4>
                  订单返现
                  <span style="font-size:14px">(订单返给直属机构的设备款)</span>
                </h4>
                <el-form-item label="直属机构">
                  <span>{{ props.row.orderCashBackAmount }} 元</span>
                </el-form-item>
                <h4>开通合伙人奖励</h4>
                <el-form-item label="奖励总金额">
                  <span>{{ props.row.openPatenerRewardAmount }} 元</span>
                </el-form-item>
                <h4 style="font-size:16px">开通合伙人奖励分配规则</h4>
                <el-form-item label="分公司">
                  <span>{{ props.row.provRewardAmount }} 元</span>
                </el-form-item>
                <el-form-item label="子公司">
                  <span>{{ props.row.onelevelOrganRewardAmount }} 元</span>
                </el-form-item>
                <el-form-item label="高级合伙人">
                  <span>{{ props.row.twolevelOrganRewardAmount }} 元</span>
                </el-form-item>
                <el-form-item label="直接合伙人">
                  <span>{{ props.row.directPartnerRewardAmount }} 元</span>
                </el-form-item>
                <el-form-item label="间接合伙人">
                  <span>{{ props.row.indirectPartnerRewardAmount }} 元</span>
                </el-form-item>
                <el-form-item v-show="props.row.enable === 0">
                  <el-button size="medium" type="primary" @click="handleEditItem(props.row)">编辑配置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-for="v in tableHead" :prop="v.value" :label="v.label" :key="v.id"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-if="scope.row.enable=='0'" @click="details(scope.row)">启用</el-button>
            <el-button type="danger" size="mini" v-if="scope.row.enable=='1'" @click="disableState(scope.row)">禁用</el-button>
             <!-- <el-button size="mini">详情</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </section>
    <new-activity
      v-if="activityShow"
      :detail="activedObj"
      :getType="type"
      :models="models"
      @close="close"
      @fresh="fresh"
    ></new-activity>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="handleClose"
      title="切换活动"
      :visible.sync="visible"
      width="20%"
      center
    >
      <el-form>
        <el-form-item label="活动列表">
          <el-select v-model="switchActivityId" placeholder="请选择" clearable>
            <el-option
              v-for="v in unopen"
              :value="v.activityId"
              :label="v.activityName"
              :key="v.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="toSwitch">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :before-close="openClose"
      title="开启活动"
      :visible.sync="isOpen"
      width="20%"
      center
    >
      <el-form>
        <el-form-item label="活动列表">
          <el-select v-model="openActivityId" placeholder="请选择" clearable>
            <el-option
              v-for="v in unopen"
              :value="v.activityId"
              :label="v.activityName"
              :key="v.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="toOpen">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { post } from '../../../../store/requestFacade.js'
import { tableHead, parseTable } from './map.js'
import newActivity from './newActivity'

export default {
  components: {
    newActivity
  },
  data() {
    return {
      dealData: [],
      type: 'add',
      activedObj: {},
      switchActivityId: '',
      openActivityId: '',
      unopen: [],
      visible: false,
      isOpen: false,
      currentDetail: {},
      getDetail: {
        activityName: ''
      },
      models: [],
      getBrandName: '',
      activityShow: false,
      key: 'value',
      tableHead: [],
      tableData: [],
      currentRows: {
        activityName: '',
        activityAmount: '',
        brandId: '',
        posNums: '',
        openPatenerRewardAmount: '',
        orderCashBackAmount: '',
        platformProfitAmount: '',
        activityRewardAmount: '',
        provRewardAmount: '',
        onelevelOrganRewardAmount: '',
        twolevelOrganRewardAmount: '',
        directPartnerRewardAmount: '',
        indirectPartnerRewardAmount: ''
      },
      allName: []
    }
  },
  methods: {
    //启用
    details(item){
      // console.log(item);
    this.$confirm('你确定要启用开通合伙人套餐'+item.activityName+'的配置吗？')
          .then( ()=> {

            this.open2(item)
          })
          .catch(_ => {});
    },
    //禁用
    disableState(item){
       this.$confirm('你确定要禁用开通合伙人套餐'+item.activityName+'的配置吗？')
          .then(_ => {
            this.open2(item)
          })
          .catch(_ => {});
    },
    openBtn() {
      this.isOpen = true
      if (this.openActivityId) {
        this.openActivityId = ''
      }
      this.unopen = this.tableData.filter(v => {
        return v.enable === 0
      })
    },
    switchBtn() {
      this.visible = true
      if (this.switchActivityId) {
        this.switchActivityId = ''
      }
      this.unopen = this.tableData.filter(v => {
        return v.enable === 0
      })
    },
    handleClose() {
      this.visible = false
    },
    openClose() {
      this.isOpen = false
    },
    // getCurrentRow(row, expandedRows) {},
    // 开启活动
    async toOpen() {
      if (this.unopen.length === 0) {
        this.$message({
          type: 'warning',
          message: '暂无活动可开启'
        })
      } else if (!this.openActivityId) {
        this.$message({
          type: 'warning',
          message: '请选择活动'
        })
      } else {
        let name = this.unopen.filter(v => {
          return v.activityId === this.openActivityId
        })
        this.$confirm('您确定要开启' + name[0].activityName + '的配置吗？', '开启', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            this.isOpen = false
            this.open()
          })
          .catch(() => {})
      }
    },

    async open() {
      try {
        const res = await post({
          url: 'activity/updActivityStatus',
          data: {
            enable: 1,
            activityId: this.openActivityId
          }
        })
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getAllActivity()
      } catch (err) {
        console.log(err)
      }
    },
    async open2(item) {
      try {
        const res = await post({
          url: 'activity/updActivityStatus',
          data: {
            enable: item.enable,
            activityId:item.activityId
          }
        })
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getAllActivity()
      } catch (err) {
        console.log(err)
      }
    },
    // 切换活动
    toSwitch() {
      if (this.unopen.length === 0) {
        this.$message({
          type: 'warning',
          message: '暂无活动可切换'
        })
      } else if (!this.switchActivityId) {
        this.$message({
          type: 'warning',
          message: '请选择活动'
        })
      } else {
        let name = this.unopen.filter(v => {
          return v.activityId === this.switchActivityId
        })
        this.$confirm(
          '存在正在启用的开通合伙人配置，您确定要启用' + name[0].activityName + '的配置吗？',
          '启用',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }
        )
          .then(() => {
            this.switch()
            this.visible = false
          })
          .catch(() => {})
      }
    },
    async switch() {
      try {
        const res = await post({
          url: 'activity/updActivityStatus',
          data: {
            enable: 1,
            activityId: this.switchActivityId
          }
        })
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getAllActivity()
      } catch (err) {
        console.log(err)
      }
    },
    // 关闭活动
    closeBtn() {
      this.$confirm('您确定要关闭当前活动？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.closeActivity()
        })
        .catch(() => {})
    },
    async closeActivity() {
      this.openActivityId = ''
      try {
        const res = await post({
          url: 'activity/updActivityStatus',
          data: {
            enable: 2,
            activityId: this.getDetail.activityId
          }
        })
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getAllActivity()
      } catch (err) {
        console.log(err)
      }
    },
    // 获取所有活动
    async getAllActivity() {
      try {
        const res = await post({
          url: 'activity/query'
        })
        this.tableData = parseTable(res.data.rows)
        this.dealData = this.tableData.map(v => ({
          ...v,
          brandSubName: this.getBrand(v.brandId)
        }))
        this.unopen = this.tableData.filter(v => {
          return v.enable === 0
        })
        if (res.data.obj) {
          this.getDetail = res.data.obj
        } else {
          this.getDetail = {}
        }
      } catch (err) {
        console.log(err)
      }
    },
    handleEditItem(rows) {
      this.type = 'edit'
      this.activedObj = rows
      console.log('rows: ', rows)
      this.activityShow = true
    },
    // 获取设备型号
    async getModel() {
      try {
        const res = await post({
          url: 'activity/queryBrand'
        })
        this.models = res.data
      } catch (err) {
        console.log(err)
      }
    },
    getBrand(id) {
      for (let i = 0; i < this.models.length; i++) {
        if (this.models[i].brandId === id) {
          return this.models[i].brandSubName
        }
      }
    },
    //新建活动
    newActivity() {
      this.type = 'add'
      this.activedObj = {}
      this.activityShow = true
    },
    //查看当前活动详情
    currentActivity() {
      this.activityShow = true
      this.activedObj = this.getDetail
      this.type = 'look'
    },
    close() {
      this.activityShow = false
    },
    fresh() {
      this.activityShow = false
      this.getAllActivity()
    }
  },
  mounted() {
    this.getModel()
    this.getAllActivity()
    this.tableHead = tableHead()
  }
}
</script>
<style scoped lang='css'>
.el-form-item >>> label {
  color: #99a9bf;
}
</style>
<style scoped lang ='scss' >
@import './index.scss';
.modify {
  &::before {
    opacity: 0;
  }
}
</style>

