import { request, METHOD } from '@/utils/request';
import { SKILLINFO_GROUP_LIST, SKILLINFO_GROUP_ADD, SKILLINFO_GROUP_DEL } from './api';
import { SKILLINFO_LIST, SKILLINF_UPDATE, SKILLINFO_DEL, SKILLINFO_UPDATE_GROUP } from './api';

export function listSkillinfoGroup(param) {
  return request(SKILLINFO_GROUP_LIST, METHOD.GET, param);
}

export function addSkillinfoGroup(param) {
  return request(SKILLINFO_GROUP_ADD, METHOD.POST, param);
}

export function delSkillinfoGroup(param) {
  return request(SKILLINFO_GROUP_DEL, METHOD.GET, param);
}

export function listSkillinfo(param) {
  return request(SKILLINFO_LIST, METHOD.GET, param);
}

export function addSkillinfo(param) {
  return request(SKILLINF_UPDATE, METHOD.POST, param);
}

export function delSkillinfo(param) {
  return request(SKILLINFO_DEL, METHOD.GET, param);
}

export function updateSkillGroup(param) {
  return request(SKILLINFO_UPDATE_GROUP, METHOD.GET, param);
}

export default {
  listSkillinfoGroup,
  addSkillinfoGroup,
  delSkillinfoGroup,
  listSkillinfo,
  addSkillinfo,
  delSkillinfo,
  updateSkillGroup,
};
