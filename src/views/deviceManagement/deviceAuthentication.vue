<template>
  <div class="devAutList"></div>
</template>

<script>
import { queryPermission } from '@/util'
export default {
  name: 'device-authentication',
  data() {
    return {
      screen: {
        member: '',
        phone: '',
        serialNumber: '',
        region: ''
      }
    }
  },
  methods: {},
  computed: {
    canDeviceAuthenticationAudit() {
      return queryPermission('deviceAuthenticationAudit')
    },
    canDeviceAuthenticationFail() {
      return queryPermission('deviceAuthenticationFail')
    }
  }
}
</script>
<style scoped>
</style>
