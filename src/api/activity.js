import { request } from '../utils/request'
// 活动修改/新增
export const activitySave = params => {
  const body = { record: params };
  if (params.label) {
    body.labelIds = params.label;
  }
  if (!params.resourceid) {
    return request('/activity/addActivity', body);
  } else {
    body.updatetime = '';
    return request('/activity/updateActivity', body);
  }
};
// 活动查询
export const activityList = (params, currentPage, pageSize) => {
  return request('/activity/findActivity/' + currentPage + '/' + pageSize, params)
};


// 批量审核
export const activitysSave = params => {
  return request('/activity/updateActivitys', params);
};
