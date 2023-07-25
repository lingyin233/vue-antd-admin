import { request, METHOD } from '@/utils/request';
import { FEEDBACK_LIST, FEEDBACK_UPDATE, FEEDBACK_LIST_ATTACHMENT } from './api';

export function listFeedback(param) {
  return request(FEEDBACK_LIST, METHOD.GET, param);
}

export function updateFeedback(param) {
  return request(FEEDBACK_UPDATE, METHOD.POST, param);
}

export function listFeedbackAttachment(param) {
  return request(FEEDBACK_LIST_ATTACHMENT, METHOD.GET, param);
}

export default {
  listFeedback,
  updateFeedback,
  listFeedbackAttachment,
};
