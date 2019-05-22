import { formateTime } from '../../../util'
export const smsCodeBaseColumn = () => {
  return [
    {
      tableProp: 'receivePhone',
      tableLabel: '手机号码',
      width: 150
    },
    {
      tableProp: 'smsCode',
      tableLabel: '验证码',
      width: 120
    },
    {
      tableProp: 'smsContext',
      tableLabel: '短信信息'
    },
    {
      tableProp: 'addDate',
      tableLabel: '创建时间',
      width: 200
    }
  ]
}
export const parseSmsCode = arr => {
  return arr.map(v => ({
    ...v,
    addDate: formateTime(v.addDate)
  }))
}
