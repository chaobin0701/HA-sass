import { getUserInfo } from "@/api/user";
export default {
  namespaced: true,
  state: {
    token: "123", 
    userInfo:{}, //这里定义一个空对象
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state,result){
      state.userInfo = result
    },
    // 删除用户信息
    removeUserInfo(state){
      state.userInfo = {}
    }
  },
  actions: {
    async getUserInfo(context) {
      const data = await getUserInfo(); // 获取返回值
      context.commit('setUserInfo',result) 
      return result // 这是是给我们后期做权限的时候 留下的伏笔
    },
  },
  mutations: {},
};
