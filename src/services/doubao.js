import { request, METHOD } from '@/utils/request';
import { DOUBAO_TTS } from './api';

export function tts(param) {
  return request(DOUBAO_TTS, METHOD.GET, param);
}
export default {
  tts,
};
