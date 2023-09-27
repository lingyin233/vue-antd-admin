import { request, METHOD } from '@/utils/request';
import * as util from '@/utils/util';
import { SERIAL_LIST, SERIAL_EXPORT, SERIAL_GENERATE, SERIAL_DEL, SERIAL_VALID } from './api';

export function listSerial(param) {
  return request(SERIAL_LIST, METHOD.GET, param);
}

export function exportSerialUrl(param) {
  return SERIAL_EXPORT + "?" + util.param(param);
}

export function generateSerial(param) {
  return request(SERIAL_GENERATE, METHOD.POST, param);
}

export function delSerial(param) {
  return request(SERIAL_DEL, METHOD.GET, param);
}

export function validSerial(param) {
  return request(SERIAL_VALID, METHOD.GET, param);
}

export default {
  listSerial,
  exportSerialUrl,
  generateSerial,
  delSerial,
};
