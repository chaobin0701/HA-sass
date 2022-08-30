// 权限拦截在路由跳转

import router from "@/router";
import store from "@/store";
const whiteList = ["/login", "/404"]; //定义白名单
import nprogress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; //引入进度条样式
// 不需要导出 因为只需要让代码执行即可
// 前置守卫
router.beforeEach(async (to, form, next) => {
  nprogress.start() //开启进度条
  if (store.getters.token) {
    // 有token TODO
    if (to.path === "/login") {
      next("/");
    } else {
      // 只有放过的时候采取过去用户资料
      // 如果当前vuex中有用户的资料的id 表示 已经有资料了 不需要获取了 如果没有id才需要获取
      if(!store.getters.userId){
        await store.dispatch('user/getUserInfo')
      }

      next();
    }
  } else {
    // 没有token TODO
    if (whiteList.indexOf(to.path) > -1) {
      // 在白名单 todo
      next();
    } else {
      // 不在白名单 todo
      next("/login");
    }
  }
  nprogress.done() // 手动关闭一次 为了解决 手动切换地址时 进度条不关闭的问题
});
// 后置守卫
router.afterEach(() => {
  nprogress.done() //关闭进度条

});
