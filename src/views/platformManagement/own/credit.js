import { formateTime } from '../../../util'

export const creditBaseColumn = () => {
  return [
    {
      tableProp: 'soft',
      tableLabel: '序号'
    },
    {
      tableProp: 'bankname',
      tableLabel: '银行名称'
    },
    {
      tableProp: 'details',
      tableLabel: '推广描述'
    },
    {
      tableProp: 'webUrl',
      tableLabel: '链接地址'
    },
    {
      tableProp: 'transExhibition',
      tableLabel: '是否展示'
    },
    {
      tableProp: 'traansRecommend',
      tableLabel: '是否推荐'
    },
    {
      tableProp: 'addDate',
      tableLabel: '创建时间'
    }
  ]
}
export const parseCredit = arr => {
  return arr.map(v => ({
    ...v,
    transExhibition: exhibition[v.exhibition],
    traansRecommend: recommend[v.recommend],
    addDate: formateTime(v.addDate)
  }))
}
const exhibition = {
  0: '不展示',
  1: '展示 '
}
const recommend = {
  0: '不推荐',
  1: '推荐'
}
export const getExhibition = [
  {
    id: 0,
    value: '不展示'
  },
  {
    id: 1,
    value: '展示'
  }
]
export const getRecommend = [
  {
    id: 0,
    value: '不推荐'
  },
  {
    id: 1,
    value: '推荐'
  }
]
