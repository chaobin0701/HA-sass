import Vue from "vue";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n
import CheckPermission from '@/mixin/checkPermission'
import "@/styles/index.scss"; // global css
import i18n from '@/lang'
import App from "./App";
import store from "./store";
import router from "./router";
import * as directives from "@/directives";
import * as filters from '@/filters' // 引入工具类
import "@/icons"; // icon
import "@/permission"; // 路由守卫 控制


import Component from '@/components'

// 判断当前的环境变量 是否使用mock数据
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Object.keys(directives).forEach(key => {
  Vue.directive(key,directives[key])
})

// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

Vue.mixin(CheckPermission)

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
Vue.use(Component) // 注册自己的插件
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false;

// 设置element为当前的语言
Vue.use(ElementUI, {
  // element本身支持i18n的处理
  // 此时 i18n就会根据当前的locale属性去寻找对应的显示内容
  i18n: (key, value) => {
    console.log(key)
    i18n.t(key)
  } // t方法 会去对应的语言包里寻找对应的内容
  // 改变locale的值 就可以改变对应的当前语言
})
new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: (h) => h(App),
});
