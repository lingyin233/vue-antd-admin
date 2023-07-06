import { LOGIN, LOGOUT, ROUTES, LIST_USER } from '@/services/api';
import { request, METHOD, removeAuthorization } from '@/utils/request';
import { USER_LIST } from './api';

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(username, password) {
  return request(LOGIN, METHOD.POST, {
    username: username,
    password: password
  });
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET);
}

/**
 * 退出登录
 */
export function logout() {
  return request(LOGOUT, METHOD.POST, {}).then((res) => {
    if (res.data.code == 200) {
      localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY);
      localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY);
      localStorage.removeItem(process.env.VUE_APP_ROLES_KEY);
      localStorage.removeItem(process.env.VUE_APP_USER_KEY);
      removeAuthorization();
    }
    return res;
  });
}

export function listUser(param) {
  return request(USER_LIST, METHOD.GET, param);
}

export default {
  login,
  logout,
  getRoutesConfig,
  listUser,
};
