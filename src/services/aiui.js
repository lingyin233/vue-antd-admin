import { request, METHOD } from '@/utils/request';
import { AIUI_QA_LIST, AIUI_QA_ADD, AIUI_QA_DEL, AIUI_QA_UPDATE_STATUS } from './api';

export function qaList(param) {
  return request(AIUI_QA_LIST, METHOD.GET, param);
}

export function qaAdd(param) {
  return request(AIUI_QA_ADD, METHOD.POST, param);
}

export function qaDel(param) {
  return request(AIUI_QA_DEL, METHOD.GET, param);
}

export function qaUpdateStatus(param) {
  return request(AIUI_QA_UPDATE_STATUS, METHOD.GET, param);
}


export default {
  qaList,
  qaAdd,
  qaDel,
};
