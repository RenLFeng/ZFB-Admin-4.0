import { formateTime } from '../../../util'
export const bankBaseColumn = () => {
  return [
    {
      tableProp: 'index',
      tableLabel: '序号'
    },
    {
      tableProp: 'btName',
      tableLabel: '银行名称'
    },
    {
      tableProp: 'newOffline',
      tableLabel: '线下交易'
    },
    // {
    //   tableProp: 'newOnLine',
    //   tableLabel: '线上交易'
    // },
    {
      tableProp: 'newIsUse',
      tableLabel: '是否显示'
    },
    {
      tableProp: 'addDate',
      tableLabel: '创建时间'
    }
  ]
}
export const parseBank = arr => {
  return arr.map(v => ({
    ...v,
    addDate: formateTime(v.addDate),
    newOffline: offline[v.offline],
    newOnLine: onLine[v.onLine],
    newIsUse: isUse[v.isUse]
  }))
}
// 是否显示的转换
const isUse = {
  0: '不显示',
  1: '显示'
}
// 是否支持线下的转换
const offline = {
  0: '支持',
  1: '不支持'
}
// 是否支持线上的转换
const onLine = {
  0: '支持',
  1: '不支持'
}
export const useStatus = [
  {
    id: 0,
    value: '不显示'
  },
  {
    id: 1,
    value: '显示'
  }
]
