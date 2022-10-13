// 权限拦截在路由跳转 导航守卫

import router from "@/router";
import store from "@/store"; // 引入store实例 
const whiteList = ["/login", "/404"]; //定义白名单
import nprogress from "nprogress"; // 引入进度条
import "nprogress/nprogress.css"; //引入进度条样式
// 不需要导出 因为只需要让代码执行即可
// 前置守卫
router.beforeEach(async (to, form, next) => {
  nprogress.start(); //开启进度条
  if (store.getters.token) {
    // 有token TODO
    if (to.path === "/login") {
      next("/");
    } else {
      // 只有放过的时候采取过去用户资料
      // 如果当前vuex中有用户的资料的id 表示 已经有资料了 不需要获取了 如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id才表示当前用户资料没有获取过
        // async 函数所return的内容 用 await就可以接收到
        const { roles } = await store.dispatch("user/getUserInfo");
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成 同步
        // 筛选用户的可用路由
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
        const routes = await store.dispatch("permission/filterRoutes",roles.menus);
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes 必须 用next（地址） 不能用next（）
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加到路由表 // 添加动态路由到路由表  铺路
        // 添加完动态路由之后
        next(to.path); // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        /*
        进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，
        再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
        */
      } else {
        next();
      }
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
  nprogress.done(); // 手动关闭一次 为了解决 手动切换地址时 进度条不关闭的问题
});
// 后置守卫
router.afterEach(() => {
  nprogress.done(); //关闭进度条
});
