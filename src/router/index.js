import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/',
    component: Layout,
    // redirect: '/example/table',
    // name: 'deviceStatus',
    // meta: { title: '设备实时状态', icon: 'example' },
    children: [
      {
        path: 'monitor',
        name: 'deviceStatus',
        component: () => import('@/views/monitor/index'),
        meta: { title: '设备实时状态', icon: 'table' }
      },
      {
        path: 'detail',
        name: 'deviceInfo',
        component: () => import('@/views/monitor/details'),
        meta: { title: '设备详情', noCache: true },
        hidden: true
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'analysis',
        name: 'deviceAnalysis',
        component: () => import('@/views/analysis/index'),
        meta: { title: '设备分析', icon: 'table' }
      },
      {
        path: 'usage',
        name: 'usageDetail',
        component: () => import('@/views/analysis/usage'),
        meta: { title: '使用率详情', noCache: true },
        hidden: true
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/alert',
        name: 'alert',
        component: () => import('@/views/alert/index'),
        meta: { title: '报警预测', icon: 'table' }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/sysset',
        name: 'sysset',
        component: () => import('@/views/sysset/factory'),
        meta: { title: '工厂信息', icon: 'table' }
      }
    ]
  },

  {
    path: '/admin',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/admin',
    component: Layout,
    name: 'admin',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/admin/index'),
        meta: { title: '后台管理' }
      },
      {
        path: 'usermgmt',
        name: 'usermgmt',
        component: () => import('@/views/admin/usermgr'),
        meta: { title: '用户管理' }
      },
      {
        path: 'workshop',
        name: 'workshop',
        component: () => import('@/views/admin/workshops'),
        meta: { title: '车间管理' }
      },
      {
        path: 'usermgr',
        name: 'usermgr',
        component: () => import('@/views/sysset/usermgr'),
        meta: { title: '用户管理' }
      }
    ]
  },

  // {
  //   path: '/sysset',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'sysset',
  //   meta: {
  //     title: '系统设置',
  //     icon: 'form'
  //   },
  //   children: [
  //     {
  //       path: 'architecture',
  //       component: () => import('@/views/sysset/architecture'),
  //       name: 'architec',
  //       meta: { title: '组织结构', noCache: true }
  //     },
  //     {
  //       path: 'usermgr',
  //       component: () => import('@/views/sysset/usermgr'),
  //       name: 'usermgr',
  //       meta: { title: '人员账号', noCache: true }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
