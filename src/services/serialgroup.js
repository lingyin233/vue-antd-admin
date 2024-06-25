import { request, METHOD } from '@/utils/request';
import * as util from '@/utils/util';
import { SERIAL_GROUP_LIST,  SERIAL_GROUP_DEL, SERIAL_GROUP_ADD } from './api';

export function listSerialGroup(param) {
  return request(SERIAL_GROUP_LIST, METHOD.GET, param);
}

export function delSerialGroup(param) {
  return request(SERIAL_GROUP_DEL, METHOD.GET, param);
}

export function addSerialGroup(param) {
  return request(SERIAL_GROUP_ADD, METHOD.POST, param);
}

export default {
  listSerialGroup,
  delSerialGroup,
  addSerialGroup,
};
