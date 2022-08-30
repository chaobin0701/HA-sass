import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getTimeStamp } from "@/utils/auth";
import router from "@/router";
const TimeOut = 3600; // 定义超时时间
// http://ihrm-java.itheima.net/api
const service = axios.create({
  // 当执行 npm run dev => .env.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // config是请求的配置信息
    if (store.getters.token) {
      // 只有在有token的情况下 才有必要去检查时间戳是否超时
      if (IsCheckTimeOut()) {
        //token过期
        // 1.登出
        store.dispatch("user/logout"); 
        // 2.跳转到登录页
        router.push("/login");
        // 3.提示信息
        return Promise.reject(new Error("token超时了"));
      }
      config.headers["Authorization"] = `Bearer ${store.getters.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    if(error.response && error.response.data && error.response.data.code === 10002){
      // 当 code 等于 10002的时候，表示token过时了
      store.dispatch('user/logout') 
      router.push('/login')
    } else {
      Message.error(error.message); //提示错误信息
    }
    return Promise.reject(error); //返回执行错误 让当前的执行跳出成功 直接进入catch
  }
);

// 检查是否超时
// 超时逻辑 当前时间 - 缓存时间 是否大于时间差
function IsCheckTimeOut() {
  var currentTime = Date.now();
  var timeStamp = getTimeStamp();
  return (currentTime - timeStamp) / 1000 > TimeOut;
}

export default service;
