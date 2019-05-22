import { filterUerLeveL, formateTime } from '../../../util'
import { levelMap } from '../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const TableTitle = [
  {
    title: '订单号',
    prop: 'payOrderId',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 200
  },
  {
    title: '机构',
    prop: 'organName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    title: '上级',
    prop: 'upPartner',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '合伙人',
    prop: 'receiveName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '商品名称',
    prop: 'packageName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 140
  },
  {
    title: '设备厂商',
    prop: 'factory',
    level: [PLATFORM]
  },
  {
    title: '设备型号',
    prop: 'brandSubName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '订单总价(元)',
    prop: 'totalPrice',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 90
  },
  {
    title: '发货人',
    prop: 'consigner',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '下单时间',
    prop: 'addDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '订单状态',
    prop: 'status',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

export const TableList = filterUerLeveL(TableTitle)

export const ParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    addDate: formateTime(v.addTime)
  }))
}
