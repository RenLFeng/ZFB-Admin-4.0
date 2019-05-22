import { formateTime } from '../../../util'
export const companyColumn = [
  {
    tableProp: 'channelCompany',
    tableLabel: '公司名称'
  },
  {
    tableProp: 'companyAlias',
    tableLabel: '公司别名'
  }
]
export const channelColumn = [
  {
    tableProp: 'serialNum',
    tableLabel: '序号'
  },
  {
    tableProp: 'channelRealName',
    tableLabel: '通道名称'
  },
  {
    tableProp: 'channelName',
    tableLabel: '通道别名'
  },
  {
    tableProp: 'companyAlias',
    tableLabel: '公司别名'
  },
  {
    tableProp: 'enable',
    tableLabel: '状态'
  },
  {
    tableProp: 'createTime',
    tableLabel: '创建时间'
  }
]
export const parseChannelTable = arr => {
  return arr.map(v => ({
    ...v,
    createTime: formateTime(v.createTime),
    enable: statuMap[v.status]
  }))
}
const statuMap = {
  0: '未启用',
  1: '启用'
}
