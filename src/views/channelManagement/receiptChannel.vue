<template>
  <div>
    <channel-table v-if="showModule === 1" @addChannel='addChannel' :editData='editData' @channelEdit='channelEdit' @banklist="banklist" :channelType="2"></channel-table>
    <channel-detail v-if="showModule === 2" @toback='toback' :editData='editData' :channelType="2"></channel-detail>
    <bank-table v-if="showModule === 3" @toback='toback' :channelId='channelId' :channelType="2"></bank-table>
  </div>
</template>

<script>
import channelTable from './channel/channelTable'
import channelDetail from './channel/channelDetail'
import bankTable from './channel/bankTable'
export default {
  name: 'channel-create',
  components: {
    channelTable,
    channelDetail,
    bankTable
  },
  data() {
    return {
      showModule: 1,
      editData: {},
      channelId: ''
    }
  },
  methods: {
    addChannel(data) {
      this.editData = null
      this.showModule = data.showModule
    },
    toback(data) {
      this.showModule = data
    },
    channelEdit(data) {
      this.editData = data.EditData
      this.showModule = data.showModule
    },
    banklist(data) {
      this.showModule = data.Module
      this.channelId = data.channelId
    }
  }
}
</script>

<style lang="css" scoped>
.btn {
  margin: 15px 15px;
}
</style>
