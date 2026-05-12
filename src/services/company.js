import { request, METHOD } from '@/utils/request';
import { OEM_COMPANY_LIST, OEM_COMPANY_ADD, OEM_COMPANY_GET } from './api';

export function listCompany(param) {
  return request(OEM_COMPANY_LIST, METHOD.GET, param);
}

export function addCompany(param) {
  return request(OEM_COMPANY_ADD, METHOD.POST, param);
}

export function getCompany(param) {
  return request(OEM_COMPANY_GET, METHOD.GET, param);
}

export default {
  listCompany,
  addCompany,
  getCompany,
};
