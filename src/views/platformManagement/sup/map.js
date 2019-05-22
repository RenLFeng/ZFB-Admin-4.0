import { pipe } from '../../../util'
const filtersHidden = arr => arr

export const versionTableHead = pipe([filtersHidden])([
  {
    tableTitle: 'addDateText',
    tableLabel: '创建时间'
    // width: 200
  },
  {
    tableTitle: 'sysTemTypeText',
    tableLabel: '系统类型'
    // width: 150
  },
  {
    tableTitle: 'versionName',
    tableLabel: '版本名称'
    // width: 150
  },
  {
    tableTitle: 'versionNumber',
    tableLabel: '版本号'
    // width: 150
  },
  {
    tableTitle: 'enableText',
    tableLabel: '发布状态'
    // width: 150
  },

  //   {
  //     tableTitle: 'shortDownLink',
  //     tableLabel: '下载链接'
  //   },
  {
    tableTitle: 'updateTypeText',
    tableLabel: '更新类型',
    width: 150
  },
  {
    tableTitle: 'shortNewContent',
    tableLabel: '更新内容'
  }
])

export const SystemTypeArr = [
  {
    id: 1,
    value: 'iOS'
  },
  {
    id: 2,
    value: 'Android'
  },
  {
    id: 3,
    value: '设备'
  }
]

// 系统类型（1 1-ios，2-安卓，3-设备
export const accessSystemTypeName = v => {
  const number = Number(v.sysTemType)
  return number === 1
    ? 'iOS'
    : number === 2
    ? 'Android'
    : `设备(${accessCardSlotNum(v.pkgName)}卡槽)`
}

export const Equipment = [
  [3, '一代16卡槽设备', 'com.yxj.smartpos'],
  [4, '二代4卡槽设备', 'com.yxj.payjl4']
]

export const accessCardSlotNum = str => {
  return str === 'com.yxj.payjl4' ? '4' : '16'
}

export const accessDeviceZipName = num => (num === 4 ? 'com.yxj.payjl4' : 'com.yxj.smartpos')
export const isEquipment = number => ![1, 2].includes(number)
export const UpdateTypeArr = [
  {
    id: 0,
    value: '正常更新'
  },
  {
    id: 1,
    value: '强制更新'
  }
]

export const ReleaseStatusMAP = {
  0: '待发布',
  1: '已发布',
  2: '已灰度发布',
  3: '取消发布'
}

const equipmentReleaseMAP = {
  100: '整体发布',
  200: '部分省级发布',
  300: '部分机构发布'
}

export const calcEquipmentReleaseMode = num => {
  return equipmentReleaseMAP[Number(num)]
}

export const calcGaryReleaseRangeTXT = (obj, Array) => {
  const string1 = equipmentReleaseMAP[obj.releaseCode]
  if (obj.releaseCode === 100) {
    return string1
  }
  const childrenStr = obj.releaseCode === 200 ? obj.provinceId : obj.oneOrganId
  const goallist = Array.filter(v => v.type === obj.releaseCode)[0].children
  const childrenList = childrenStr.split(',')
  const a = goallist.filter(v => childrenList.includes(String(v.organId)))
  const childrenReduceStr = a
    .reduce((init, v) => {
      return init + v.organName + '/'
    }, '')
    .slice(0, -1)
  return string1 + '(' + childrenReduceStr + ')'
}
