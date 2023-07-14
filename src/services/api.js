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
};
