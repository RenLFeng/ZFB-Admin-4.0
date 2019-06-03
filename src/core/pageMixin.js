import { post, RequestError } from '../store/requestFacade'

export const pageMixin = {
  data() {
    return {
      icon: 'el-icon-arrow-down',
      btnText: '展开',
      activeNames: false,
      extraProvider: {},
      tableHas: {},
      paging: {
        pageSize: 10,
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
    handleCurrentChange(number) {
      this.paging.currentPage = number
      this.paging.pageNumber = number
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
    search() {
      if (!this.activeNames) {
        this.activeNames = true
      } else {
        this.loadData(true)
      }
      this.btnText = this.activeNames ? '收起' : '展开'
      this.icon = this.activeNames ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
    toggle() {
      this.activeNames = !this.activeNames
      this.btnText = this.activeNames ? '收起' : '展开'
      this.icon = this.activeNames ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
    handleSizeChange(count) {
      this.pageSize = count
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
    async loadData(isSearch) {
      const params = this.getPageParams()
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key]
        }
      })
      const pageCofig = {
        pageSize: this.paging.pageSize,
        pageNumber: isSearch !== undefined ? 1 : this.paging.pageNumber
      }
      const requestData = Object.assign({}, { ...pageCofig }, params)
      try {
        const { data } = await post({
          url: this.getUrl(),
          data: requestData
        })
        this.$message.success('数据加载完成')
        // this.$notify({
        //   title: `数据地址 ${this.getUrl()}:`,
        //   message: JSON.stringify(data, null, 0),
        //   duration: 5000
        // })
        const data2 = {
          total: 0,
          merchantCount: 0,
          rows: [],
          partnerCount: 0
        }
        const { rows, total } = data === '暂无信息' ? data2 : data
        // console.log('msg')
        this.extraProvider = (data => {
          return {
            get: key => {
              return data[key]
            }
          }
        })(data)
        this.paging.total = total
        // this.paging.currentPage = this.paging.pageNumber
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
