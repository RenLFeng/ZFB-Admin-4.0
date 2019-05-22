import { formateTime } from '@/util'
import { levelMap } from '../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const TableHead = [
  {
    label: '商户',
    prop: 'depositUserInfo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '合伙人',
    prop: 'partner',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '高级合伙人',
    prop: 'secOrganInfo',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    label: '子公司',
    prop: 'oneOrganInfo',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    label: '分公司',
    prop: 'proOrganInfo',
    level: [PLATFORM]
  },
  {
    label: '设备编号',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '押金规则',
    prop: 'ruleName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '押金(元)',
    prop: 'depositAmt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '还款金额(元)',
    prop: 'totalTradeAmt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '状态',
    prop: 'statusText',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '设备状态',
    prop: 'posStatusText',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '开始时间',
    prop: 'beginTime',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '结束时间',
    prop: 'endTime',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

const statusMap = {
  1: '未还款',
  2: '还款中',
  3: '完成',
  4: '失效'
  // 5: '已取消'
}
const posStatusMap = {
  1: '未激活',
  2: '已激活'
}

export const ParseRoleList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    statusText: statusMap[v.status],
    posStatusText: posStatusMap[v.posStatus],
    endTime: formateTime(v.endTime),
    beginTime: formateTime(v.beginTime)
  }))
}

export const searchCondition = [
  {
    type: 'input',
    label: '商户姓名',
    placeholder: '商户姓名',
    searchValue: 'depositName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    type: 'input',
    label: '商户手机号',
    placeholder: '商户手机号',
    searchValue: 'depositPhone',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  // {
  //   type: 'input',
  //   label: '合伙人姓名',
  //   placeholder: '合伙人姓名',
  //   searchValue: 'partner',
  //   level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  // },
  // {
  //   type: 'input',
  //   label: '合伙人手机号',
  //   placeholder: '合伙人手机号',
  //   searchValue: 'partnerPhone',
  //   level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  // },
  {
    type: 'input',
    label: '高级合伙人',
    placeholder: '请输入名称或编号',
    searchValue: 'secOrganName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    type: 'input',
    label: '子公司',
    placeholder: '请输入名称或编号',
    searchValue: 'oneOrganName',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    type: 'input',
    label: '分公司',
    placeholder: '请输入名称或编号',
    searchValue: 'proOrganName',
    level: [PLATFORM]
  },
  {
    type: 'input',
    label: '设备编号',
    placeholder: '设备编号',
    searchValue: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]
