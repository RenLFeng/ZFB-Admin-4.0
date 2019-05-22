import { underlineToCombo } from '../../../src/util'
import { expect } from 'chai'

describe('test util', () => {
  it('test underline to combo', () => {
    expect(underlineToCombo('platform')).to.equal('platform')
    expect(underlineToCombo('user_management')).to.equal('userManagement')
    expect(underlineToCombo('device_management')).to.equal('deviceManagement')
    expect(underlineToCombo('this_is_underline_style')).to.equal('thisIsUnderlineStyle')
  })
})
