import { filterAmount } from '../../../../util'
import { levelMap } from '../../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const TableTitle = [
  {
    title: '机构编号',
    prop: 'organAccount',
    // level: [PLATFORM, PROVINCIAL, ORGAN]
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '机构名称',
    prop: 'organName',
    // level: [PLATFORM, PROVINCIAL, ORGAN],
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 160
  },
  {
    title: '机构类型',
    prop: 'organState',
    // level: [PLATFORM, PROVINCIAL, ORGAN]
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '上级机构',
    prop: 'upOrganName',
    // level: [PLATFORM, PROVINCIAL],
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 160
  },
  {
    title: '结算月份',
    prop: 'monthDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '机构总交易量(元)',
    prop: 'totalPerformance',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '机构总分润(元)',
    prop: 'totalProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '高级合伙人总分润(元)',
    prop: 'countyProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN],
    width: 150
  },
  {
    title: '合伙人总分润(元)',
    prop: 'partnerProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '机构月结分润(元)',
    prop: 'afterProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '押金扣除分润(元)',
    prop: 'depositProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    type: 'REPAY'
  },
  {
    title: '结算状态',
    prop: 'settlement',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

const SettlementTime = addDate => {
  if (!addDate) return ''
  const time = new Date(addDate)
  let y = time.getFullYear()
  let MM = time.getMonth() + 1
  if (MM < 10) {
    return y + '-0' + MM
  }
  return y + '-' + MM
}
const statusMap = {
  0: '未结算',
  1: '已结算'
}

const organtypeMap = {
  1: '平台',
  2: '分公司机构',
  3: '子公司',
  9: '高级合伙人'
}

export const ParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    monthDate: SettlementTime(v.addDate),
    settlement: statusMap[v.status],
    afterProfit: filterAmount(v.afterProfit),
    partnerProfit: filterAmount(v.partnerProfit),
    totalPerformance: filterAmount(v.totalPerformance),
    totalProfit: filterAmount(v.totalProfit),
    organState: organtypeMap[v.organType]
  }))
}
