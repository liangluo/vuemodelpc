import { request } from '../utils/request'

// 登录
export const requestLogin = params => {
  return request('/hbwl/rest/admin/login', params)
};
// 用户列表
export const userList = (params, currentPage, pageSize) => {
  return request(`/hbwl/rest/admin/findListByPage?page=${currentPage}&pageCount=${pageSize}`, params);
};
// 用户新增或修改
export const userSave = (params) => {
  if (!params.adminId) {
    return request('/hbwl/rest/admin/add', params);
  } else {
    return request('/hbwl/rest/admin/update', params);
  }
};
// 用户id查询详情
export const requestUserId = params => {
  return request(`/hbwl/rest/admin/findById/${params.id}`, params, { method: 'get' })
}

// 删除用户
export const userDelete = params => {
  return request(`/hbwl/rest/admin/delete/${params.id}`, params, { method: 'get' })
};

// 菜单列表
export const requestMenuList = (params, currentPage, pageSize) => {
  return request(`/hbwl/rest/menu/findListByPage?page=${currentPage}&pageCount=${pageSize}`, params)
};
// 菜单查询所有列表
export const requestMenuListAll = (params) => {
  return request(`/hbwl/rest/menu/findList`, params)
};
// 角色列表
export const requestPermissionList = (params, currentPage, pageSize) => {
  return request(`hbwl/rest/role/findListByPage?page=${currentPage}&pageCount=${pageSize}`, params)
}
// 角色新增
export const requestPermissionAdd = params => {
  return request('/hbwl/rest/role/add', params)
}
// 角色删除
export const requestPermissionDel = params => {
  return request(`/hbwl/rest/role/delete/${params.id}`, params, { method: 'get' })
}
// 角色编辑
export const requestPermissionEdit = params => {
  return request('/hbwl/rest/role/update', params)
}
// 角色查询查单
export const requestPermissionId = params => {
  return request(`/hbwl/rest/menu/findRoleId/${params.id}`, params, { method: 'get' })
}
// 企业列表
export const requestEntList = (params, currentPage, pageSize) => {
  return request(`/hbwl/rest/ent/findListByPage?page=${currentPage}&pageCount=${pageSize}`, params)
};
// 企业新增/修改
export const requestEntAdd = params => {
  if (!params.entId) {
    return request('/hbwl/rest/ent/add', params)
  } else {
    return request('/hbwl/rest/ent/update', params)
  }
}
// 企业删除
export const requestEntDel = params => {
  return request(`/hbwl/rest/ent/delete/${params.id}`, params, { method: 'get' })
}
// 子企业列表
export const requestChindEntList = params => {
  return request(`/hbwl/rest/ent/findList`, params)
}
// 操作记录
export const requestHandler = (params, currentPage, pageSize) => {
  return request(`/hbwl/rest/sysOperlog/findListByPage?page=${currentPage}&pageCount=${pageSize}`, params)
};

