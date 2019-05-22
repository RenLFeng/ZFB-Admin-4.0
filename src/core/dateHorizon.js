import { post, RequestError } from '../store/requestFacade'

export const dateHorizon = {
  data() {
    return {
      tableHas: {},
      timeData: {
        date: [new Date() - 86400000 * 30, new Date() - 0 + 86400000]
      }
    }
  },
  methods: {
    dateConversion(dateTime) {
      let date = new Date(dateTime)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      let d = date.getDate()
      return y + '-' + MM + '-' + d
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
    async loadTimeData() {
      const params = this.getDateParams()
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key]
        }
      })
      const data = Object.assign({}, params, {
        startedAt: this.dateConversion(this.timeData.date[0]),
        shouldEndAt: this.dateConversion(this.timeData.date[1])
      })
      try {
        const { data: { rows } } = await post({
          url: this.getUrl(),
          data
        })
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
