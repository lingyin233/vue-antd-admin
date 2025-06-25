import { request, METHOD } from '@/utils/request';
import {OTHER_DEVICE_ADD,OTHER_DEVICE_LIST,OTHER_DEVICE_UPDATE_STATUS,OTHERUPDATE_DEL } from './api';
export function otherDeviceAdd(param) {
  return request(OTHER_DEVICE_ADD, METHOD.POST, param);
}
export function otherDeviceList(param) {
  return request(OTHER_DEVICE_LIST, METHOD.GET, param);
}
export function otherDeviceUpdateStatus(param) {
  return request(OTHER_DEVICE_UPDATE_STATUS, METHOD.GET, param);
}
export function delOtherUpdate(param) {
  return request(OTHERUPDATE_DEL, METHOD.GET, param);
}
export default {
  otherDeviceAdd,
  otherDeviceList,
  otherDeviceUpdateStatus,
  delOtherUpdate,
};
  