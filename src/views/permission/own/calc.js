import { pipe, formateTime } from '../../../util'
import { InVaildList } from './permission'
import { AdminUserStateMAP } from './map.js'

const filtersHidden = arr => arr.filter(v => !v.hidden)
export const RoleBaseColume = pipe([filtersHidden])([
  {
    tableTitle: 'id',
    tableLabel: '角色编号',
    width: 100,
    hidden: false // true
  },
  {
    tableTitle: 'name',
    tableLabel: '角色名称',
    width: 100
  },
  {
    tableTitle: 'remark',
    tableLabel: '角色描述'
  },
  {
    tableTitle: 'addDate',
    tableLabel: '创建时间',
    width: 180
  }
])

export const AdminBaseColume = pipe([filtersHidden])([
  {
    tableTitle: 'ascriptionId',
    tableLabel: '管理员编号',
    width: 100
  },
  {
    tableTitle: 'userName',
    tableLabel: '姓名',
    width: 100
  },
  {
    tableTitle: 'userAccount',
    tableLabel: '登陆账号'
  },
  {
    tableTitle: 'roleName',
    tableLabel: '角色'
  },
  {
    tableTitle: 'state',
    tableLabel: '状态'
  },
  {
    tableTitle: 'addDate',
    tableLabel: '创建时间'
  }
])

export const ParseRoleList = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    ...v.permissions,
    remark: v.remark || '暂无',
    addDate: formateTime(v.addDate)
  }))
}

export const ParseAdminList = arr =>
  arr &&
  arr.map(v => ({
    ...v,
    state: AdminUserStateMAP[v.enable],
    addDate: formateTime(v.addDate),
    ascriptionId: v.userId
  }))

export const accessRolePermission = list => {
  let result = []
  const fn = arr => {
    arr.forEach(v => {
      if (!InVaildList.includes(v.name)) {
        result.push(v.id)
        if (v.children.length > 0) {
          fn(v.children)
        }
      }
    })
  }
  fn(list)
  return result
}
