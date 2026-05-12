import { request, METHOD } from '@/utils/request';
import { VOICE_LIST, VOICE_UPDATE, VOICE_DEL, VOICE_UPDATE_I18N } from './api';

export function listVoice(param) {
  return request(VOICE_LIST, METHOD.GET, param);
}

export function updateVoice(param) {
  return request(VOICE_UPDATE, METHOD.POST, param);
}

export function delVoice(param) {
  return request(VOICE_DEL, METHOD.GET, param);
}

export function updateVoiceI18n(param) {
  return request(VOICE_UPDATE_I18N, METHOD.POST, param);
}

export default {
  listVoice,
  updateVoice,
  delVoice,
  updateVoiceI18n,
};
