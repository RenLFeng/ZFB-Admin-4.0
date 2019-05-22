import { formateTime } from '../../../util'
export const suggestionBaseColumn = () => {
  return [
    {
      tableProp: 'feedId',
      tableLabel: '序号'
    },
    {
      tableProp: 'useraccount',
      tableLabel: '会员'
    },
    {
      tableProp: 'feedContent',
      tableLabel: '建议&意见'
    },
    {
      tableProp: 'addDate',
      tableLabel: '创建时间'
    }
  ]
}
export const parseSuggestion = arr => {
  return arr.map(v => ({
    ...v,
    addDate: formateTime(v.addDate)
  }))
}
