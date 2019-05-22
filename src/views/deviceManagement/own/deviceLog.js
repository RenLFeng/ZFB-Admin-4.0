import { formateTime } from '../../../util'
export const deviceLogColumn = [
  {
    tableProp: 'devNo',
    tableLabel: '设备编号'
  },
  {
    tableProp: 'logName',
    tableLabel: '文件名'
  },
  {
    tableProp: 'addDate',
    tableLabel: '创建时间'
  }
]
export const formatData = arr => {
  return arr.map(v => ({
    ...v,
    addDate: formateTime(v.addDate)
  }))
}
