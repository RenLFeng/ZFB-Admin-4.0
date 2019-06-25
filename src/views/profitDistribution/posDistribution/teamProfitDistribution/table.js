import { filterAmount } from '../../../../util'
import { levelMap } from '../../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const MonthTableTitle = [
  {
    title: '合伙人',
    prop: 'organName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '手机号码',
    prop: 'organAccount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '上级合伙人',
    prop: 'upTeamName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 150
  },
  {
    title: '归属机构',
    prop: 'upOrganName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    title: '结算月份',
    prop: 'monthDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '个人业绩(元)',
    prop: 'personalProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '团队业绩(元)',
    prop: 'teamProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '分润奖(元)',
    prop: 'profitReward',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  // {
  //   title: '管理奖(元)',
  //   prop: 'manageReward',
  //   level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  // },
  // {
  //   title: '卓越奖(元)',
  //   prop: 'brilliantReward',
  //   level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  // },
  // {
  //   title: '荣耀奖(元)',
  //   prop: 'honourReward',
  //   level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  // },
  {
    title: '日结分润(元)',
    prop: 'dailyProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '总收益(元)',
    prop: 'totalProfit',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '结算状态',
    prop: 'settlement',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

export const DayTableTitle = [
  {
    title: '合伙人',
    prop: 'profitOrganName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '手机号码',
    prop: 'organAccount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '上级合伙人',
    prop: 'upTeamName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 150
  },
  {
    title: '归属机构',
    prop: 'upOrganName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    title: '商户',
    prop: 'organName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '交易金额(元)',
    prop: 'tradAmt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '交易时间',
    prop: 'addDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '合伙人日结分润(元)',
    prop: 'profitAmt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  // {
  //   title: '活动扣除分润(元)',
  //   prop: 'depositProfit',
  //   level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
  //   type: 'REPAY'
  // },
  {
    title: '状态',
    prop: 'status',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '结算时间',
    prop: 'editDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

// export const MonthTableList = filterUerLeveL(MonthTableTitle)

// export const DayTableList = filterUerLeveL(DayTableTitle)

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

export const MonthParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    monthDate: SettlementTime(v.addDate),
    settlement: statusMap[v.settleStatus],
    personalProfit: filterAmount(v.personalProfit),
    teamProfit: filterAmount(v.teamProfit),
    profitReward: filterAmount(v.profitReward),
    manageReward: filterAmount(v.manageReward),
    brilliantReward: filterAmount(v.brilliantReward),
    honourReward: filterAmount(v.honourReward),
    dailyProfit: filterAmount(v.dailyProfit),
    totalProfit: filterAmount(v.totalProfit),
    upTeamName: `${v.upPartnerName}(${v.upPartnerPhone})`
  }))
}

export const DayParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    addDate: SettlementTime(v.addDate),
    editDate: SettlementTime(v.editDate),
    tradAmt: filterAmount(v.tradAmt),
    profitAmt: filterAmount(v.profitAmt),
    status: statusMap[v.status],
    upTeamName: `${v.upPartnerName}(${v.profitOrganAccount})`
  }))
}
