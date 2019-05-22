import { formateTime, filterAmount } from '../../../util'
export const slotOrderColumn = () => {
  return [
    {
      tableProp: 'orderId',
      tableLabel: '订单编号'
    },
    {
      tableProp: 'organUseraccount',
      tableLabel: '手机号码'
    },
    {
      tableProp: 'factoryName',
      tableLabel: '设备厂商'
    },
    {
      tableProp: 'brandType',
      tableLabel: '设备类型'
    },
    {
      tableProp: 'devNo',
      tableLabel: '设备编号'
    },
    {
      tableProp: 'holder',
      tableLabel: '商户'
    },
    {
      tableProp: 'origanName',
      tableLabel: '机构'
    },
    {
      tableProp: 'portCount',
      tableLabel: '激活端口数(个)'
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
    addDate: formateTime(v.addDate),
    tradeAmt: filterAmount(v.tradeAmt)
  }))
}
