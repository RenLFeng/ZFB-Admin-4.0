import { formateTime } from '../../../util'
import { levelMap } from '../../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const applicationTitle = [
  {
    title: '申请单号',
    prop: 'applyNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 200
  },
  {
    title: '申请机构',
    prop: 'applyOrganName',
    level: [PLATFORM, PROVINCIAL, ORGAN]
  },
  // {
  //   title: '下发机构',
  //   prop: 'deliverOrganName',
  //   level: [PLATFORM, PROVINCIAL, ORGAN]
  // },
  {
    title: '申请数量(个)',
    prop: 'applyNumber',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  // {
  //   title: '入库数量(个)',
  //   prop: 'putNumber',
  //   level: [PROVINCIAL, ORGAN, SECONDORGAN]
  // },
  {
    title: '审核状态',
    prop: 'statusText',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '申请时间',
    prop: 'addDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  // {
  //   title: '入库时间',
  //   prop: 'editDate',
  //   level: [PROVINCIAL, ORGAN, SECONDORGAN]
  // },
  {
    title: '备注',
    prop: 'remark',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

const statusMap = {
  0: '待审核',
  1: '未通过',
  2: '已通过'
}

export const ParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    addDate: formateTime(v.addDate),
    editDate: formateTime(v.editDate),
    statusText: statusMap[v.status]
  }))
}

export const deliverTitle = [
  {
    title: '下发单号',
    prop: 'recordNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '申请机构',
    prop: 'toOrganName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '申请数量(个)',
    prop: 'applyNumber',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '下发数量(个)',
    prop: 'number',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '备注',
    prop: 'remark',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '下发时间',
    prop: 'outTime',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '操作人',
    prop: 'operator',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

export const deliverParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    outTime: formateTime(v.outTime)
  }))
}

export const backCallTitle = [
  {
    title: '回拨单号',
    prop: 'recordNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '回拨机构',
    prop: 'organName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '回拨数量(个)',
    prop: 'number',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '备注',
    prop: 'remark',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '回拨时间',
    prop: 'callbackTime',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '操作人',
    prop: 'operator',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  }
]

export const backCallParseRoleList = arr => {
  if (!arr.length) {
    return
  }
  return arr.map(v => ({
    ...v,
    callbackTime: formateTime(v.callbackTime)
  }))
}
