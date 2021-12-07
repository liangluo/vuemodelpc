import { request } from '../utils/request';
// 场馆资源修改/新增
export const stadiumSave = params => {
  const body = { record: params };
  if (params.label) {
    body.labelIds = params.label;
  }
  if (!params.resourceid) {
    return request('/resourceSite/addSite', body);
  } else {
    return request('/resourceSite/updateSite', body);
  }
};

// 场馆资源查询
export const stadiumList = (params, currentPage, pageSize) => {
  return request('/resourceSite/findSite/' + currentPage + '/' + pageSize, params)
};

// 预约查询
export const subscribeList = (params, currentPage, pageSize) => {
  return request('/resourceBespeak/findBespeakList/' + currentPage + '/' + pageSize, params);
};

// 文件上传
export const addFile = (params) => {
  return request('/ftp/addFile', params);
};
// 调换两条数据位置顺序
export const stadiumReorder = (param1, param2) => {
  return request('/resourceSite/updateTwoSiteLocation', [param1, param2])
};

//批量审核

export const stadiumsSave = params => {
  return request('/resourceSite/updateSites', params);
};
