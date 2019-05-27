import { filterAmount } from '../../../../util'
import { levelMap } from '../../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
// const ORGAN = levelMap.ORGAN

export const TableTitle = [
  {
    title: '分公司编号',
    prop: 'organAccount',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    title: '分公司名称',
    prop: 'organName',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    title: '结算月份',
    prop: 'monthDate',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    title: '分公司总交易量(元)',
    prop: 'totalPerformance',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    title: '分公司总分润(元)',
    prop: 'totalProfit',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    title: '机构总分润(元)',
    prop: 'partnerProfit',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    title: '分公司月结分润(元)',
    prop: 'afterProfit',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    title: '活动扣除分润(元)',
    prop: 'depositProfit',
    level: [PLATFORM, PROVINCIAL],
    type: 'REPAY'
  },
  {
    title: '结算状态',
    prop: 'proStatus',
    level: [PLATFORM, PROVINCIAL]
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

export const ParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    proStatus: statusMap[v.status],
    monthDate: SettlementTime(v.addDate),
    totalPerformance: filterAmount(v.totalPerformance),
    totalProfit: filterAmount(v.totalProfit),
    partnerProfit: filterAmount(v.partnerProfit),
    afterProfit: filterAmount(v.afterProfit)
  }))
}
