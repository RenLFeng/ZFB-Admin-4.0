import { formateTime, filterAmount } from '../../../util'
export const evaluationOrderColumn = () => {
  return [
    {
      tableProp: 'orderId',
      tableLabel: '订单编号'
    },
    {
      tableProp: 'user',
      tableLabel: '姓名'
    },
    {
      tableProp: 'bankCardNo',
      tableLabel: '信用卡号'
    },
    {
      tableProp: 'phone',
      tableLabel: '预留手机号'
    },
    {
      tableProp: 'tradeAmt',
      tableLabel: '订单金额(元)'
    },
    {
      tableProp: 'addDate',
      tableLabel: '下单时间'
    }
  ]
}
export const formatTableData = arr => {
  return arr.map(v => ({
    ...v,
    user: `${v.holder}(${v.organUseraccount})`,
    addDate: formateTime(v.addDate),
    tradeAmt: filterAmount(v.tradeAmt)
  }))
}
