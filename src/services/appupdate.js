import { request, METHOD } from '@/utils/request';
import { APPUPDATE_LIST, APPUPDATE_ADD, APPUPDATE_DEL, APPUPDATE_PUSHSTATE } from './api';

export function listAppUpdate(param) {
  return request(APPUPDATE_LIST, METHOD.GET, param);
}

export function addAppUpdate(param) {
  return request(APPUPDATE_ADD, METHOD.POST, param);
}

export function delAppUpdate(param) {
  return request(APPUPDATE_DEL, METHOD.GET, param);
}

export function pushStateAppUpdate(param) {
  return request(APPUPDATE_PUSHSTATE, METHOD.GET, param);
}

export default {
  listAppUpdate,
  addAppUpdate,
  delAppUpdate,
  pushStateAppUpdate,
};
