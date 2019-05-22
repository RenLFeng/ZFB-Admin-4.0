import { formateTime, filterAmount } from '../../../util'
import { levelMap } from '../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const onlineUserTableHead = [
  {
    label: '用户',
    prop: 'user',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '推荐人',
    prop: 'inviteCode',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '分公司',
    prop: 'proOrganName',
    level: [PLATFORM]
  },
  {
    label: '子公司',
    prop: 'oneOrganName',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    label: '高级合伙人',
    prop: 'secOrganName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    label: '累计活动金额(元)',
    prop: 'sumRepaymentAmt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '状态',
    prop: 'statusText',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '激活时间',
    prop: 'onLineActivationDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '完成时间',
    prop: 'extensionDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]
const statusMap = {
  1: '未完成',
  2: '已完成'
}

export const ParseRoleList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    user: `${v.userName}(${v.phone})`,
    inviteCode: `${v.inviteOrganName}(${v.inviteAccount})`,
    statusText: statusMap[v.status],
    extensionDate: formateTime(v.extensionDate),
    onLineActivationDate: formateTime(v.onLineActivationDate),
    sumRepaymentAmt: filterAmount(v.sumRepaymentAmt)
  }))
}

export const searchCondition = [
  {
    type: 'date',
    placeholder: '完成开始时间',
    searchValue: 'completionStartTime',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    type: 'date',
    placeholder: '完成结束时间',
    searchValue: 'completionEndTime',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    type: 'input',
    placeholder: '用户姓名',
    label: '用户姓名',
    searchValue: 'username',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    type: 'input',
    placeholder: '用户手机号码',
    label: '用户手机号',
    searchValue: 'phone',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    type: 'input',
    placeholder: '推荐人手机号码',
    label: '推荐人手机号',
    searchValue: 'inviteAccount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    type: 'input',
    label: '分公司',
    placeholder: '分公司名称或编号',
    searchValue: 'proOrganName',
    level: [PLATFORM]
  },
  {
    type: 'input',
    placeholder: '子公司名称或编号',
    label: '子公司',
    searchValue: 'organName',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    type: 'input',
    placeholder: '高级合伙人名称或编号',
    label: '高级合伙人',
    searchValue: 'secOrganName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    type: 'select',
    placeholder: '状态',
    label: '状态',
    searchValue: 'status',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    options: [
      {
        value: 1,
        label: '未完成'
      },
      {
        value: 2,
        label: '已完成'
      }
    ]
  },
  {
    type: 'date',
    placeholder: '激活开始时间',
    searchValue: 'startedAt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    type: 'date',
    placeholder: '激活结束时间',
    searchValue: 'endStartedAt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

const emptyObj = Object.create(null)
export const initSearchCondition = searchCondition.reduce(
  (init, v) => Object.assign(init, { [v.searchValue]: '' }),
  emptyObj
)
