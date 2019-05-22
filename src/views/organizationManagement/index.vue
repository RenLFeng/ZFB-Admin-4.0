<template>
  <div>
    <organizations v-if="organShow === 1" @toOrgan="toOrgan" @addorgan="addorgan"></organizations>
    <organ-detail v-if="organShow === 2" :organId="organId" @modalClose="modalClose"></organ-detail>
    <add-organ v-if="organShow === 3" @modalClose="modalClose"></add-organ>
  </div>
</template>
<script>
import organizations from './organizations'
import organDetail from './organDetail'
import addOrgan from './addOrgan'
export default {
  components: {
    organizations,
    organDetail,
    addOrgan
  },
  data() {
    return {
      organShow: 1,
      organId: ''
    }
  },
  methods: {
    toOrgan(organId) {
      this.organShow = 2
      this.organId = organId
    },
    addorgan() {
      this.organShow = 3
    },
    modalClose() {
      this.organShow = 1
    }
  }
}
</script>