import { request, METHOD } from '@/utils/request';
import { APPEARANCE_LIST, APPEARANCE_ADD, APPEARANCE_DEL } from './api';
import { APPEARANCE_GROUP_LIST, APPEARANCE_GROUP_ADD, APPEARANCE_GROUP_DEL, APPEARANCE_GROUP_UPDATE_I18N } from './api';

export function listAppearance(param) {
  return request(APPEARANCE_LIST, METHOD.GET, param);
}

export function addAppearance(param) {
  return request(APPEARANCE_ADD, METHOD.POST, param);
}

export function delAppearance(param) {
  return request(APPEARANCE_DEL, METHOD.GET, param);
}

export function listAppearanceGroup(param) {
  return request(APPEARANCE_GROUP_LIST, METHOD.GET, param);
}

export function addAppearanceGroup(param) {
  return request(APPEARANCE_GROUP_ADD, METHOD.POST, param);
}

export function delAppearanceGroup(param) {
  return request(APPEARANCE_GROUP_DEL, METHOD.GET, param);
}

export function updateI18nAppearanceGroup(param) {
  return request(APPEARANCE_GROUP_UPDATE_I18N, METHOD.POST, param);
}

export default {
  listAppearance,
  addAppearance,
  delAppearance,
  listAppearanceGroup,
  addAppearanceGroup,
  delAppearanceGroup,
  updateI18nAppearanceGroup,
};
