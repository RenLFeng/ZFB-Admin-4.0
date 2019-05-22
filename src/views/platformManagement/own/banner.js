import { formateTime } from '../../../util'
export const bannerBaseColumn = () => {
  return [
    {
      tableProp: 'linkUrl',
      tableLabel: '跳转链接'
    },
    {
      tableProp: 'transEnable',
      tableLabel: '是否显示'
    },
    {
      tableProp: 'addDate',
      tableLabel: '创建时间'
    }
  ]
}
export const parseBanner = arr => {
  return arr.map(v => ({
    ...v,
    transEnable: enable[v.enable],
    addDate: formateTime(v.addDate)
  }))
}
const enable = {
  0: '不显示',
  1: '显示'
}
