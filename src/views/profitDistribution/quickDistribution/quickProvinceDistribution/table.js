import { filterMonth, filterAmount } from '@/util'
import { levelMap } from '../../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const TableTitle = [
  {
    title: '分公司',
    prop: 'organText',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 150
  },
  {
    title: '结算月份',
    prop: 'settleTimeText',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '分公司总交易量(元)',
    prop: 'performance',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '分公司总分润(元)',
    prop: 'totalProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '机构总分润(元)',
    prop: 'childOrganProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '合伙人总分润(元)',
    prop: 'partnerProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: 'VIP总分润(元)',
    prop: 'vipProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  // {
  //   title: '推荐奖励(元)',
  //   prop: 'recommendedReward',
  //   level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  // },
  {
    title: '分公司月结分润(元)',
    prop: 'monthProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '结算状态',
    prop: 'settleStatusText',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]
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
    organText: `${v.organName}(${v.organCode})`,
    settleTimeText: filterMonth(v.settleTime),
    settleStatusText: statusMap[v.settleStatus],
    performance: filterAmount(v.performance),
    totalProfit: filterAmount(v.totalProfit),
    childOrganProfit: filterAmount(v.childOrganProfit),
    partnerProfit: filterAmount(v.partnerProfit),
    vipProfit: filterAmount(v.vipProfit),
    recommendedReward: filterAmount(v.recommendedReward),
    monthProfit: filterAmount(v.monthProfit)
  }))
}

// 详情机构分润表格
export const organTitle = [
  {
    title: '机构',
    prop: 'organText'
  },
  {
    title: '本月交易量(元)',
    prop: 'performance'
  },
  {
    title: '机构分润(元)',
    prop: 'profit'
  },
  {
    title: '分公司分润(元)',
    prop: 'upProfit'
  }
]

// 详情合伙人分润
export const partnerTitle = [
  {
    title: '合伙人',
    prop: 'organText'
  },
  {
    title: '本月交易量(元)',
    prop: 'performance'
  },
  {
    title: '合伙人分润(元)',
    prop: 'profit'
  },
  {
    title: '分公司分润',
    prop: 'upProfit'
  }
]

// 详情VIP分润
export const vipTitle = [
  {
    title: 'VIP',
    prop: 'organText'
  },
  {
    title: '本月交易量(元)',
    prop: 'performance'
  },
  {
    title: '合伙人分润(元)',
    prop: 'profit'
  },
  {
    title: '分公司分润(元)',
    prop: 'upProfit'
  }
]

export const detailParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    organText: `${v.userName}(${v.userAccount})`,
    performance: filterAmount(v.performance),
    profit: filterAmount(v.profit),
    upProfit: filterAmount(v.upProfit)
  }))
}
// 推荐奖励
export const referralTitle = [
  {
    title: '用户',
    props: 'userName'
  }
  {
    title: '推荐人',
    props: 'inviteName'
  }
  // {
  //   title: '推荐奖励(元)',
  //   props: 'profit'
  // }
]
export const referralParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    userName: `${v.userName}(${v.userPhone})`,
    inviteName: `${v.inviteName}(${v.invitePhone})`,
    profit: filterAmount(v.profit)
  }))
}
