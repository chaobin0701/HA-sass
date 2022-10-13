import { getUserInfo, login, getUserDetailById } from "@/api/user";
import { getToken, setToken, removeToken, setTimeStamp } from "@/utils/auth";
import { resetRouter } from "@/router/index";
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}, //这里定义一个空对象
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, result) {
      state.userInfo = result;
    },
    // 删除用户信息
    removeUserInfo(state) {
      state.userInfo = {};
    },
    setToken(state, token) {
      state.token = token; // 将数据设置给vuex
      setToken(token); // 同步给缓存
    },
    removeToken(state) {
      state.token = null; // 将vuex的数据清空
      removeToken(); // 同步到缓存
    },
  },
  actions: {
    async getUserInfo(context) {
      const result = await getUserInfo();
      const baseInfo = await getUserDetailById(result.userId);
      context.commit("setUserInfo", { ...result, ...baseInfo });
      return result; // 这是是给我们后期做权限的时候 留下的伏笔
    },
    async login(context, data) {
      // 调用api接口
      const result = await login(data);
      context.commit("setToken", result);
      setTimeStamp(); //设置时间戳
    },
    // 登出
    async logout(context) {
      // 删除token
      context.commit("removeToken"); // 不仅仅删除了vuex中的 还删除了缓存中的
      // 删除用户资料
      context.commit("removeUserInfo"); // 删除用户信息
      // 重置路由
      resetRouter();
      // 还有一步  vuex中的数据是不是还在
      // 要清空permission模块下的state数据
      // vuex中 user子模块  permission子模块
      // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
      // 父模块 调用 子模块的action
      context.commit("permission/setRoutes", [], { root: true });
      // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
    },
  },
};
