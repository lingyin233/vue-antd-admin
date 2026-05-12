import { request, METHOD } from '@/utils/request';
import { APPVERSION_LIST, APPVERSION_ADD } from './api';

export function listAppVersion(param) {
  return request(APPVERSION_LIST, METHOD.GET, param);
}

export function addAppVersion(param) {
  return request(APPVERSION_ADD, METHOD.POST, param);
}

export default {
  listAppVersion,
  addAppVersion,
};
