module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target:process.env.VUE_APP_HOST,
        pathRewrite: { '^/api': '' },
        changeOrigin: true
      }
    }
  }
}
