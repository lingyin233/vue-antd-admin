import { request, METHOD } from '@/utils/request';
import * as util from '@/utils/util';
import { FAQ_DEL, FAQ_LIST, FAQ_ADDORUPDATE, UPDATE_I18N_FAQ  } from './api';

export function delFaq(param) {
  return request(FAQ_DEL, METHOD.GET, param);
}
export function listFaq(param) {
  return request(FAQ_LIST, METHOD.GET, param);
}
export function faqAddOrUpdate(param) {
  return request(FAQ_ADDORUPDATE, METHOD.POST, param);
}
export function updateI18nFAQ(param) {
  return request(UPDATE_I18N_FAQ, METHOD.POST, param);
}
export default {
  listFaq,
  delFaq, 
  faqAddOrUpdate,
  updateI18nFAQ,  
};
