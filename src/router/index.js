import Vue from 'vue'
import Router from 'vue-router'

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
          {
            meta: {
              title: '蚂蚁金服System'
            },
            path: '/AntDesign',
            component: () => import('../views/AntDesign.vue')
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
