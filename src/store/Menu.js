const TYPE = {
  MENU: 1,
  PAGE: 2,
  OPT: 3
}

const iconMap = {
  platform: 'el-icon-lx-home',
  oneStage: 'el-icon-lx-home',
  provincialLevel: 'el-icon-lx-home',
  userManagement: 'el-icon-lx-huiyuan',
  organizationManagement: 'el-icon-lx-fenzhijigou',
  deviceManagement: 'el-icon-lx-pos',
  goodsManagement: 'el-icon-lx-iconfontzhizuobiaozhun023109',
  profitDistribution: 'el-icon-lx-qian',
  transactionManagement: 'el-icon-lx-jiaoyi',
  orderManagement: 'el-icon-lx-jiludanzilishijilu',
  financeManagement: 'el-icon-lx-caiwu',
  platformManagement: 'el-icon-lx-computer_icon',
  channelManagement: 'el-icon-lx-tongdaoliebiao',
  systemManagement: 'el-icon-lx-xitong',
  treasuryManagement: 'el-icon-lx-denglu'
}

const underlineToCombo = underlineStyle => {
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

class Menu {
  constructor({
    id,
    parentId,
    icon,
    name,
    code,
    route,
    children,
    type
  }) {
    this.id = id
    this.parentId = parentId
    this.route = underlineToCombo(code)
    this.icon = iconMap[this.route]
    this.name = name
    this.code = code
    this.children = [].concat(children)
    this.type = type
  }
}

Menu.buildFromArray = array => {
  if (array === undefined || array === null) {
    console.log(typeof array)
    return
  }
  return array.map(({
    code, id, name, parentId, route, subMenuItems, icon, type
  }) => {
    if (type === TYPE.MENU) {
      return new Menu({
        id,
        parentId,
        name,
        code,
        route,
        icon,
        children: Menu.buildFromArray(subMenuItems || []).filter(_ => !!_),
        type
      })
    }
  })
}

Menu.TYPE = TYPE

export default Menu
