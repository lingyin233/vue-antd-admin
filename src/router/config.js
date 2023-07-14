import TabsView from '@/layouts/tabs/TabsView';
import BlankView from '@/layouts/BlankView';
import PageView from '@/layouts/PageView';

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: 'index',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [{
            path: 'workplace',
            name: '欢迎页',
            component: () => import('@/pages/demo/Demo'),
          }]
        },
        {
          path: 'users',
          name: '用户管理',
          meta: {
            icon: 'user'
          },
          component: BlankView,
          children: [{
            path: 'list',
            name: '用户列表',
            component: () => import('@/pages/user/User')
          }]
        },
        {
          path: 'device/list',
          name: '设备列表',
          meta: {
            invisible: true
          },
          component: () => import('@/pages/device/List')
        },
        {
          path: 'company',
          name: 'OEM厂商管理',
          meta: {
            icon: 'user'
          },
          component: BlankView,
          children: [
            {
              path: 'list',
              name: '厂商列表',
              component: () => import('@/pages/company/List')
            },
            {
              path: 'add',
              name: '添加OEM厂商',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/company/Add')
            },
            {
              path: 'detail',
              name: 'OEM厂商详情',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/company/Detail')
            }
          ]
        },
        {
          path: 'appversion',
          name: 'APP版本管理',
          meta: {
            icon: 'user'
          },
          component: BlankView,
          children: [
            {
              path: 'list',
              name: 'APP版本列表',
              component: () => import('@/pages/appversion/List')
            },
            {
              path: 'add',
              name: '添加APP版本',
              meta: {
                invisible: true
              },
              component: () => import('@/pages/appversion/Add')
            }
          ]
        }
      ]
    }
  ]
};

export default options;
