import { request, METHOD } from '@/utils/request';
import { QINIU_UPLOAD_TOKEN } from './api';

export function qiniuUploadToken(param) {
  return request(QINIU_UPLOAD_TOKEN, METHOD.GET, param);
}

export default {
  qiniuUploadToken,
};
