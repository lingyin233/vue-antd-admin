import Cookie from 'js-cookie';
// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message, modal}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const { message, modal, router } = options;
    if (response.code === 401) {
      message.error('无此权限');
    }
    if (response.data.code === 401) {
      console.log('axios not login 1');
      modal.confirm({
        title: '提示',
        content: '登录已失效，可以打开新页面登录',
        okText: '确认',
        onOk() {
          const link = router.resolve({ name: 'login', params: {} });
          window.open(link.href, '_blank');
        },
      });
    } else if (response.data.code === 404 || response.data.code === 400) {
      message.error(`${response.data.code} : ${response.data.message}`);
    } else if (response.data.code !== 200) {
      message.error(`${response.data.code} : ${response.data.message}`);
    }
    return response;
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message, modal}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { message, modal, router } = options;
    const { response } = error;
    if (response && response.status === 401) {
      message.error('无此权限');
    }
    if (response && response.data && response.data.code === 401) {
      console.log('axios not login 2');
      modal.confirm({
        title: '提示',
        content: '登录已失效，可以打开新页面登录',
        okText: '确认',
        onOk() {
          const link = router.resolve({ name: 'login', params: {} });
          window.open(link.href, '_blank');
        },
      });
    }
    return Promise.reject(error);
  }
};

const resp403 = {
  onFulfilled(response, options) {
    const { message } = options;
    if (response && response.code === 403) {
      console.error('请求被拒绝1');
      message.error('请求被拒绝');
    }
    return response;
  },
  onRejected(error, options) {
    const { message } = options;
    const { response } = error;
    if (response && response.status === 403) {
      console.error('请求被拒绝2');
      message.error('请求被拒绝');
    }
    return Promise.reject(error);
  }
};

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const { message } = options;
    const { url, xsrfCookieName } = config;
    if (url && url.indexOf('login') === -1 && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
      message.warning('认证 token 已过期，请重新登录');
    }
    return config;
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const { message } = options;
    message.error(error.message);
    return Promise.reject(error);
  }
};

export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403] // 响应拦截
};
