import { formateTime } from '@/util'

export const TableTitle = [
  {
    title: '规则名称',
    prop: 'ruleName'
  },
  {
    title: '设备型号',
    prop: 'brandSubName'
  },
  {
    title: '服务费(元)',
    prop: 'depositAmt'
  },
  {
    title: '累计还款(万)',
    prop: 'totalTradeAmt'
  },
  {
    title: '活动期限(天)',
    prop: 'depositCycle'
  },
  {
    title: '状态',
    prop: 'ruleStatusText'
  },
  {
    title: '配置启用时间',
    prop: 'enableTime'
  },
  {
    title: '配置失效时间',
    prop: 'invalidTime'
  }
]

const ruleStatusMap = {
  1: '已启用',
  2: '未启用',
  3: '已失效'
}

export const ParseRoleList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    ruleStatusText: ruleStatusMap[v.ruleStatus],
    enableTime: formateTime(v.enableTime),
    invalidTime: formateTime(v.invalidTime)
  }))
}
