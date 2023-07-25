//跨域代理前缀
const API_PROXY_PREFIX='/obexxadmin';
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX;
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
console.log('base_url=', BASE_URL);
module.exports = {
  LOGIN: `${BASE_URL}/login/password`,
  LOGOUT: `${BASE_URL}/index/logout`,
  ROUTES: `${BASE_URL}/routes`,
  USER_LIST: `${BASE_URL}/user/list`,
  USER_UPDATE_PASSWORD: `${BASE_URL}/index/updatePassword`,
  DEVICE_LIST: `${BASE_URL}/device/list`,
  DEVICE_UNBIND: `${BASE_URL}/device/unbind`,
  OEM_COMPANY_LIST: `${BASE_URL}/oem/company/list`,
  OEM_COMPANY_ADD: `${BASE_URL}/oem/company/addOrUpdate`,
  OEM_COMPANY_GET: `${BASE_URL}/oem/company/get`,
  APPVERSION_ADD: `${BASE_URL}/appversion/add`,
  APPVERSION_LIST: `${BASE_URL}/appversion/list`,
  APPEARANCE_LIST: `${BASE_URL}/appearance/list`,
  APPEARANCE_ADD: `${BASE_URL}/appearance/add`,
  APPEARANCE_DEL: `${BASE_URL}/appearance/del`,
  QINIU_UPLOAD_TOKEN: `${BASE_URL}/qiniu/uploadtoken`,
  FEEDBACK_LIST: `${BASE_URL}/feedback/list`,
  FEEDBACK_UPDATE: `${BASE_URL}/feedback/update`,
  FEEDBACK_LIST_ATTACHMENT: `${BASE_URL}/feedback/listAttachment`,
  SKILLINFO_GROUP_LIST: `${BASE_URL}/skillinfo/group/list`,
  SKILLINFO_GROUP_ADD: `${BASE_URL}/skillinfo/group/add`,
  SKILLINFO_GROUP_DEL: `${BASE_URL}/skillinfo/group/del`,
  SKILLINFO_LIST: `${BASE_URL}/skillinfo/list`,
  SKILLINF_UPDATE: `${BASE_URL}/skillinfo/update`,
  SKILLINFO_DEL: `${BASE_URL}/skillinfo/del`,
  SKILLINFO_UPDATE_GROUP: `${BASE_URL}/skillinfo/updateGroup`,
  SERIAL_LIST: `${BASE_URL}/serial/list`,
  SERIAL_GENERATE: `${BASE_URL}/serial/generate`,
  SERIAL_DEL: `${BASE_URL}/serial/del`,
};
