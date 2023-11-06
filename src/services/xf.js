import { request, METHOD } from '@/utils/request';
import { XF_TTS } from './api';

export function tts(param) {
  return request(XF_TTS, METHOD.GET, param);
}

export default {
  tts,
};
