import Mock from 'mockjs'

export default {
  mockData() {
    const BASE_PATH = process.env.BASE_URL.endsWith('/') ? process.env.BASE_URL.substr(0, process.env.BASE_URL.length - 1) : process.env.BASE_URL
    Mock.mock(BASE_PATH + '/api/user/login', {
      code: 1,
      token: 'fadafdasdfsdfsdfsdfsdfds',
      result: {
        id: '100001',
        name: '罗亮',
        roles: ['admin']
      }
    })
    Mock.mock(BASE_PATH + '/api/user/register', {
      code: 1
    })
    Mock.mock('/api/user/info', {
      code: 1,
      id: '100001',
      name: '罗亮',
      roles: ['admin'],
      permissions: [
        {
          // 一个页面一个对象，以name确定（对应静态路由表里面的name）
          name: 'index'
        }, {
          name: 'classifymanage'
        }, {
          name: 'userPermissions'
        }, {
          name: 'labelmanage'
        }, {
          name: 'informationmanage'
        }, {
          name: 'videomanage'
        }, {
          name: 'actmanage'
        }, {
          name: 'scenmanage'
        }, {
          name: 'pagemanage'
        }, {
          name: 'columnmanage'
        }, {
          name: 'advermanage'
        }, {
          name: 'searchword'
        }, {
          name: 'actquery'
        }, {
          name: 'scenquery'
        }, {
          name: 'userManagement'
        }, {
          name: 'menuManagement'
        }, {
          name: 'userPermissions'
        }, {
          name: 'userHandlerecord'
        }
      ]
    })
    Mock.mock('/api/user/changePassword', {
      code: 1,
      token: 'fdsjfhjkdshfkldsajfjasdfbjsdkfhsdajfj'
    })
    Mock.mock('/api/user/query', {
      code: 1,
      'data|30-60': [
        {
          'name|1': [Mock.mock('@cname'), Mock.mock('@cname'), Mock.mock('@cname'), Mock.mock('@cname')],
          'date|1': [Mock.mock('@date("yyyy-MM-dd")'), Mock.mock('@date("yyyy-MM-dd")'), Mock.mock('@date("yyyy-MM-dd")')],
          'address|1': [Mock.mock('@county(true)'), Mock.mock('@county(true)'), Mock.mock('@county(true)')]
        }
      ]
    })
    Mock.mock(BASE_PATH + '/api/user/permissions', {
      code: 1,
      permissions: {
        users: [
          {
            id: 1,
            name: '张三',
            roleIds: [1, 3]
          }, {
            id: 2,
            name: '李四',
            roleIds: [2, 3]
          }, {
            id: 3,
            name: '王五',
            roleIds: [3]
          }
        ],
        roles: [
          {
            id: 1,
            name: '管理员',
            pageIds: [1, 2],
            directiveIds: [1, 2]
          }, {
            id: 2,
            name: '普通用户',
            pageIds: [1, 2],
            directiveIds: [1]
          }, {
            id: 3,
            name: '登录用户',
            pageIds: [1],
            directiveIds: []
          }
        ],
        pages: [
          {
            id: 1,
            name: '四级目录',
            path: '/level1/level2/level3/level4'
          }, {
            id: 2,
            name: '四级目录详情',
            path: '/level1/level2/level3/level4/:id'
          },
          {
            id: 3,
            name: '修改密码',
            path: '/user/password'
          },
          {
            id: 4,
            name: '用户权限',
            path: '/user/permissions'
          }
        ],
        directive: [
          {
            id: 1,
            name: '修改',
            pageId: 1
          }, {
            id: 2,
            name: '删除',
            pageId: 1
          }
        ]
      }
    })
  }
}
