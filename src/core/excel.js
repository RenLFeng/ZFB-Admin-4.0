import XLSX from 'xlsx'
import { post } from '../store/requestFacade'

const stringToArrayBuffer = string => {
  const buffer = new ArrayBuffer(string.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i !== string.length; ++i) {
    view[i] = string.charCodeAt(i) & 0xff
  }
  return buffer
}

export const format = ({ head, content }) => {
  const array = []
  const keys = Object.keys(head)
  array[0] = keys.reduce((acc, currentValue) => {
    acc.push(head[currentValue])
    return acc
  }, [])
  const getValue = obj => keys.map(key => obj[key] || '')
  return array.concat(content.map(getValue))
}

export const writeFromUrl = url => {
  return async() => {
    try {
      const {
        data: { fileName, head, content }
      } = await post({ url })
      const array = format({
        head,
        content
      })
      write(array, fileName)
    } catch (error) {
      console.log(error)
    }
  }
}

export function write(array, fileName) {
  const workBook = XLSX.utils.book_new()
  const workSheet = XLSX.utils.aoa_to_sheet(array)
  XLSX.utils.book_append_sheet(workBook, workSheet, 'sheet1')
  const tmpDown = new Blob(
    [
      stringToArrayBuffer(
        XLSX.write(workBook, {
          bookType: 'xlsx',
          bookSST: false,
          type: 'binary'
        })
      )
    ],
    { type: '' }
  )
  const a = document.createElement('a')
  a.href = URL.createObjectURL(tmpDown)
  a.download = `${fileName}.xls`
  a.click()
}

export const readExcel = e => {
  return new Promise((resolve, reject) => {
    const files = e.target.files
    if (files.length <= 0) {
      // 如果没有文件名
      return false
    } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
      this.$message('上传格式不正确，请上传xls或者xlsx格式')
      return false
    }
    const fileReader = new FileReader()
    fileReader.onload = ev => {
      try {
        const data = ev.target.result
        const workbook = XLSX.read(data, {
          type: 'binary'
        })
        const wsname = workbook.SheetNames[0] // 取第一张表
        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // 生成json表格内容
        // console.log(ws)
        resolve(ws)
      } catch (error) {
        reject(error)
      }
    }
    fileReader.readAsBinaryString(files[0])
  })
}
