import { request, METHOD } from '@/utils/request';
import * as util from '@/utils/util';
import { DEVICE_CATEGORY_LIST ,DEVICE_CATEGORY_ADDORUPDATE } from './api';


export function listCategory(param) {
  return request(DEVICE_CATEGORY_LIST, METHOD.GET, param);
}
export function addOrUpdate(param) {
  return request(DEVICE_CATEGORY_ADDORUPDATE, METHOD.POST, param);
}
export function updateI18nDeviceCategory(param) {
  return request(DEVICE_CATEGORY_ADDORUPDATE, METHOD.POST, param);
}
export default {
  listCategory,
  addOrUpdate,
  updateI18nDeviceCategory,
};
