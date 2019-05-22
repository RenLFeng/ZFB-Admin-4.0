import { pageMixin } from './pageMixin'
import { pageMixins } from './pageMixins'
import { readFile } from './fileRead'
import { build } from './qrCode'
import { dateHorizon } from './dateHorizon'
import { write, format, writeFromUrl, readExcel } from './excel'

export const mixins = {
  pageMixin, pageMixins
}
export const date = {
  dateHorizon
}
export const img = {
  readFile
}

export const excel = {
  write,
  format,
  writeFromUrl,
  readExcel
}

export const qrCode = {
  build
}
