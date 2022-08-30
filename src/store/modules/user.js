import { getUserInfo, login,getUserDetailById} from "@/api/user";
import { getToken, setToken, removeToken, setTimeStamp} from "@/utils/auth";
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
      const baseInfo = await getUserDetailById(result.userId)
      context.commit("setUserInfo", {...result,...baseInfo});
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
      context.commit("removeUserInfo");
      context.commit("removeToken");
    },
  }
};
