import { request, METHOD } from '@/utils/request';
import { BAKER_TTS } from './api';

export function tts(param) {
  return request(BAKER_TTS, METHOD.GET, param);
}
export default {
  tts,
};
