import { formateTime } from '../../../util'
export const goodsBaseColumn = [
  {
    tableProp: 'orderNo',
    tableLable: '序号'
  },
  {
    tableProp: 'packageName',
    tableLable: '商品名称'
  },
  {
    tableProp: 'packagePrice',
    tableLable: '商品价格(元)'
  },

  {
    tableProp: 'model',
    tableLable: '设备型号'
  },
  {
    tableProp: 'deviceNum',
    tableLable: '套装数量'
  },
  {
    tableProp: 'activityName',
    tableLable: '关联活动'
  },
  {
    tableProp: 'addDate',
    tableLable: '创建时间'
  }
]
export const parseGoodsList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    addDate: formateTime(v.addDate)
  }))
}
