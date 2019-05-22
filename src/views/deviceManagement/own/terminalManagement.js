import { formateTime } from '../../../util'
import { profitStatus, deviceStatus } from './status'
export const terminalColumn = () => {
  return [
    {
      tableProp: 'devNo',
      tableLabel: '设备编号'
    },
    {
      tableProp: 'brandType',
      tableLabel: '设备型号'
    },
    {
      tableProp: 'proOrgan',
      tableLabel: '省级机构'
    },
    {
      tableProp: 'oneOrgan',
      tableLabel: '一级机构'
    },
    {
      tableProp: 'secOrgan',
      tableLabel: '二级机构'
    },
    {
      tableProp: 'partner',
      tableLabel: '合伙人'
    },
    {
      tableProp: 'user',
      tableLabel: '商户'
    },
    {
      tableProp: 'profit',
      tableLabel: '返现奖励'
    },
    {
      tableProp: 'device',
      tableLabel: '设备状态'
    },
    // {
    //   tableProp: '',
    //   tableLabel: '运行状态'
    // },
    {
      tableProp: 'posVersion',
      tableLabel: '设备版本'
    },
    {
      tableProp: 'battery',
      tableLabel: '设备电量'
    },
    {
      tableProp: 'updateDate',
      tableLabel: '上报时间'
    },
    {
      tableProp: 'ActivateDate',
      tableLabel: '激活时间'
    }
  ]
}
export const parseTerm = arr => {
  return arr.map(v => ({
    ...v,
    user: v.userName ? `${v.userName}(${v.userAccount})` : '',
    partner: v.partner ? `${v.partner}(${v.partnerAccount})` : '',
    secOrgan: v.secOrganName ? `${v.secOrganName}(${v.secOrganAccount})` : '',
    oneOrgan: v.oneOrganName ? `${v.oneOrganName}(${v.oneOrganAccount})` : '',
    proOrgan: v.proOrganName ? `${v.proOrganName}(${v.proOrganAccount})` : '',
    profit: profitStatus[v.profitStatus],
    device: deviceStatus[v.enabled],
    updateDate: formateTime(v.updateDate),
    ActivateDate: formateTime(v.activateDate)
  }))
}
