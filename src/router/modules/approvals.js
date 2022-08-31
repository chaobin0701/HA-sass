// 员工的路由规则
import layout from '@/layout'
export default {
  path:"/approvals",
  // name:'approvals',//给模块的一级路由加一个name属性  这个属性我们会在做权限的时候用到
  component:layout,
  children:[
    // 二级路由的path什么都不用写的时候,此时它表示二级路由的默认路由
    {
      path:'', //这里不用写,什么都不用写表示 /employees 不但有布局 layout => 员工主页
      component:() => import('@/views/approvals'),
      meta:{
        title:'审批', //这里为什么要用title,左侧刁航读取了这里的title属性
        icon:'tree-table'
      }
    }
  ]
}