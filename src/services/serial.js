import { request, METHOD } from '@/utils/request';
import { SERIAL_LIST, SERIAL_GENERATE, SERIAL_DEL } from './api';

export function listSerial(param) {
  return request(SERIAL_LIST, METHOD.GET, param);
}

export function generateSerial(param) {
  return request(SERIAL_GENERATE, METHOD.POST, param);
}

export function delSerial(param) {
  return request(SERIAL_DEL, METHOD.GET, param);
}

export default {
  listSerial,
  generateSerial,
  delSerial,
};
