<template>
  <div class="wrapper">
    <header>
      <v-head></v-head>
    </header>
    <section class="MAIN">
      <!-- <v-sidebar></v-sidebar> -->
      <div class="content-area" :class="{'content-collapse':showMenu}">
        <div class="flex-box">
          <v-tags></v-tags>
          <div class="main-content-box">
            <transition name="move" mode="out-in">
              <keep-alive :include="tagsList">
                <router-view></router-view>
              </keep-alive>
            </transition>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import vHead from '@/components/Header.vue'
import vSidebar from '@/components/Sidebar.vue'
import vTags from '@/components/Tags.vue'
import stateKeys from '../store/stateKeys.js'
import { mapState, mapActions } from 'vuex'
import actionKeys from '../store/actionKeys.js'

export default {
  data() {
    return {
      tagsList: []
    }
  },
  methods: {
    ...mapActions([actionKeys.SET_MENUS])
  },
  computed: {
    ...mapState([stateKeys.MENU_VISIBILITY, stateKeys.TOKEN]),
    showMenu() {
      return this[stateKeys.MENU_VISIBILITY]
    }
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  mounted() {}
}
</script>


<style scoped>
.main-content-box {
  width: 100%;
  flex: 1;
  overflow-y: scroll;
  padding: 0 15px;
  box-sizing: border-box;
  background-color: #f0f0f071;
}
.main-content-box > div {
  height: 100%;
}
</style>
