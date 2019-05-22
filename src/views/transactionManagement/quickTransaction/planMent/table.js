import { filterUerLeveL, formateTime } from '../../../../util'
import { levelMap } from '../../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

const TableTitle = [
  {
    title: '计划单号',
    prop: 'planId',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 170
  },
  {
    title: '用户',
    prop: 'user',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '推荐人',
    prop: 'inviter',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '高级合伙人',
    prop: 'twoOrgan',
    level: [PLATFORM, PROVINCIAL, ORGAN],
    width: 110
  },
  {
    title: '子公司',
    prop: 'oneOrgan',
    level: [PLATFORM, PROVINCIAL],
    width: 110
  },
  {
    title: '分公司机构',
    prop: 'proOrgan',
    level: [PLATFORM]
  },
  {
    title: '通道名称',
    prop: 'channelName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '银行卡号',
    prop: 'cardNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 130
  },
  {
    title: '银行',
    prop: 'bankName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '账单金额(元)',
    prop: 'billAmount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 90
  },
  {
    title: '周转金(元)',
    prop: 'workingAmount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '手续费(元)',
    prop: 'fee',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '开始日期',
    prop: 'startAt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 120
  },
  {
    title: '结束日期',
    prop: 'endAt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 120
  },
  {
    title: '状态',
    prop: 'statusText',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

export const TableList = filterUerLeveL(TableTitle)

const statuMap = {
  1: '执行中',
  2: '暂停中',
  3: '异常结束',
  4: '正常结束'
}

export const ParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    startAt: formateTime(v.startAt),
    endAt: formateTime(v.endAt),
    statusText: statuMap[v.status]
  }))
}
