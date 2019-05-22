import { formateTime, tailorStr } from '../../../util'
import {
  ReleaseStatusMAP,
  accessSystemTypeName,
  accessCardSlotNum,
  calcEquipmentReleaseMode,
  isEquipment
} from './map'

const calcEnableText = v => {
  if (v.releaseCode && v.releaseCode !== 100 && v.enable === 0) {
    return '待灰度发布'
  } else {
    return ReleaseStatusMAP[v.enable]
  }
}

export const formateTableData = arr =>
  arr.map(v => ({
    ...v,
    addDateText: formateTime(v.addDate),
    sysTemTypeText: accessSystemTypeName(v),
    updateTypeText: Number(v.updateType) === 1 ? '强制更新' : '正常更新',
    shortNewContent: tailorStr(v.newContent, 30),
    enableText: calcEnableText(v),
    equipmentReleaseMode: v.releaseCode ? calcEquipmentReleaseMode(v.releaseCode) : ''
  }))

export const calcGrayscaleReleaseList = arr =>
  arr.map(v => ({
    ...v,
    value: v.type,
    label: v.name
  }))

export const ReleaseListObj = arr =>
  arr.reduce((init, v) => Object.assign(init, { [v.type]: v }), {})

export const calcRowDetails = obj => ({
  ...obj,
  sysTemType: isEquipment(obj.sysTemType) ? 3 : obj.sysTemType,
  multipleRange: obj.oneOrganId
    ? obj.oneOrganId.split(',').map(v => Number(v))
    : obj.provinceId
    ? obj.provinceId.split(',').map(v => Number(v))
    : [],
  releaseCode: Number(obj.releaseCode),
  posCardSlotNum: accessCardSlotNum(obj.pkgName)
})

export const calcEnableCode = num => {
  const code = Number(num)
  return code === 0 ? 0 : code === 3 ? 3 : 1
}

export const calcReleaseBtnText = num => {
  const code = Number(num)
  return code === 0 ? '发布' : code === 1 ? '取消发布' : code === 2 ? '整体发布' : ''
}
