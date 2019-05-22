import { levelMap } from '../../../../server/level'
import { filterMonth, filterAmount } from '@/util'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const TableTitle = [
  {
    title: '用户',
    prop: 'userCode',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '推荐人',
    prop: 'referrerCode',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '高级合伙人',
    prop: 'countyName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    title: '子公司',
    prop: 'organName',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    title: '分公司',
    prop: 'provinceName',
    level: [PLATFORM]
  },
  {
    title: '交易金额(元)',
    prop: 'performance',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '日结分润',
    prop: 'profit',
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
    vipUserCode: `${v.vipUserName}(${v.vipUserAccount})`,
    userCode: `${v.userName}(${v.userAccount})`,
    referrerCode: `${v.referrer}(${v.referrerAccount})`,
    countyName: v.countyName ? `${v.countyName}(${v.countyCode})` : '',
    organName: `${v.organName}(${v.organCode})`,
    provinceName: `${v.provinceName}(${v.provinceCode})`,
    settleDateText: filterMonth(v.settleDate),
    performance: filterAmount(v.performance),
    profit: filterAmount(v.profit)
  }))
}

export const nosetTableTitle = [
  {
    title: '用户',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '推荐人',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '直属机构',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '上级机构',
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
    title: '日结分润',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '状态',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]
