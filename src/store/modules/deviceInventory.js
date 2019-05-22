const init = {
  searchBody: {},
  currentPageNumber: 0
}
// 设备库存
const deviceInventory = {
  namespaced: true,
  state: {
    ...init
  },
  // mutations
  mutations: {
    saveSnapshot(state, snapshot) {
      state.searchBody = snapshot.searchBody
      state.currentPageNumber = snapshot.currentPageNumber
    },
    // reset() {
    //   state = { ...init }
    // }
  }
}

export default deviceInventory
