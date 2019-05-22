import { excel } from '../../../../src/core'
import { expect } from 'chai'

describe('test core', () => {
  describe('excel', () => {
    it('format', () => {
      const head = {
        name: '姓名',
        age: '年龄',
        start: '投保开始时间'
      }
      const content = [
        {
          name: 'grant',
          age: 25
        },
        {
          name: 'zhuang',
          age: 26
        }
      ]
      expect([
        ['姓名', '年龄', '投保开始时间'],
        ['grant', 25, ''],
        ['zhuang', 26, '']
      ]).to.deep.equals(
        excel.format({
          head,
          content
        })
      )
    })
  })
})
