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
    title: '会员',
    prop: 'userName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '手机号码',
    prop: 'userAccount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '机构',
    prop: 'organName',
    level: [PLATFORM, PROVINCIAL, ORGAN],
    width: 110
  },
  {
    title: '合伙人',
    prop: 'partner',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '设备型号',
    prop: 'brandSubName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '银行卡号',
    prop: 'bankCardNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 130
  },
  {
    title: '银行',
    prop: 'btName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '账单金额(元)',
    prop: 'initBillAmount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '周转金',
    prop: 'workingAmount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '手续费(元)',
    prop: 'repayFeeTotal',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '开始日期',
    prop: 'startedTime',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 120
  },
  {
    title: '结束日期',
    prop: 'shouldEndTime',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 120
  },
  {
    title: '状态',
    prop: 'planStatus',
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
    startedTime: formateTime(v.startedAt),
    shouldEndTime: formateTime(v.shouldEndAt),
    planStatus: statuMap[v.status]
  }))
}
