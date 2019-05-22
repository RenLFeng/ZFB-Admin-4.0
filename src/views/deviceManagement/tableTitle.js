import { formateTime } from '../../util'
import { levelMap } from '../../server/level'
const PLATFORM = levelMap.PLATFORM
const PROVINCIAL = levelMap.PROVINCIAL
const ORGAN = levelMap.ORGAN
const SECONDORGAN = levelMap.SECONDORGAN

export const TableTitle = [
  {
    title: '设备编号',
    prop: 'devNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: '180'
  },
  {
    title: '设备厂商',
    prop: 'factoryName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '设备型号',
    prop: 'brandName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  // {
  //   title: '二级机构',
  //   prop: 'sceOrganProxyName',
  //   level: [PLATFORM, PROVINCIAL, ORGAN],
  //   width: 130
  // },
  {
    title: '所属机构',
    prop: 'organProxyName',
    level: [PLATFORM, PROVINCIAL, ORGAN],
    width: 130
  },
  {
    title: '省级机构',
    prop: 'provinceProxyName',
    level: [PLATFORM],
    width: 150
  },
  {
    title: '合伙人',
    prop: 'partner',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '商户',
    prop: 'merchantName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    title: '返现奖励',
    prop: 'profitStatusText',
    level: [PLATFORM]
  },
  {
    title: '入库时间',
    prop: 'addTime',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 130
  },
  {
    title: '下发时间',
    prop: 'outStockDate',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 130
  },
  {
    title: '激活时间',
    prop: 'activateTime',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 130
  }
]

const outStatusMap = {
  0: '未下发',
  1: '已下发'
}
// const activateTypeMap = {
//   0: '未激活',
//   1: '已激活'
// }
const profitStatusMap = {
  0: '不返现',
  1: '返现'
}
export const ParseRoleList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    outStatusText: outStatusMap[v.outStatus],
    addTime: formateTime(v.addTime),
    outStockDate: formateTime(v.outStockDate),
    activateTime: formateTime(v.activateTime),
    profitStatusText: profitStatusMap[v.profitStatus]
  }))
}

export const inventoryTable = [
  {
    label: '批次',
    value: 'batchNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: '170'
  },
  {
    label: '设备厂商',
    value: 'factoryName',
    level: [PLATFORM]
  },
  {
    label: '设备型号',
    value: 'brandName',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '批次类型',
    value: 'batchTypeTxT',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '状态',
    value: 'batchStatusTxT',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '机构',
    value: 'organName',
    level: [PLATFORM, PROVINCIAL, ORGAN],
    width: 130
  },
  {
    label: '开始设备编号',
    value: 'startNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 130
  },
  {
    label: '结束设备编号',
    value: 'endNo',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: 130
  },
  {
    label: '正常数量(台)',
    value: 'sucNum',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '异常数量(台)',
    value: 'failNum',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN]
  },
  {
    label: '返现奖励',
    value: 'profitStatusTxt',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: '130'
  },
  {
    label: '操作时间',
    value: 'addDateTxT',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: '160'
  },
  {
    label: '操作人',
    value: 'operatorAccount',
    level: [PLATFORM, PROVINCIAL, ORGAN, SECONDORGAN],
    width: '160'
  }
]

const batchTypeMAP = {
  1: '入库',
  2: '下发',
  3: '回拨',
  4: '划拨',
  5: '撤回'
}
const batchStatusMAP = {
  0: '验证中',
  1: '成功',
  2: '失败',
  3: '失败',
  4: '异常',
  5: '成功'
}

const profitStatusMAP = {
  0: '不返现',
  1: '返现'
}

export const HandleInventoryList = list =>
  list.map(v => ({
    ...v,
    addDateTxT: formateTime(v.addDate),
    batchTypeTxT: batchTypeMAP[v.batchType],
    batchStatusTxT: batchTypeMAP[v.batchType] + batchStatusMAP[v.batchStatus],
    profitStatusTxt: profitStatusMAP[v.profitStatus]
  }))
