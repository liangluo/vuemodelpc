/* 静态页面路由 */
const staticRouter = [
  {
    path: '/',
    redirect: '/index'
  }, {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/AppLogin')
  }, {
    path: '/',
    menu: true,
    name: 'layout',
    component: () => import('@/views/layout/TheLayout'),
    children: [
      {
        path: '/index',
        name: 'index',
        title: '首页',
        icon: 'el-icon-s-home',
        component: () => import('@/views/pages/PageHome')
      }, {
        path: '/column',
        name: 'column',
        title: '资源管理',
        icon: 'el-icon-postcard',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/column/resourcetype',
            name: 'resourcetype',
            title: '资源类型管理',
            component: () => import('@/views/pages/column/PageResourceType')
          }, {
            path: '/column/labelmanagement',
            name: 'labelmanagement',
            title: '标签管理',
            component: () => import('@/views/pages/column/PageLabelManagement')
          }, {
            path: '/column/columnmanagement',
            name: 'columnmanagement',
            title: '栏目管理',
            component: () => import('@/views/pages/column/PageColumnManagement')
          }, {
            path: '/act/actmanagement',
            name: 'actmanagement',
            title: '活动管理',
            component: () => import('@/views/pages/act/PageActManagement')
          }, {
            path: '/information/infomanagement',
            name: 'infomanagement',
            title: '资讯管理',
            component: () => import('@/views/pages/information/PageInfoManagement')
          }, {
            path: '/stadium/stadiummanagement',
            name: 'stadiummanagement',
            title: '场馆/景点管理',
            component: () => import('@/views/pages/stadium/PageStadiumManagement')
          }, {
            path: '/column/sensitveword',
            name: 'sensitveword',
            title: '敏感词管理',
            component: () => import('@/views/pages/column/PageSensitiveWord')
          }
        ]
      }, {
        path: '/act',
        name: 'act',
        title: '资源审核',
        icon: 'el-icon-present',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/act/actcheck',
            name: 'actcheck',
            title: '活动审核',
            component: () => import('@/views/pages/act/PageActCheck')
          },{
            path: '/information/infocheck',
            name: 'infocheck',
            title: '资讯审核',
            component: () => import('@/views/pages/information/PageInfoCheck')
          },{
            path: '/stadium/stadiumcheck',
            name: 'stadiumcheck',
            title: '场馆/景点审核',
            component: () => import('@/views/pages/stadium/PageStadiumCheck')
          },
        ]
      },{
        path: '/stadium',
        name: 'stadium',
        title: '资源查询',
        icon: 'el-icon-place',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
           {
            path: '/stadium/stadiumsubscribe',
            name: 'stadiumsubscribe',
            title: '场馆/景点预约查询',
            component: () => import('@/views/pages/stadium/PageStadiumSubscribe')
          }
        ]
      }, {
        path: '/user',
        name: 'user',
        title: '设置',
        icon: 'el-icon-setting',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/user/management',
            name: 'userManagement',
            title: '用户管理',
            component: () => import('@/views/pages/user/PageUserManagement')
          },
          {
            path: '/user/menumanagement',
            name: 'menuManagement',
            title: '菜单管理',
            component: () => import('@/views/pages/user/PageMenuManagement')
          }, {
            path: '/user/permissions',
            name: 'userPermissions',
            title: '角色权限',
            component: () => import('@/views/pages/user/PageUserPermissions')
          }, {
            path: '/user/handlerecord',
            name: 'userHandlerecord',
            title: '操作记录',
            component: () => import('@/views/pages/user/PageHandler')
          }
        ]
      },
      // 路由模版
      // {
      //   path: '/level1',
      //   name: 'level1',
      //   title: '一级目录模版类',
      //   icon: 'el-icon-s-operation',
      //   component: () => import('@/views/layout/TheLayoutEmpty'),
      //   children: [
      //     {
      //       path: '/level1/level2',
      //       name: 'level2',
      //       title: '二级目录',
      //       component: () => import('@/views/layout/TheLayoutEmpty'),
      //       children: [
      //         {
      //           path: '/level1/level2/level3',
      //           name: 'level3',
      //           title: '三级目录',
      //           component: () => import('@/views/layout/TheLayoutEmpty'),
      //           children: [
      //             {
      //               path: '/level1/level2/level3/level4',
      //               name: 'level4',
      //               title: '四级目录',
      //               component: () => import('@/views/pages/PageLevel4')
      //             }, {
      //               path: '/level1/level2/level3/level4/:id',
      //               name: 'level4Detail',
      //               title: '四级目录详情',
      //               component: () => import('@/views/pages/PageLevel4Detail'),
      //               noMenu: true,
      //               meta: {
      //                 menuPath: '/level1/level2/level3/level4'
      //               }
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // }
    ]
  }, {
    path: '/error/403',
    name: 'error403',
    component: () => import('@/views/error/AppError403')
  }, {
    path: '/error/500',
    name: 'error500',
    component: () => import('@/views/error/AppError500')
  }, {
    path: '*',
    name: 'error404',
    component: () => import('@/views/error/AppError404')
  }
]

export default staticRouter
