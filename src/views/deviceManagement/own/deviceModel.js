export const vendorColumn = () => {
  return [
    {
      tableProp: 'factoryName',
      tableLabel: '厂商名称'
    },
    {
      tableProp: 'factorySubName',
      tableLabel: '厂商别名'
    }
  ]
}
export const devModelColumn = () => {
  return [
    {
      tableProp: 'brandId',
      tableLabel: '型号编号'
    },
    {
      tableProp: 'brandName',
      tableLabel: '设备型号'
    },
    {
      tableProp: 'brandSubName',
      tableLabel: '设备型号简称'
    },
    {
      tableProp: 'posFactoryName',
      tableLabel: '厂商简称'
    },
    {
      tableProp: 'price',
      tableLabel: '销售价格(元)'
    },
    {
      tableProp: 'cardReward',
      tableLabel: '合伙人奖励(元)'
    },
    {
      tableProp: 'activateReward',
      tableLabel: '机构奖励(元)'
    },
    {
      tableProp: 'selfPort',
      tableLabel: '自带端口'
    },
    {
      tableProp: 'defaultPort',
      tableLabel: '默认激活'
    },
    {
      tableProp: 'totalPort',
      tableLabel: '端口总数'
    }
  ]
}
