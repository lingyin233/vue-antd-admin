import { request, METHOD } from '@/utils/request';
import { DEVICE_LIST, DEVICE_UNBIND } from './api';

export function listDevice(param) {
  return request(DEVICE_LIST, METHOD.GET, param);
}

export function unbindDevice(param) {
  return request(DEVICE_UNBIND, METHOD.POST, param);
}

export default {
  listDevice,
  unbindDevice
};
