import { request, METHOD } from '@/utils/request';
import { QINIU_UPLOAD_TOKEN, QINIU_UPLOAD_MD5 } from './api';

export function qiniuUploadToken(param) {
  return request(QINIU_UPLOAD_TOKEN, METHOD.GET, param);
}

export function qiniuUploadMd5(param) {
  return request(QINIU_UPLOAD_MD5, METHOD.GET, param);
}

export default {
  qiniuUploadToken,
  qiniuUploadMd5,
};
