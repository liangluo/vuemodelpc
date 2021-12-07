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
        title: '首页（罗）',
        icon: 'el-icon-s-home',
        component: () => import('@/views/pages/PageHome')
      }, {
        path: '/content',
        name: 'content',
        title: '内容管理',
        icon: 'el-icon-postcard',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/content/classifymanage',
            name: 'classifymanage',
            title: '分类管理(张)',
            component: () => import('@/views/pages/content/ClassifyManage')
          }, {
            path: '/content/labelmanage',
            name: 'labelmanage',
            title: '标签管理(张)',
            component: () => import('@/views/pages/content/LabelManage')
          }, {
            path: '/content/informationmanage',
            name: 'informationmanage',
            title: '图文资讯管理(杨)',
            component: () => import('@/views/pages/content/InformationManage')
          }, {
            path: '/content/videomanage',
            name: 'videomanage',
            title: '视频资讯管理(杨)',
            component: () => import('@/views/pages/content/VideoManage')
          }, {
            path: '/content/actmanage',
            name: 'actmanage',
            title: '活动管理(杨)',
            component: () => import('@/views/pages/content/ActManage')
          }, {
            path: '/content/scenmanage',
            name: 'scenmanage',
            title: '地点管理(杨)',
            component: () => import('@/views/pages/content/ScenManage')
          }
        ]
      }, {
        path: '/operations',
        name: 'operations',
        title: '运营管理',
        icon: 'el-icon-postcard',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/operations/pagemanage',
            name: 'pagemanage',
            title: '页面管理(杨)',
            component: () => import('@/views/pages/operations/PageManage')
          }, {
            path: '/operations/columnmanage',
            name: 'columnmanage',
            title: '栏目管理（杨）',
            component: () => import('@/views/pages/operations/ColumnManage')
          }, {
            path: '/operations/advermanage',
            name: 'advermanage',
            title: '开屏广告管理（张）',
            component: () => import('@/views/pages/operations/AdverManage')
          }, {
            path: '/operations/searchword',
            name: 'searchword',
            title: '搜索热词管理（张）',
            component: () => import('@/views/pages/operations/SearchWord')
          }
        ]
      }, {
        path: '/resource',
        name: 'resource',
        title: '预约信息',
        icon: 'el-icon-postcard',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/resource/actquery',
            name: 'actquery',
            title: '活动报名信息（张）',
            component: () => import('@/views/pages/resource/ActQuery')
          }, {
            path: '/resource/scenquery',
            name: 'scenquery',
            title: '地点预约信息（张）',
            component: () => import('@/views/pages/resource/ScenQuery')
          }
        ]
      }, {
        path: '/system',
        name: 'system',
        title: '设置',
        icon: 'el-icon-setting',
        component: () => import('@/views/layout/TheLayoutEmpty'),
        children: [
          {
            path: '/system/management',
            name: 'management',
            title: '用户管理（完成）',
            component: () => import('@/views/pages/system/PageUserManagement')
          },
          {
            path: '/system/menumanagement',
            name: 'menumanagement',
            title: '菜单管理（完成）',
            component: () => import('@/views/pages/system/PageMenuManagement')
          }, {
            path: '/system/permissions',
            name: 'permissions',
            title: '角色权限（完成）',
            component: () => import('@/views/pages/system/PageUserPermissions')
          }, {
            path: '/system/enterprise',
            name: 'enterprise',
            title: '企业管理（完成）',
            component: () => import('@/views/pages/system/PageEnterprise')
          }, {
            path: '/system/handlerecord',
            name: 'handlerecord',
            title: '操作记录（完成）',
            component: () => import('@/views/pages/system/PageHandler')
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
