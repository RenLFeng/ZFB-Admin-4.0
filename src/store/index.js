import Vue from 'vue'
import Vuex from 'vuex'
import stateKeys from './stateKeys'
import mutationKeys from './mutationKeys'
import actionKeys from './actionKeys'
import Tag from './Tag'
import Menu from './Menu'
import permission from './modules/permission'
import deviceInventory from './modules/deviceInventory'

Vue.use(Vuex)

function tap(x) {
  // console.log(x)
  return x
}

export function createStore() {
  return new Vuex.Store({
    state: {
      [stateKeys.MENU_VISIBILITY]: false,
      [stateKeys.TAGS]: [],
      [stateKeys.CURRENT_TAG]: null,
      [stateKeys.MENUS]: [],
      test: 1,
    },
    mutations: {
      [mutationKeys.SET_MENU_VISIBILITY]: (state, visible) => {
        state[stateKeys.MENU_VISIBILITY] = visible
      },
      [mutationKeys.PUSH_TAG]: (state, { name, title, path }) => {
        state[stateKeys.TAGS].push(new Tag({ title, name, path }))
      },
      [mutationKeys.REMOVE_TAG]: (state, rule) => {
        state[stateKeys.TAGS] = state[stateKeys.TAGS].filter(rule)
      },
      [mutationKeys.SET_CURRENT_TAG]: (state, index) => {
        state[stateKeys.CURRENT_TAG] = state[stateKeys.TAGS][index]
      },
      [mutationKeys.SET_MENUS]: (state, menus) => {
        state[stateKeys.MENUS] = tap(Menu.buildFromArray(menus))
      },
      [mutationKeys.CLEAR_TAGS]: state => {
        state[stateKeys.TAGS] = []
        state[stateKeys.CURRENT_TAG] = null
      },
      [mutationKeys.CLEAR_MENU]: state => {
        state[stateKeys.MENUS] = []
      }
    },
    actions: {
      [actionKeys.SHOW_MENU]: ({ commit }) => {
        commit(mutationKeys.SET_MENU_VISIBILITY, true)
      },
      [actionKeys.HIDE_MENU]: ({ commit }) => {
        commit(mutationKeys.SET_MENU_VISIBILITY, false)
      },
      [actionKeys.TOGGLE_MENU]: ({ commit, state }) => {
        if (state[stateKeys.MENU_VISIBILITY]) {
          commit(mutationKeys.SET_MENU_VISIBILITY, false)
        } else {
          commit(mutationKeys.SET_MENU_VISIBILITY, true)
        }
      },
      [actionKeys.PUSH_TAG]: ({ commit, state }, { name, path, title }) => {
        const pathMatches = ({ path: _path }) => _path === path
        const existIndex = state[stateKeys.TAGS].findIndex(pathMatches)
        if (existIndex !== -1) {
          commit(mutationKeys.SET_CURRENT_TAG, existIndex)
          // 已经存在
          return
        }
        commit(mutationKeys.PUSH_TAG, { name, path, title })
        const index = state[stateKeys.TAGS].length - 1
        commit(mutationKeys.SET_CURRENT_TAG, index)
      },
      [actionKeys.CLOSE_ALL_TAG]: ({ commit, state }) => {
        commit(mutationKeys.REMOVE_TAG, ({ path }) => path === state[stateKeys.TAGS][0].path)
        commit(mutationKeys.SET_CURRENT_TAG, 0)
      },
      [actionKeys.CLOSE_OTHER_TAG]: ({ commit, state }) => {
        // 保留高亮和第一个
        commit(
          mutationKeys.REMOVE_TAG,
          ({ path }) =>
            path === state[stateKeys.CURRENT_TAG].path || path === state[stateKeys.TAGS][0].path
        )
      },
      [actionKeys.CLOSE_SINGLE_TAG]: ({ commit, state }, closeIndex) => {
        if (closeIndex === 0) {
          return
        }
        if (state[stateKeys.CURRENT_TAG].path === state[stateKeys.TAGS][closeIndex].path) {
          let nextIndex
          if (closeIndex === state[stateKeys.TAGS].length - 1) {
            nextIndex = closeIndex - 1
          } else {
            nextIndex = closeIndex + 1
          }
          commit(mutationKeys.SET_CURRENT_TAG, nextIndex)
        }
        commit(
          mutationKeys.REMOVE_TAG,
          ({ path }) => path !== state[stateKeys.TAGS][closeIndex].path
        )
      },
      [actionKeys.SET_MENUS]: ({ commit, state }, menus) => {
        commit(mutationKeys.SET_MENUS, menus)
      },
      [actionKeys.CLEAR_LOGIN]: ({ commit, state }) => {
        commit(mutationKeys.CLEAR_TAGS)
        commit(mutationKeys.CLEAR_MENU)
      }
    },
    modules: {
      permission: permission,
      deviceInventory: deviceInventory
    }
  })
}
