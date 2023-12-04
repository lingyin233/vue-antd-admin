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
      path: 'demo',
      name: 'demo',
      meta: {
        icon: 'dashboard',
      },
      redirect: '/dashboard/workplace',
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
            icon: 'apple'
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
            icon: 'apple'
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
        // {
        //   path: 'appversion',
        //   name: 'APP版本管理',
        //   meta: {
        //     icon: 'apple'
        //   },
        //   component: BlankView,
        //   children: [
        //     {
        //       path: 'list',
        //       name: 'APP版本列表',
        //       component: () => import('@/pages/appversion/List')
        //     },
        //     {
        //       path: 'add',
        //       name: '添加APP版本',
        //       meta: {
        //         invisible: true
        //       },
        //       component: () => import('@/pages/appversion/Add')
        //     }
        //   ]
        // },
        {
          path: 'appupdate',
          name: 'APP更新管理',
          meta: {
            icon: 'apple'
          },
          component: BlankView,
          children: [
            {
              path: 'list',
              name: 'APP更新列表',
              component: () => import('@/pages/appupdate/List')
            }
          ]
        },
        {
          path: 'appearance',
          name: '个人形象管理',
          meta: {
            icon: 'apple'
          },
          component: BlankView,
          children: [
            {
              path: 'list',
              name: '个人形象列表',
              component: () => import('@/pages/appearance/List')
            }
          ]
        },
        {
          path: 'feedback',
          name: '意见反馈管理',
          meta: {
            icon: 'apple'
          },
          component: BlankView,
          children: [
            {
              path: 'list',
              name: '意见反馈列表',
              component: () => import('@/pages/feedback/List')
            },
          ]
        },
        {
          path: 'skillinfo',
          name: '技能描述管理',
          meta: {
            icon: 'apple'
          },
          component: BlankView,
          children: [
            {
              path: 'list',
              name: '技能描述列表',
              component: () => import('@/pages/skillinfo/List')
            },
            {
              path: 'listGroup',
              name: '技能分组列表',
              component: () => import('@/pages/skillinfo/ListGroup')
            },
          ]
        },
        {
          path: 'serial',
          name: '序列号管理',
          meta: {
            icon: 'apple'
          },
          component: BlankView,
          children: [
            {
              path: 'list',
              name: '序列号列表',
              component: () => import('@/pages/serial/List')
            },
          ]
        },
        {
          path: 'voice',
          name: '标贝声音管理',
          meta: {
            icon: 'apple'
          },
          component: BlankView,
          children: [
            {
              path: 'list',
              name: '标贝声音列表',
              component: () => import('@/pages/voice/List')
            },
          ]
        },
        {
          path: 'audio',
          name: '语音管理',
          meta: {
            icon: 'apple'
          },
          component: BlankView,
          children: [
            {
              path: 'xftts',
              name: '讯飞语音合成',
              component: () => import('@/pages/audio/xftts')
            },
            {
              path: 'bakertts',
              name: '标贝语音合成',
              component: () => import('@/pages/audio/bakertts')
            },
          ]
        },
      ]
    }
  ]
};

export default options;
