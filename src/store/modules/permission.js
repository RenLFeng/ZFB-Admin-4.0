const permission = {
  namespaced: true,
  state: {
    roleList: []
  },
  // mutations
  mutations: {
    updataRoleList(state, products) {
      state.roleList = products.list
    }
  }
}

export default permission
