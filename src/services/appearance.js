import { request, METHOD } from '@/utils/request';
import { APPEARANCE_LIST, APPEARANCE_ADD, APPEARANCE_DEL } from './api';

export function listAppearance(param) {
  return request(APPEARANCE_LIST, METHOD.GET, param);
}

export function addAppearance(param) {
  return request(APPEARANCE_ADD, METHOD.POST, param);
}

export function delAppearance(param) {
  return request(APPEARANCE_DEL, METHOD.GET, param);
}

export default {
  listAppearance,
  addAppearance,
  delAppearance,
};
