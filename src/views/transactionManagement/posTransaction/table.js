import { filterUerLeveL, formateTime } from '../../../util'
import { levelMap } from '../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const cashoutTable = [
  {
    title: '会员',
    prop: 'payerName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '手机号码',
    prop: 'organUserAccount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '机构',
    prop: 'organName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    title: '合伙人',
    prop: 'partner',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '交易卡号',
    prop: 'creditCardNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 130
  },
  {
    title: '银行',
    prop: 'btName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 120
  },
  {
    title: '交易金额(元)',
    prop: 'pamentAmt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '手续费(元)',
    prop: 'fee',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '到账金额(元)',
    prop: 'settleAmt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '到账卡号',
    prop: 'settleCardNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 120
  },
  {
    title: '交易订单号',
    prop: 'tradeNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 165
  },
  {
    title: '交易时间',
    prop: 'addDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 135
  }
]

export const repayTable = [
  {
    title: '计划单号',
    prop: 'planId',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 170
  },
  {
    title: '会员',
    prop: 'username',
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
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    title: '合伙人',
    prop: 'partner',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '银行卡号',
    prop: 'cardNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 140
  },
  {
    title: '银行',
    prop: 'cardName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '还款金额(元)',
    prop: 'amount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '交易订单号',
    prop: 'id',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 170
  },
  {
    title: '预计还款时间',
    prop: 'toExecuteAt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '实际还款时间',
    prop: 'executedAt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '状态',
    prop: 'status',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '返回信息',
    prop: 'statusMsg',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

export const payTable = [
  {
    title: '计划单号',
    prop: 'planId',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 170
  },
  {
    title: '会员',
    prop: 'username',
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
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    title: '合伙人',
    prop: 'partner',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '银行卡号',
    prop: 'cardNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 140
  },
  {
    title: '银行',
    prop: 'cardName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '消费金额(元)',
    prop: 'amount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '交易订单号',
    prop: 'id',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 170
  },
  {
    title: '预计消费时间',
    prop: 'toExecuteAt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 130
  },
  {
    title: '实际消费时间',
    prop: 'executedAt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 130
  },
  {
    title: '计划状态',
    prop: 'planStatus',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '状态',
    prop: 'status',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '返回信息',
    prop: 'statusMsg',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]
export const cashoutTableList = filterUerLeveL(cashoutTable)

export const repayTableList = filterUerLeveL(repayTable)
export const payTableList = filterUerLeveL(payTable)

export const cashoutParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v
  }))
}
const repaystatuMap = {
  1: '未还款',
  2: '执行中',
  3: '还款失败',
  4: '已还款'
}
export const repayParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    status: repaystatuMap[v.status],
    executedAt: formateTime(v.executedAt),
    toExecuteAt: formateTime(v.toExecuteAt)
  }))
}
const paystatuMap = {
  1: '未消费',
  2: '执行中',
  3: '消费失败',
  4: '已消费'
}
const payStatuMap = {
  1: '执行中',
  2: '暂停中',
  3: '异常结束',
  4: '正常结束'
}
export const payParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    status: paystatuMap[v.status],
    planStatus: payStatuMap[v.planStatus],
    executedAt: formateTime(v.executedAt),
    toExecuteAt: formateTime(v.toExecuteAt)
  }))
}
