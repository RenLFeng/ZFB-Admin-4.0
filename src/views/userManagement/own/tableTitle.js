import { filterUerLeveL, formateTime } from '../../../util'
import { levelMap } from '../../../server/level'
// 所有用户
export const allUserTableTitle = [
  {
    title: '用户',
    prop: 'username',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '合伙人',
    prop: 'partner',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '线上推荐人',
    prop: 'inviteName',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '二级机构',
    prop: 'secOrganName',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN]
  },
  {
    title: '一级机构',
    prop: 'organName',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL]
  },
  {
    title: '省级机构',
    prop: 'proOrganName',
    level: [levelMap.PLATFORM]
  },
  {
    title: '实名认证',
    prop: 'realName',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '状态',
    prop: 'organType',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '认证时间',
    prop: 'certificationDate',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '注册时间',
    prop: 'addDate',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  }
]
// 合伙人
export const teamTableListTitle = [
  {
    title: '合伙人',
    prop: 'user',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '上级合伙人',
    prop: 'partner',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '省级机构',
    prop: 'proOrganName',
    level: [levelMap.PLATFORM]
  },
  {
    title: '一级机构',
    prop: 'organName',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL]
  },
  {
    title: '二级机构',
    prop: 'secOrganName',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN]
  },
  {
    title: '商户数',
    prop: 'merchantSum',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '合伙人数',
    prop: 'partnerSum',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '授权时间',
    prop: 'partnerLicenseDate',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  }
]
// 商户
export const MerchantTableListTitle = [
  {
    title: '商户',
    prop: 'merchant',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '合伙人',
    prop: 'partner',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '省级机构',
    prop: 'proOrganName',
    level: [levelMap.PLATFORM]
  },
  {
    title: '一级机构',
    prop: 'organName',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL]
  },
  {
    title: '二级机构',
    prop: 'secOrganName',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN]
  },
  {
    title: '设备型号',
    prop: 'brandSubName',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '设备编号',
    prop: 'devNo',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '端口数量',
    prop: 'portSum',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '状态',
    prop: 'disableState',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '设备激活时间',
    prop: 'activiteDate',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '备注',
    prop: 'isWithdraw',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  }
]

export const teamTableList = filterUerLeveL(teamTableListTitle)

export const MerchantTableList = filterUerLeveL(MerchantTableListTitle)

const realNameAuthStatusMap = {
  0: '未认证',
  1: '已认证'
}
const organStatusMap = {
  0: '禁用',
  1: '正常'
}
const deviceBackStatus = {
  0: '未撤机',
  1: '已撤机'
}
export const ParseRoleList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    username: v.username ? `${v.username}(${v.phone})` : v.phone,
    inviteName: v.inviteName ? `${v.inviteName}(${v.inviteOrganAccount})` : '',
    realName: realNameAuthStatusMap[Number(v.realNameAuthStatus)],
    addDate: formateTime(v.addDate),
    organType: organStatusMap[v.organStatus],
    certificationDate: formateTime(v.certificationDate)
  }))
}
export const teamParseRoleList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    user: `${v.username}(${v.phone})`,
    partnerLicenseDate: formateTime(v.partnerLicenseDate)
  }))
}
export const MerchantParseRoleList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    merchant: `${v.merchantName}(${v.phone})`,
    activiteDate: formateTime(v.activiteDate),
    disableState: organStatusMap[v.disableState],
    isWithdraw: deviceBackStatus[v.isWithdraw]
  }))
}
