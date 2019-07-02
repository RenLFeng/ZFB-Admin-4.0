<template>
  <div>
    <div class="base-tit">
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        @click="toback"
      >返回</el-button>
    </div>
    <div class="orderDetails">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="orderInfo">
            <div class="orderinfo">
              <div class="information">
                <h4>订单信息</h4>
                <p>订单编号 <span>{{orderinfo.orderNo}}</span></p>
                <!-- <p>发货类型 <span>{{orderinfo.type}}</span></p> -->
                <p>订单来源 <span>{{orderinfo.receiveName}}</span></p>
                <p>付款方式 <span>{{orderinfo.payType}}</span></p>
                <p>支付单号 <span>{{orderinfo.payOrderNo}}</span></p>
                <p style="margin-top: 20px">下单时间 <span>{{orderinfo.createDate}}</span></p>
                <p v-if="orderDerails.deliverStatus === 1">发货时间 <span>{{orderinfo.deliverDate}}</span></p>
                <p v-if="orderDerails.receiverStatus === 1">收货时间 <span>{{orderinfo.receiveDate}}</span></p>
              </div>
              <p>快递单号 <span>{{orderinfo.trackingNumber}}</span></p>
              <p>收货信息 <span>{{orderinfo.addressInfo}}</span></p>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="orderInfo">
            <div class="information">
              <h4><i
                  class="el-icon-warning"
                  style="color:#6376df"
                ></i> 订单状态：
                <span v-if="orderDerails.deliverStatus === 0">客户已下单,等待发货</span>
                <span v-if="orderDerails.deliverStatus === 1 && orderDerails.receiverStatus===0">设备已发货,等待客户确认收货</span>
                <span v-if="orderDerails.receiverStatus === 1">订单完成,客户已确认收货</span>
              </h4>

              <el-button
                v-if="candeviceOrderShipment"
                v-show="orderDerails.deliverStatus === 0"
                class="shipment"
                type="primary"
                plain
                size="small"
                @click="showShipments = true"
              >发货</el-button>
              <el-table
                :data="orderData"
                size="small"
                border
                style="width: 100%; margin-top:50px ;margin-bottom: 22px"
              >
                <el-table-column
                  prop="packageName"
                  label="商品名称"
                >
                </el-table-column>
                <el-table-column
                  prop="factoryName"
                  v-if="level === levelMap.PLATFORM"
                  label="设备厂商"
                >
                </el-table-column>
                <el-table-column
                  prop="brandName"
                  label="设备型号"
                >
                </el-table-column>
                <el-table-column
                  prop="totalPrice"
                  label="订单总价"
                >
                </el-table-column>
                <el-table-column
                  prop="number"
                  label="设备数量"
                >
                </el-table-column>
                <el-table-column
                  prop="organName"
                  label="机构名称"
                >
                </el-table-column>
                <el-table-column
                  prop="operator"
                  label="操作员"
                >
                </el-table-column>
              </el-table>
            </div>
            <h5 style="color:#6376df">平台提醒</h5>
            <p style="text-indent: 2em;">客户已付款,请尽快发货,设备如若发货,请及时跟进物流情况,请积极与客户协调沟通,做好售后服务</p>
          </div>
        </el-col>
      </el-row>
      <el-table
        :data="deviceData"
        border
        style="width: 99.4%;margin:13px"
      >
        <el-table-column
          prop="id"
          label="序号"
        >
        </el-table-column>
        <el-table-column
          prop="brandName"
          label="设备型号"
        >
        </el-table-column>
        <el-table-column
          prop="devNo"
          label="设备号"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
        >
        </el-table-column>
        <el-table-column
          prop="number"
          label="数量"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
        >
        </el-table-column>
        <div
          slot="empty"
          style="margin:15px"
        >
          <i
            class="el-icon-lx-pos"
            style="font-size:30px;"
          ></i>
          <p>暂无设备</p>
        </div>
      </el-table>
    </div>
    <deliver-goods
      v-if="showShipments"
      :shipmentsData="orderDerails"
      :toshow="showShipments"
      @invoking="invoking"
      @theShow="theShow"
    ></deliver-goods>
  </div>
</template>
<script>
import { post } from '../../../store/requestFacade.js'
import { queryPermission } from '@/util'
import deliverGoods from './deliverGoods'
import { levelMap } from '../../../server/level.js'
export default {
  name: 'device-order-details',
  components: {
    deliverGoods
  },
  props: {
    orderDerails: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      level: '',
      levelMap: levelMap,
      showShipments: false,
      orderinfo: {},
      orderData: [],
      deviceData: [],
      showModule: 1
    }
  },
  methods: {
    // 点击返回
    toback() {
      this.$emit('toback', this.showModule)
    },
    // 获取详情信息
    async getorderInfo() {
      try {
        const res = await post({
          url: 'orderPos/orderInfo',
          data: {
            orderNo: this.orderDerails.payOrderId
          }
        })
        console.log(res)
        this.orderinfo = res.data.orderPosInfo
        this.orderData = res.data.orderPosStatus
        this.deviceData = res.data.orderPosDevice
      } catch (err) {
        console.log(err)
      }
    },
    theShow() {
      this.showShipments = false
    },
    invoking() {
      this.showShipments = false
      this.getorderInfo()
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.getorderInfo()
  },
  computed: {
    candeviceOrderShipment() {
      return queryPermission('deviceOrderShipment')
    }
  }
}
</script>
<style scoped>
.base-tit {
  margin: 15px 0;
}
h4 {
  margin-bottom: 10px;
}
.orderInfo {
  margin-top: 5px;
  margin-left: 15px;
  /* border: 1px solid #999; */
  padding: 10px;
  background-color: white;
  height: 350px;
}
p {
  font-size: 14px;
  margin-left: 5px;
  color: #999;
  margin-top: 8px;
}

.information {
  height: 270px;
  border-bottom: dashed 1px #999;
  margin-bottom: 20px;
}
.shipment {
  float: right;
  margin-right: 50%;
  margin-top: -20px;
}
span {
  margin-left: 10px;
  font-size: 13px;
}
</style>
