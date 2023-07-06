//跨域代理前缀
const API_PROXY_PREFIX='/obexxadmin'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
console.log('base_url=', BASE_URL);
module.exports = {
  LOGIN: `${BASE_URL}/login/password`,
  LOGOUT: `${BASE_URL}/index/logout`,
  ROUTES: `${BASE_URL}/routes`
}
