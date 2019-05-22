import { createStore } from '../../../../src/store'
import stateKeys from '../../../../src/store/stateKeys'
import actionKeys from '../../../../src/store/actionKeys'

import { expect } from 'chai'

const home = {
  name: 'home',
  path: 'home',
  title: 'home'
}

const editPassword = {
  name: 'editPassword',
  path: 'editPassword',
  title: 'editPassword'
}

const roleManagement = {
  name: 'roleManagement',
  path: 'roleManagement',
  title: 'roleManagement'
}

const userManagement = {
  name: 'userManagement',
  path: 'userManagement',
  title: 'userManagement'
}

const banner = {
  name: 'banner',
  path: 'banner',
  title: 'banner'
}

describe('test store', () => {
  describe('test tags', () => {
    it('正常添加', () => {
      const store = createStore()
      store.dispatch(actionKeys.PUSH_TAG, home)
      expect(store.state[stateKeys.TAGS]).to.deep.equal([home])
    })

    it('删除单个，不能删除第一个标签', () => {
      const store = createStore()
      store.dispatch(actionKeys.PUSH_TAG, home)
      store.dispatch(actionKeys.CLOSE_SINGLE_TAG, 0)
      expect(store.state[stateKeys.TAGS].length).to.equal(1)
    })

    it('删除单个，删除高亮标签，如果标签后有标签，高亮后一个标签', () => {
      const store = createStore()
      store.dispatch(actionKeys.PUSH_TAG, home) // 0
      store.dispatch(actionKeys.PUSH_TAG, editPassword) // 1
      store.dispatch(actionKeys.PUSH_TAG, roleManagement) // 2
      store.dispatch(actionKeys.PUSH_TAG, userManagement) // 3
      store.dispatch(actionKeys.PUSH_TAG, banner) // 4
      // 重复 push 表示高亮
      store.dispatch(actionKeys.PUSH_TAG, userManagement) // 3
      store.dispatch(actionKeys.CLOSE_SINGLE_TAG, 3) // close userManagement
      expect(store.state[stateKeys.CURRENT_TAG]).to.deep.equal(banner) // highlight banner
    })

    it('删除单个，删除高亮标签，如果标签后面没有标签，高亮前一个', () => {
      const store = createStore()
      store.dispatch(actionKeys.PUSH_TAG, home) // 0
      store.dispatch(actionKeys.PUSH_TAG, editPassword) // 1
      store.dispatch(actionKeys.PUSH_TAG, roleManagement) // 2
      store.dispatch(actionKeys.PUSH_TAG, userManagement) // 3
      store.dispatch(actionKeys.PUSH_TAG, banner) // 4

      store.dispatch(actionKeys.CLOSE_SINGLE_TAG, 4) // close banner
      expect(store.state[stateKeys.CURRENT_TAG]).to.deep.equal(userManagement) // highlight userManagement
    })

    it('删除，删除非高亮标签，不影响高亮标签', () => {
      const store = createStore()
      store.dispatch(actionKeys.PUSH_TAG, home) // 0
      store.dispatch(actionKeys.PUSH_TAG, editPassword) // 1
      store.dispatch(actionKeys.PUSH_TAG, roleManagement) // 2
      store.dispatch(actionKeys.PUSH_TAG, userManagement) // 3
      store.dispatch(actionKeys.PUSH_TAG, banner) // 4

      store.dispatch(actionKeys.CLOSE_SINGLE_TAG, 1) // close editPassword
      expect(store.state[stateKeys.CURRENT_TAG]).to.deep.equal(banner) // highlight banner
      expect(store.state[stateKeys.TAGS].length).to.equal(4)
    })

    it('删除其他，保留高亮，但是同时也保留第一个', () => {
      const store = createStore()
      store.dispatch(actionKeys.PUSH_TAG, home) // 0
      store.dispatch(actionKeys.PUSH_TAG, editPassword) // 1
      store.dispatch(actionKeys.PUSH_TAG, roleManagement) // 2
      store.dispatch(actionKeys.PUSH_TAG, userManagement) // 3
      store.dispatch(actionKeys.PUSH_TAG, banner) // 4

      store.dispatch(actionKeys.CLOSE_OTHER_TAG)
      expect(store.state[stateKeys.CURRENT_TAG]).to.deep.equal(banner) // highlight banner
      expect(store.state[stateKeys.TAGS].length).to.equal(2)
    })

    it('删除所有，保留第一个，高亮第一个', () => {
      const store = createStore()
      store.dispatch(actionKeys.PUSH_TAG, home) // 0
      store.dispatch(actionKeys.PUSH_TAG, editPassword) // 1
      store.dispatch(actionKeys.PUSH_TAG, roleManagement) // 2
      store.dispatch(actionKeys.PUSH_TAG, userManagement) // 3
      store.dispatch(actionKeys.PUSH_TAG, banner) // 4

      store.dispatch(actionKeys.CLOSE_ALL_TAG)
      expect(store.state[stateKeys.CURRENT_TAG]).to.deep.equal(home) // highlight home
      expect(store.state[stateKeys.TAGS].length).to.equal(1)
    })
  })
})
