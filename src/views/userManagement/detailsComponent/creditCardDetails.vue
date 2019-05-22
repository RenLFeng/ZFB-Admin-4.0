<template>
  <div>
    <reported-offine :organId="this.organId"></reported-offine>
  </div>
</template>
<script>
import reportedOffine from './reportedOffine'
export default {
  name: 'credit-card-details',
  components: {
    reportedOffine
  },
  props: {
    organId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      activeName: 'onlineAuthentication'
    }
  },
  methods: {

  },
  mounted() {

  }
}
</script>
<style scoped>

</style>
