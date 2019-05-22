import { levelMap } from '../../../../server/level'
import { filterMonth, filterAmount } from '@/util'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const TableTitle = [
  {
    title: '合伙人',
    prop: 'partnerCode',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '高级合伙人',
    prop: 'countyName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    title: '子公司',
    prop: 'oneOrganName',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    title: '分公司',
    prop: 'provinceName',
    level: [PLATFORM]
  },
  {
    title: '结算月份',
    prop: 'settleDateText',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '总交易金额(元)',
    prop: 'performance',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '月结分润(元)',
    prop: 'profitAmt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '状态',
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
    settleStatusText: statusMap[v.settleStatus],
    partnerCode: `${v.partnerName}(${v.partnerPhone})`,
    countyName: v.countyName ? `${v.countyName}(${v.countyCode})` : '',
    oneOrganName: `${v.oneOrganName}(${v.oneOrganCode})`,
    provinceName: `${v.provinceName}(${v.provinceCode})`,
    settleDateText: filterMonth(v.settleDate),
    performance: filterAmount(v.performance),
    profitAmt: filterAmount(v.profitAmt)
  }))
}

export const detailTitle = [
  {
    title: '用户',
    prop: 'userCode'
  },
  {
    title: '推荐人',
    prop: 'referrerCode'
  },
  {
    title: '本月交易量(元)',
    prop: 'performance'
  },
  {
    title: '合伙人月结分润',
    prop: 'profit'
  }
]
export const detailRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    userCode: `${v.userName}(${v.userPhone})`,
    referrerCode: `${v.referrer}(${v.referrerPhone})`,
    performance: filterAmount(v.performance),
    profit: filterAmount(v.profit)
  }))
}

export const particularsTitle = [
  {
    title: '合伙人',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '分公司',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '子公司',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '高级合伙人',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '用户',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '交易金额(元)',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '交易时间',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '月结分润',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '状态',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '结算月份',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]
