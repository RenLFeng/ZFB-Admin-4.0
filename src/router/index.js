import Vue from 'vue'
import Router from 'vue-router'
import { platform, provincialLevel, oneStage } from './pages'

Vue.use(Router)

export function createRouter() {
  return new Router({
    routes: [
      {
        path: '/login',
        component: () => import('../views/login.vue')
      },
      {
        path: '/',
        component: () => import('../views/Container.vue'),
        meta: { title: '智付宝台管理后台4.0' },
        children: [
          platform,
          provincialLevel,
          oneStage,
          {
            meta: {
              title: '蚂蚁金服System'
            },
            path: '/AntDesign',
            component: () => import('../views/AntDesign.vue')
          },
          {
            meta: {
              title: '修改密码'
            },
            path: '/editPassword',
            component: () => import('../views/systemManagement/editPassword.vue')
          },
          {
            meta: {
              title: '轮播图管理'
            },
            path: '/bannerManagement',
            component: () => import('../views/systemManagement/bannerManagement.vue')
          },
          {
            meta: {
              title: '管理员'
            },
            path: '/adminManagement',
            component: () => import('../views/permission/userManagement.vue')
          },
          {
            meta: {
              title: '角色'
            },
            path: '/roleManagement',
            component: () => import('../views/permission/roleManagement.vue')
          },
          {
            meta: {
              title: '用户管理'
            },
            path: '/userManagement',
            component: () => import('../views/userManagement/index.vue')
          },
          {
            meta: {
              title: '所有会员'
            },
            path: '/allUser',
            component: () => import('../views/userManagement/index.vue')
          },
          {
            meta: {
              title: '活动商户'
            },
            path: '/pledgeUser',
            component: () => import('../views/userManagement/pledgeUser/pledgeUser.vue')
          },
          {
            meta: {
              title: '机构列表'
            },
            path: '/organizations',
            component: () => import('../views/organizationManagement/index.vue')
          },
          // {
          //   meta: {
          //     title: '激活码'
          //   },
          //   path: '/activeCode',
          //   component: () => import('../views/organizationManagement/activeCode/index.vue')
          // },
          // {
          //   meta: {
          //     title: '设备认证'
          //   },
          //   path: '/deviceAuthentication',
          //   component: () => import('../views/deviceManagement/deviceAuthentication.vue')
          // },
          {
            meta: {
              title: '设备库存'
            },
            path: '/deviceInventory',
            component: () => import('../views/deviceManagement/deviceInventory.vue')
          },
          {
            meta: {
              title: '库存记录'
            },
            path: '/inventoryLot',
            component: () => import('../views/deviceManagement/inventoryLot.vue')
          },
          {
            meta: {
              title: '设备型号'
            },
            path: '/deviceModel',
            component: () => import('../views/deviceManagement/deviceModel.vue')
          },
          {
            meta: {
              title: '设备日志'
            },
            path: '/deviceLog',
            component: () => import('../views/deviceManagement/deviceLog.vue')
          },
          {
            meta: {
              title: '设备撤机'
            },
            path: '/deviceDel',
            component: () => import('../views/deviceManagement/deviceDel/devieceDel.vue')
          },
          {
            meta: {
              title: '设备换机'
            },
            path: '/deviceChange',
            component: () => import('../views/deviceManagement/equipmentChange/equipmentChange.vue')
          },
          {
            meta: {
              title: '终端管理'
            },
            path: '/termManage',
            component: () =>
              import('../views/deviceManagement/terminalManagement/terminalManagement.vue')
          },
          {
            meta: {
              title: '商品管理'
            },
            path: '/goodsManagement',
            component: () => import('../views/goodsManagement/goodsManagement.vue')
          },
          {
            meta: {
              title: '设备机构分润'
            },
            path: '/orgProfitDistribution',
            component: () =>
              import('../views/profitDistribution/posDistribution/orgProfitDistribution/index.vue')
          },
          {
            meta: {
              title: '设备分公司分润'
            },
            path: '/provinceProfitDistribution',
            component: () =>
              import(
                '../views/profitDistribution/posDistribution/provinceProfitDistribution/index.vue'
              )
          },
          {
            meta: {
              title: '设备合伙人分润'
            },
            path: '/teamProfitDistribution',
            component: () =>
              import('../views/profitDistribution/posDistribution/teamProfitDistribution/index.vue')
          },
          {
            meta: {
              title: '快捷机构分润'
            },
            path: '/quickOrgDistribution',
            component: () =>
              import('../views/profitDistribution/quickDistribution/quickOrgDistribution/index.vue')
          },
          {
            meta: {
              title: '快捷分公司分润'
            },
            path: '/quickProvinceDistribution',
            component: () =>
              import(
                '../views/profitDistribution/quickDistribution/quickProvinceDistribution/index.vue'
              )
          },
          {
            meta: {
              title: '快捷VIP分润'
            },
            path: '/quickVipDistribution',
            component: () =>
              import('../views/profitDistribution/quickDistribution/quickVipDistribution/index.vue')
          },
          {
            meta: {
              title: '快捷合伙人分润'
            },
            path: '/quickPartnerDistribution',
            component: () =>
              import(
                '../views/profitDistribution/quickDistribution/quickPartnerDistribution/index.vue'
              )
          },
          {
            meta: {
              title: '设备计划管理'
            },
            path: '/planManagement',
            component: () =>
              import('../views/transactionManagement/posTransaction/planManagement.vue')
          },
          {
            meta: {
              title: '设备还款查询'
            },
            path: '/repayments',
            component: () => import('../views/transactionManagement/posTransaction/repayments.vue')
          },
          {
            meta: {
              title: '设备消费查询'
            },
            path: '/payments',
            component: () => import('../views/transactionManagement/posTransaction/payments.vue')
          },
          {
            meta: {
              title: '设备收款查询'
            },
            path: '/cashout',
            component: () => import('../views/transactionManagement/posTransaction/cashout.vue')
          },
          // {
          //   meta: {
          //     title: '快捷计划管理'
          //   },
          //   path: '/quickPlanManagement',
          //   component: () =>
          //     import('../views/transactionManagement/quickTransaction/quickPlanManagement.vue')
          // },
          // {
          //   meta: {
          //     title: '快捷还款查询'
          //   },
          //   path: '/quickRepayments',
          //   component: () =>
          //     import('../views/transactionManagement/quickTransaction/quickRepayments.vue')
          // },
          // {
          //   meta: {
          //     title: '快捷消费查询'
          //   },
          //   path: '/quickPayments',
          //   component: () =>
          //     import('../views/transactionManagement/quickTransaction/quickPayments.vue')
          // },
          // {
          //   meta: {
          //     title: '快捷收款查询'
          //   },
          //   path: '/quickCashout',
          //   component: () =>
          //     import('../views/transactionManagement/quickTransaction/quickCashout.vue')
          // },
          // {
          //   meta: {
          //     title: '订单中心'
          //   },
          //   path: '/orderCenter',
          //   component: () => import('../views/orderManagement/orderCenter.vue')
          // },
          {
            meta: {
              title: '设备订单'
            },
            path: '/deviceOrder',
            component: () => import('../views/orderManagement/deviceOrder.vue')
          },
          // {
          //   meta: {
          //     title: '端口订单'
          //   },
          //   path: '/slotOrder',
          //   component: () => import('../views/orderManagement/slotOrder.vue')
          // },
          {
            meta: {
              title: '测评订单'
            },
            path: '/evaluationOrder',
            component: () => import('../views/orderManagement/evaluationOrder.vue')
          },
          // {
          //   meta: {
          //     title: '交易订单'
          //   },
          //   path: '/transactionOrder',
          //   component: () => import('../views/orderManagement/transactionOrder.vue')
          // },
          // {
          //   meta: {
          //     title: '平台账户'
          //   },
          //   path: '/platformAccount',
          //   component: () => import('../views/financeManagement/platformAccount.vue')
          // },
          {
            meta: {
              title: '系统公告'
            },
            path: '/systemNotice',
            component: () => import('../views/platformManagement/systemNotice.vue')
          },

          {
            meta: {
              title: '保单信息'
            },
            path: '/insuranceInfo',
            component: () => import('../views/financeManagement/insuranceInfo.vue')
          },
          {
            meta: {
              title: '提现管理'
            },
            path: '/withdrawalsManagement',
            component: () => import('../views/financeManagement/withdrawalsManagement/index.vue')
          },
          {
            meta: {
              title: '机构提现'
            },
            path: '/organizationWithdrawals',
            component: () =>
              import('../views/financeManagement/withdrawalsManagement/organizationWithdrawals.vue')
          },
          {
            meta: {
              title: '会员提现'
            },
            path: '/userWithdrawals',
            component: () =>
              import('../views/financeManagement/withdrawalsManagement/userWithdrawals.vue')
          },
          {
            meta: {
              title: '信用卡申请'
            },
            path: '/creditCardApply',
            component: () =>
              import('../views/platformManagement/creditCardApply/creditCardApply.vue')
          },
          {
            meta: {
              title: '短信验证码'
            },
            path: '/smsVerificationCode',
            component: () => import('../views/platformManagement/smsVerificationCode.vue')
          },
          {
            meta: {
              title: '轮播图列表'
            },
            path: '/banner',
            component: () => import('../views/platformManagement/banner.vue')
          },
          {
            meta: {
              title: '版本列表'
            },
            path: '/version',
            component: () => import('../views/platformManagement/version.vue')
          },
          {
            meta: {
              title: '意见反馈'
            },
            path: '/suggestion',
            component: () => import('../views/platformManagement/suggestion.vue')
          },
          {
            meta: {
              title: '银行信息'
            },
            path: '/bank',
            component: () => import('../views/platformManagement/bank.vue')
          },
          // {
          //   meta: {
          //     title: '还款通道'
          //   },
          //   path: '/repaymentChannel',
          //   component: () => import('../views/channelManagement/repaymentChannel.vue')
          // },
          // {
          //   meta: {
          //     title: '收款通道'
          //   },
          //   path: '/receiptChannel',
          //   component: () => import('../views/channelManagement/receiptChannel.vue')
          // },
          {
            meta: {
              title: '鉴权记录'
            },
            path: '/authenticationRecord',
            component: () => import('../views/404/index.vue')
            // () => import('../views/channelManagement/authenticationRecord.vue')
          },
          {
            meta: {
              title: '通道订单'
            },
            path: '/channelOrder',
            component: () => import('../views/channelManagement/channelOrder.vue')
          },
          // {
          //   meta: {
          //     title: '操作日志'
          //   },
          //   path: '/optLog',
          //   component: () => import('../views/systemManagement/permissionManagement/optLog.vue')
          // },
          {
            meta: {
              title: '系统设置'
            },
            path: '/systemSetting',
            component: () =>
              import('../views/systemManagement/permissionManagement/systemSetting.vue')
          },
          {
            meta: {
              title: '账户管理'
            },
            path: '/treasuryManagement',
            component: () => import('../views/treasuryManagement/index.vue')
          },
          {
            meta: {
              title: '404'
            },
            path: '/*',
            component: () => import('../views/404/index.vue')
          }
        ]
      }
    ]
  })
}
