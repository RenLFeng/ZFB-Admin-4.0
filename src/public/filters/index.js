export const dateServer = value => value.toString().replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')

export const clip = v => v.slice(0, -2)

// 时间戳转换
export const formateTime = dataTime => {
  if (!dataTime) return ''
  let date = new Date(dataTime)
  let y = date.getFullYear()
  let MM = date.getMonth() + 1
  MM = MM < 10 ? '0' + MM : MM
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let m = date.getMinutes()
  m = m < 10 ? '0' + m : m
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m
}

// 金额转换
export const formateMoney = amount => {
  if (!amount) return '0.00'
  var intPart = amount + ''
  var floatPart = '.00'
  var amountValue = intPart.split('.')
  if (amountValue.length === 2) {
    floatPart = amountValue[1].toString() // 拿到小数部分
    var numPart = amountValue[0].toString() // 拿到整数部分
    if (floatPart.length === 1) {
      // 补0,
      return numPart + '.' + floatPart + '0'
    } else {
      return numPart + '.' + floatPart
    }
  }
  return amountValue + floatPart
}
