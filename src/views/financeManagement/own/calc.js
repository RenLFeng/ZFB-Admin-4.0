import { formateTime } from '../../../util'
import { insuranceStatus, exportRecordStatus, organLevel, auditStatus, payStatus } from './status'
export const insuranceBaseColumn = () => {
  return [
    {
      tableProp: 'inId',
      tableLabel: '会员ID'
    },
    {
      tableProp: 'useraccount',
      tableLabel: '账号',
      width: 120
    },
    {
      tableProp: 'insurant',
      tableLabel: '用户'
    },
    {
      tableProp: 'insuranceNo',
      tableLabel: '保单号',
      width: 200
    },
    {
      tableProp: 'insuranceAmount',
      tableLabel: '保险费'
    },
    {
      tableProp: 'guaranteeAmount',
      tableLabel: '投保金额'
    },
    {
      tableProp: 'insuranceTerm',
      tableLabel: '保障期限'
    },
    {
      tableProp: 'effectiveDate',
      tableLabel: '生效日期',
      width: 160
    },
    {
      tableProp: 'endDate',
      tableLabel: '结束日期',
      width: 160
    },
    {
      tableProp: 'addDate',
      tableLabel: '创建时间',
      width: 160
    },
    {
      tableProp: 'insuranceType',
      tableLabel: '状态'
    }
  ]
}
export const exportRecordBaseColumn = () => {
  return [
    {
      tableProp: 'batchId',
      tableLabel: '批次'
    },
    {
      tableProp: 'exportNum',
      tableLabel: '导出数量'
    },
    {
      tableProp: 'operator',
      tableLabel: '导出操作人'
    },
    {
      tableProp: 'exportDate',
      tableLabel: '导出时间',
      width: 160
    },
    {
      tableProp: 'updateDate',
      tableLabel: '更新时间',
      width: 160
    },
    {
      tableProp: 'state',
      tableLabel: '状态'
    },
    {
      tableProp: 'updateOper',
      tableLabel: '更新操作人'
    }
  ]
}
export const organWithdrawalBaseColumn = () => {
  return [
    {
      tableProp: 'withdrawId',
      tableLabel: '订单编号'
    },
    {
      tableProp: 'organ',
      tableLabel: '机构'
    },
    {
      tableProp: 'organLevel',
      tableLabel: '机构类型'
    },
    {
      tableProp: 'currBlance',
      tableLabel: '账户余额（元）'
    },
    {
      tableProp: 'withdrawAmt',
      tableLabel: '提现金额（元）'
    },
    {
      tableProp: 'arrivalAmt',
      tableLabel: '实际到账(元)'
    },
    {
      tableProp: 'fee',
      tableLabel: '手续费(元)'
    },

    {
      tableProp: 'bankCardNo',
      tableLabel: '到账卡号',
      width: 160
    },
    {
      tableProp: 'username',
      tableLabel: '收款人'
    },
    {
      tableProp: 'auditStatus',
      tableLabel: '审核状态'
    },
    {
      tableProp: 'payStatus',
      tableLabel: '代付状态'
    },
    {
      tableProp: 'payOrderNo',
      tableLabel: '通道订单号'
    },
    {
      tableProp: 'addDate',
      tableLabel: '申请时间',
      width: 120
    },
    {
      tableProp: 'auditDate',
      tableLabel: '审核时间',
      width: 120
    }
  ]
}
export const userWithdrawalBaseColumn = () => {
  return [
    {
      tableProp: 'withdrawId',
      tableLabel: '订单编号'
    },
    {
      tableProp: 'user',
      tableLabel: '用户',
      width: 140
    },
    {
      tableProp: 'currBlance',
      tableLabel: '账户余额 (元)'
    },
    {
      tableProp: 'withdrawAmt',
      tableLabel: '提现金额(元)'
    },
    {
      tableProp: 'arrivalAmt',
      tableLabel: '实际到账(元)'
    },
    {
      tableProp: 'fee',
      tableLabel: '手续费(元)'
    },
    {
      tableProp: 'bankCardNo',
      tableLabel: '到账卡号',
      width: 160
    },
    {
      tableProp: 'username',
      tableLabel: '收款人'
    },
    {
      tableProp: 'auditStatus',
      tableLabel: '审核状态'
    },
    {
      tableProp: 'payStatus',
      tableLabel: '代付状态'
    },
    {
      tableProp: 'payOrderNo',
      tableLabel: '通道订单号'
    },
    {
      tableProp: 'addDate',
      tableLabel: '申请时间',
      width: 120
    },
    {
      tableProp: 'auditDate',
      tableLabel: '审核时间',
      width: 120
    }
  ]
}
export const parseInsurance = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    effectiveDate: formateTime(v.effectiveDate),
    endDate: formateTime(v.endDate),
    addDate: formateTime(v.addDate),
    insuranceType: insuranceStatus[v.insuranceType]
  }))
}
export const parseExportRecord = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    exportDate: formateTime(v.exportDate),
    updateDate: formateTime(v.updateDate),
    state: exportRecordStatus[v.recordState]
  }))
}
export const parseOrganWithdrawl = arr => {
  console.log('arrarrarrarrarr',arr);
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    organ: `${v.organName}(${v.organaccount})`,
    organLevel: organLevel[v.organLevel],
    auditStatus: auditStatus[v.auditStatus],
    payStatus: payStatus[v.payStatus],
    addDate: formateTime(v.addDate),
    auditDate: formateTime(v.auditDate)
  }))
}
export const parseUserWithdrawl = arr => {
  if (arr.length === 0) {
    return
  }
  return arr.map(v => ({
    ...v,
    user: `${v.username}(${v.phone})`,
    auditStatus: auditStatus[v.auditStatus],
    payStatus: payStatus[v.payStatus],
    addDate: formateTime(v.addDate),
    auditDate: formateTime(v.auditDate)
  }))
}
