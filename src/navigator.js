export function createNavigator(vue) {
  return {
    goLogin(params) {
      console.log('go login')
      vue.$router.push('/login')
    },
    goHome({ dest }) {
      vue.$router.push(`/${dest}`)
    },
    setHome({ dest }) {
      vue.$router.push(`/${dest}`)
    }
  }
}
