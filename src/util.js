export const underlineToCombo = underlineStyle => {
  let nextConvert = false
  return underlineStyle.split('').reduce((acc, char, charIndex) => {
    if (charIndex === 0) {
      return char
    } else {
      if (char === '_') {
        nextConvert = !nextConvert
        return acc + ''
      } else {
        if (nextConvert) {
          nextConvert = !nextConvert
          return acc + char.toUpperCase()
        } else {
          return acc + char
        }
      }
    }
  }, '')
}

export const queryPermission = permission => {
  let authority = JSON.parse(localStorage.getItem('yxjmenu'))
  let authoritySub = []

  function roll(arr) {
    arr.forEach(item => {
      item.code && authoritySub.push(underlineToCombo(item.code))
      if (item.code) {
        authoritySub.push(underlineToCombo(item.code))
      }
      if (item.subMenuItems.length > 0) {
        roll(item.subMenuItems)
      }
    })
  }
  roll(authority)
  return authoritySub.includes(permission)
}
// export const queryPermission = permission => true

/* pipe */
export const pipe = fns => fns.reduce((f, g) => (...args) => g(f(...args)))

// /* deepClone */
// export function deepClone(source) {
//   var copy = source instanceof Array ? [] : {}
//   for (attr in source) {
//     if (!source.hasOwnProperty(attr)) continue
//     copy[attr] = typeof source[attr] === 'object' ? deepClone(source[attr]) : source[attr]
//   }
//   return copy`
// }

/* getDataFormlocalStorage */
export const getDataFormlocalStorage = itemName => JSON.parse(localStorage.getItem(itemName))

/* parseJSON */
export const parseJSON = str => JSON.parse(str)

/* 时间戳转换 */
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

export const difference = (a, b) => {
  const s = new Set(b)
  return a.filter(x => !s.has(x))
}

export const tailorStr = (str, number = 8) => {
  const str2 = String(str).replace(/↵/g, '')
  return str2.slice(0, number) + '...'
}

export const filterUerLeveL = arr =>
  arr.filter(v => v.level.includes(localStorage.getItem('level')))

export const filterAmount = amount => {
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
    } else if (floatPart.length > 2) {
      return numPart + '.' + floatPart.slice(0, 2)
    } else {
      return numPart + '.' + floatPart
    }
  }
  return amountValue + floatPart
}

export const filterMonth = addDate => {
  if (!addDate) return ''
  const time = new Date(addDate)
  let y = time.getFullYear()
  let MM = time.getMonth() + 1
  if (MM < 10) {
    return y + '-0' + MM
  }
  return y + '-' + MM
}
