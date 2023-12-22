import { request, METHOD } from '@/utils/request';
import { CAROUSEL_LIST, CAROUSEL_ADD, CAROUSEL_DEL } from './api';

export function listCarousel(param) {
  return request(CAROUSEL_LIST, METHOD.GET, param);
}

export function addCarousel(param) {
  return request(CAROUSEL_ADD, METHOD.POST, param);
}

export function delCarousel(param) {
  return request(CAROUSEL_DEL, METHOD.GET, param);
}

export default {
  listCarousel,
  addCarousel,
  delCarousel
};
