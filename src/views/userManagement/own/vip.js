import { formateTime } from '@/util'
import { levelMap } from '../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const vipTableHead = [
  {
    label: 'VIP',
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
    label: '状态',
    prop: 'disableStateText',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '开通时间',
    prop: 'upgradeVipDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

const statusMap = {
  0: '禁用',
  1: '正常'
}

export const ParseRoleList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    user: `${v.userName}(${v.phone})`,
    inviteCode: `${v.inviteOrganName}(${v.inviteAccount})`,
    disableStateText: statusMap[v.disableState],
    upgradeVipDate: formateTime(v.upgradeVipDate)
  }))
}

export const searchCondition = [
  {
    type: 'input',
    placeholder: 'VIP姓名',
    label: 'VIP姓名',
    searchValue: 'username',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    type: 'input',
    placeholder: 'VIP手机号码',
    label: 'VIP手机号',
    searchValue: 'phone',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    type: 'input',
    placeholder: '推荐人姓名',
    label: '推荐人姓名',
    searchValue: 'inviteOrganName',
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
    placeholder: '请输入名称或编号',
    label: '分公司',
    searchValue: 'proOrganName',
    level: [PLATFORM]
  },
  {
    type: 'input',
    placeholder: '请输入名称或编号',
    label: '子公司',
    searchValue: 'organName',
    level: [PLATFORM, PROVINCIAL]
  },
  {
    type: 'input',
    placeholder: '请输入名称或编号',
    label: '高级合伙人',
    searchValue: 'secOrganName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  {
    type: 'select',
    placeholder: '状态',
    label: '状态',
    searchValue: 'organStatus',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    options: [
      {
        value: 0,
        label: '禁用'
      },
      {
        value: 1,
        label: '正常'
      }
    ]
  },
  {
    type: 'date',
    placeholder: '开通开始时间',
    searchValue: 'startedAt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    type: 'date',
    placeholder: '开通开始时间',
    searchValue: 'endStartedAt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

const emptyObj = Object.create(null)
export const initSearchCondition = searchCondition.reduce(
  (init, v) => Object.assign(init, { [v.searchValue]: '' }),
  emptyObj
)
