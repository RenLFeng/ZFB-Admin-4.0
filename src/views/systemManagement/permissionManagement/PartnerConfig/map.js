import { formateTime } from '../../../../util'
export const tableHead = () => [
  {
    id: 0,
    label: '活动名称',
    value: 'activityName'
  },
  {
    id: 1,
    label: '开通合伙人(元)',
    value: 'activityAmount'
  },
  {
    id: 2,
    label: '激活奖励(元)',
    value: 'activityRewardAmount'
  },
  {
    id: 3,
    label: '订单返现(元)',
    value: 'orderCashBackAmount'
  },
  {
    id: 4,
    label: '平台(元)',
    value: 'platformProfitAmount'
  },
  {
    id: 5,
    label: '开通合伙人奖励(元)',
    value: 'openPatenerRewardAmount'
  },
  {
    id: 6,
    label: '状态',
    value: 'status'
  },
  {
    id: 7,
    label: '启动时间',
    value: 'openActivityDate'
  },
  {
    id: 8,
    label: '失效时间',
    value: 'disabledActivityDate'
  }
]
export const tableHeadArray = [
  '活动名称',
  '开通合伙人(元)',
  '激活奖励(元)',
  '订单返现(元)',
  '平台(元)',
  '开通合伙人奖励(元)',
  '状态',
  '启动时间',
  '失效时间'
]
export const parseTable = arr => {
  return arr.map(v => ({
    ...v,
    openActivityDate: formateTime(v.openActivityDate),
    disabledActivityDate: formateTime(v.disabledActivityDate),
    status: formateStatus[v.enable]
  }))
}
export const formateStatus = {
  0: '未启用',
  1: '已启用',
  2: '已失效'
}

export const checkmoney = obj => {
  const {
    activityAmount,
    platformProfitAmount,
    activityRewardAmount,
    orderCashBackAmount,
    openPatenerRewardAmount,
    provRewardAmount,
    onelevelOrganRewardAmount,
    twolevelOrganRewardAmount,
    directPartnerRewardAmount,
    indirectPartnerRewardAmount
  } = obj

  return {
    latchall:
      Number(activityAmount) ===
      Number(platformProfitAmount) +
        Number(activityRewardAmount) +
        Number(orderCashBackAmount) +
        Number(openPatenerRewardAmount),
    latchrule:
      Number(openPatenerRewardAmount) ===
      Number(provRewardAmount) +
        Number(onelevelOrganRewardAmount) +
        Number(twolevelOrganRewardAmount) +
        Number(directPartnerRewardAmount) +
        Number(indirectPartnerRewardAmount)
  }
}
