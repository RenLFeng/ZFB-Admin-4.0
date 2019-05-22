import { formateTime } from '../../../util'
import { activateStatus } from './status'
export const deviceDelColumn = () => {
  return [
    {
      tableProp: 'user',
      tableLabel: '用户'
    },
    {
      tableProp: 'partner',
      tableLabel: '合伙人'
    },
    {
      tableProp: 'secOrgan',
      tableLabel: '二级机构'
    },
    {
      tableProp: 'oneOrgan',
      tableLabel: '一级机构'
    },
    {
      tableProp: 'devNo',
      tableLabel: '设备编号'
    },
    {
      tableProp: 'brandSubName',
      tableLabel: '设备型号'
    },
    {
      tableProp: 'activateStatus',
      tableLabel: '原设备激活状态'
    },
    {
      tableProp: 'remark',
      tableLabel: '回拨原因'
    },
    {
      tableProp: 'addDate',
      tableLabel: '申请时间'
    },
    {
      tableProp: 'operator',
      tableLabel: '操作人'
    },
    {
      tableProp: 'auditMsg',
      tableLabel: '审核意见'
    }
  ]
}
export const parseDeviceDel = arr => {
  return arr.map(v => ({
    ...v,
    user: `${v.username}(${v.userAccount})`,
    partner: `${v.partnerName}(${v.partnerAccount})`,
    secOrgan: v.secOrganName ? `${v.secOrganName}(${v.secOrganAccount})` : '',
    oneOrgan: `${v.oneOrganName}(${v.oneOrganAccount})`,
    activateStatus: activateStatus[v.activateStatus],
    addDate: formateTime(v.addDate)
  }))
}
