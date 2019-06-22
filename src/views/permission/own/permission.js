import { CurrentUserPermission } from '../../../public/constant/const'
import { pipe, getDataFormlocalStorage } from '../../../util'
const parse = obj => {
  // extendAble
  return {
    ...obj,
    label: obj.name || '',
    children: (obj.subMenuItems && parseTree(obj.subMenuItems)) || [],
    aaaa:obj.name
  }
}

const parseTree = arr => arr.map(v => parse(v))

export const InVaildList = ['首页', '系统管理']
const filterInVaildArr = arr => arr.filter(v => !InVaildList.includes(v.name))

const filterInvaildExtendAble = arr => arr.filter(v => v.extendAble)

const childrenTypeIsIncludeOperation = arr => arr.map(v => v.type).includes(3) // 3 ===operation



const accessChildrenTypeList = obj => {
  return obj.children && obj.children.length
    ? {
        ...obj,
        children: childrenTypeIsIncludeOperation(obj.children)
          ? [
              {
                id: obj.id,
                code: obj.code,
                label: `${obj.name}(仅查看)`,
                name: `${obj.name}(仅查看)`
              },
              ...obj.children
            ]
          : obj && setChildrenTypeList(obj.children)
      }
    : obj
}
const setChildrenTypeList = arr => arr.map(v => accessChildrenTypeList(v))

export const map = pipe([
  parseTree,
  filterInVaildArr,
  filterInvaildExtendAble
  // setChildrenTypeList
])(getDataFormlocalStorage(CurrentUserPermission))

console.log('00000',map);


const branch = arr =>
  arr.reduce(
    (init, v) =>
      Object.assign(
        init,
        v.children.length
          ? Object.assign({}, { [v.code]: v.id, ...branch(v.children) })
          : { [v.code]: v.id }
      ),
    Object.create(null)
  )

export const map2 = branch(map)

const mapList = arr =>
  arr.reduce((init, v) => init.concat(v.children.length ? [v, ...mapList(v.children)] : v), [])

const accessMapList = mapList(map)

export const getFatherId = currentNode => {
  const result = []
  const _fn = node => {
    result.push(node.id)
    let fatherStr = node.parentCode
    if (!fatherStr) {
      return
    }
    let fatherId = map2[fatherStr]
    let fatherNode = accessMapList.filter(v => v.id === fatherId)[0]
    result.push(fatherId)
    if (fatherNode.parentCode !== null) {
      _fn(fatherNode)
    }
  }
  _fn(currentNode)
  return result
}
