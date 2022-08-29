import axios from "axios";
import { Message } from "element-ui";
import store from '@/store'
const service = axios.create({
  // 当执行 npm run dev => .env.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});
service.interceptors.request.use(config => {
  // config是请求的配置信息
  if(store.getters.token){
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
},error => {
  return Promise.reject(error)
});

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // axios 默认加了一层data
    const { success, messgae, data } = response.data;
    // 要根据success的成功与否决定下面的操作
    if (success) {
      return data;
    } else {
      // 业务已经错误了,应该进catch
      Message.error(message); //提示错误信息
      return Promise.reject(new Error(messgae));
    }
  },
  (error) => {
    Message.error(error.message); //提示错误信息
    return Promise.reject(error); //返回执行错误 让当前的执行跳出成功 直接进入catch
  }
);
export default service;
