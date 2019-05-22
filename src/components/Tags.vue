<template>
  <div class="tags" v-if="showTags">
    <div class="tags-ul">
      <ul class="tagsbox">
        <li
          class="tags-li"
          v-for="(item, index) in tags.filter(v=>v.title!=='404')"
          :class="{'active': isActive(item.path)}"
          :key="index"
        >
          <router-link :to="item.path" class="tags-li-title" keepAlive>{{item.title}}</router-link>
          <span class="tags-li-icon" @click="closeTag(index)">
            <i class="el-icon-close"></i>
          </span>
        </li>
      </ul>
    </div>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import stateKeys from '../store/stateKeys.js'
import actionKeys from '../store/actionKeys.js'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  methods: {
    ...mapActions([
      actionKeys.CLOSE_ALL_TAG,
      actionKeys.CLOSE_OTHER_TAG,
      actionKeys.CLOSE_SINGLE_TAG,
      actionKeys.PUSH_TAG
    ]),
    isActive(path) {
      return path === this.$route.fullPath
    },
    // 关闭单个标签
    closeTag(index) {
      this[actionKeys.CLOSE_SINGLE_TAG](index)
      this.reNavigatorByCurrentTag()
    },
    // 关闭全部标签
    closeAll() {
      this[actionKeys.CLOSE_ALL_TAG]()
      this.reNavigatorByCurrentTag()
    },
    // 关闭其他标签
    closeOther() {
      this[actionKeys.CLOSE_OTHER_TAG]()
      this.reNavigatorByCurrentTag()
    },
    reNavigatorByCurrentTag() {
      this.$nextTick(() => {
        this.$router.push(this[stateKeys.CURRENT_TAG].path)
      })
    },
    // 设置标签
    setTags(route) {
      if (route.matched[1]) {
        this[actionKeys.PUSH_TAG]({
          title: route.meta.title,
          path: route.fullPath,
          name: route.matched[1].components.default.name
        })
      }
    },
    handleTags(command) {
      command === 'other' ? this.closeOther() : this.closeAll()
    }
  },
  computed: {
    ...mapState([stateKeys.TAGS, stateKeys.CURRENT_TAG]),
    showTags() {
      return this.tags && this.tags.length > 0
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue)
    }
  },
  created() {
    this.setTags(this.$route)
  }
}
</script>

<style>
.tags {
  overflow: hidden;
  background: #fff;
  border-bottom: 1px solid #ddd;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  height: 40px;
}

.tags-ul {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.tags-close-box {
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 120px;
  height: 40px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
ul.tagsbox {
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
  overflow-x: scroll;
}
ul.tagsbox::-webkit-scrollbar {
  height: 0px;
}

.tags-li {
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 23px;
  line-height: 1;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 15px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
  min-width: 50px;
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
  align-content: center;
  align-items: center;
  margin-left: 8px;
  cursor: pointer;
}

.tags-li span {
  margin-right: 3px;
}
.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}
</style>
