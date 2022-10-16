// 改文件负责所有的公共的组件的全局注册
import PageTools from "./PageTools";
import UploadExcel from './UploadExcel' // 注册导入excel组件
import Print from 'vue-print-nb'
import TagsView from './TagsView'
export default {
  install(Vue) {
    Vue.component("PageTools",PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('TagsView', TagsView)
    Vue.use(Print)
  }, 
};
