import { filterUerLeveL, formateTime } from '../../util'
import { levelMap } from '../../server/level'
import areaData from '../../assets/lib/jialian.json'

const calcfeeOptionsList = (max, min) => {
  const arr = Array(Math.floor(max) - Math.floor(min) + 1)
    .fill(1)
    .map((v, i) => Math.floor(min) + i)
    .slice(1)
  if (max === Math.floor(max)) return [min, ...arr]
  if (max === min) return [max]
  if (max > Math.floor(max)) return [min, ...arr, max]
}

export const handleOrganArr = arr =>
  arr.map(v => ({
    ...v,
    posPayFeeList: calcfeeOptionsList(v.posPayFee.maxFee, v.posPayFee.minFee),
    posRepayFeeList: calcfeeOptionsList(v.posRepayFee.maxFee, v.posRepayFee.minFee),
    quickPayFeeList: calcfeeOptionsList(v.quickPayFee.maxFee, v.quickPayFee.minFee),
    quickRepayFeeList: calcfeeOptionsList(v.quickRepayFee.maxFee, v.quickRepayFee.minFee)
  }))

export const handleOrganObj = arr =>
  arr.reduce((init, v) => Object.assign(init, { [v.type]: v }), {})

export const TableTitle = [
  {
    title: '机构',
    prop: 'organ',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN],
    width: 150
  },
  {
    title: '代理地区',
    prop: 'area',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '机构类型',
    prop: 'organType',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL]
  },
  {
    title: '上级机构',
    prop: 'organParentType',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL]
  },
  {
    title: '库存数量(台)',
    prop: 'inventoryNum',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '下发数量(台)',
    prop: 'issuedNum',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '设备激活数(台)',
    prop: 'activateNum',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '激活码库存(个)',
    prop: 'codeInventoryNum',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '激活码激活数(个)',
    prop: 'codeActivateNum',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '快捷交易',
    prop: 'quickStatusText',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '状态',
    prop: 'status',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN]
  },
  {
    title: '创建时间',
    prop: 'setDate',
    level: [levelMap.PLATFORM, levelMap.PROVINCIAL, levelMap.ORGAN, levelMap.SECONDORGAN],
    width: 135
  }
]

export const TableList = filterUerLeveL(TableTitle)

// 地区编码转换为地区名
const codeIntoName = code => {
  try {
    for (var i = 0; i < areaData.length; i++) {
      if (code === areaData[i].value) {
        return areaData[i].text
      }
      for (var j = 0; j < areaData[i].children.length; j++) {
        if (code === areaData[i].children[j].value) {
          return areaData[i].children[j].text
        }
      }
    }
  } catch (error) {
    return ''
  }
}
const quickStatusMap = {
  0: '未开通',
  1: '已开通'
}

export const ParseRoleList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    organ: `${v.organName}(${v.userAccount})`,
    setDate: formateTime(v.addDate),
    area: codeIntoName(v.provinceCode) + ' ' + codeIntoName(v.cityCode),
    quickStatusText: quickStatusMap[v.quickStatus]
  }))
}

export const judgeWithLevel = level => {
  return level !== levelMap.PLATFORM
}
