import { post, RequestError } from '../store/requestFacade'

export const pageMixins = {
  data() {
    return {
      extraProvider: {},
      tableHas: {},
      paging: {
        pageSize: 30,
        pageNumber: 1, // 给后台
        currentPage: 1, // 前端的当前页面,
        total: 0 // 总数
      }
    }
  },
  methods: {
    getExtra(key) {
      return this.extraProvider.get(key)
    },
    handleCurrentChange(currentPage) {
      this.paging.pageNumber = currentPage
      this.loadData()
    },
    nextPage() {
      this.pageNumber += 1
      this.loadData()
    },
    prePage() {
      this.pageNumber -= 1
      this.loadData()
    },
    checkTableHas(rows) {
      if (!Array.isArray(rows)) {
        return
      }
      if (rows.length === 0) {
        return
      }
      const standard = rows[0]
      Object.keys(standard).forEach(key => {
        this.$set(this.tableHas, key, true)
      })
    },
    async loadData() {
      const params = this.getPageParams()
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key]
        }
      })
      const requestData = Object.assign({}, params, {
        pageSize: this.paging.pageSize,
        pageNumber: this.paging.pageNumber
      })
      try {
        const { data } = await post({
          url: this.getUrl(),
          data: requestData
        })
        const { rows, total } = data
        // console.log('msg')
        this.extraProvider = (data => {
          return {
            get: key => {
              return data[key]
            }
          }
        })(data)
        this.paging.total = total
        this.paging.currentPage = this.paging.pageNumber
        // 外部需要指定一个 handleRows 方法接受服务器返回的数据
        this.checkTableHas(rows)
        this.handleRows(rows)
      } catch (error) {
        if (error instanceof RequestError) {
          this.$message(error.message)
        }
      }
    }
  }
}
