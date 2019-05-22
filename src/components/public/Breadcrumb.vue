
<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      v-for="v in itemList"
      :key="v"
    >{{v}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    item: String
  },
  computed: {
    itemList: function() {
      return this.item.split(',')
    }
  }
}
</script>

<style scoped>
</style>
