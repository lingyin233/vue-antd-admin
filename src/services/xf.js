import { request, METHOD } from '@/utils/request';
import { XF_TTS, XF_VCN_LIST } from './api';

export function tts(param) {
  return request(XF_TTS, METHOD.GET, param);
}

export function vcnList(param) {
  return request(XF_VCN_LIST, METHOD.GET, param);
}

export default {
  tts,
  vcnList,
};
