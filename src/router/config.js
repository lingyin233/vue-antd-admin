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
        }
      ]
    }
  ]
};

export default options;
