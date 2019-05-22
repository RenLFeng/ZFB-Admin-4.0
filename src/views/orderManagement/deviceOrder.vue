<template>
  <div>
    <device-order-ment v-if="showModule === 1" @seeDetails="seeDetails"></device-order-ment>
    <device-order-details :orderDerails="orderDerails" v-if="showModule === 2" @toback="toback"></device-order-details>
  </div>
</template>

<script>
import deviceOrderMent from './deviceOrder/deviceOrderMent'
import deviceOrderDetails from './deviceOrder/deviceOrderDetails'
export default {
  name: 'device-order',
  components: {
    deviceOrderMent,
    deviceOrderDetails
  },
  data() {
    return {
      showModule: 1,
      orderDerails: {}
    }
  },
  methods: {
    // 点击查看详情
    seeDetails(details) {
      this.showModule = details.showModule
      this.orderDerails = details.orderDerails
    },
    // 点击返回
    toback(data) {
      this.showModule = data
    }
  }
}
</script>

<style lang="css" scoped>
</style>
