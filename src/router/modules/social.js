// 员工的路由规则
import layout from '@/layout'
export default {
  path:"/social_securitys",
  component:layout,
  children:[
    // 二级路由的path什么都不用写的时候,此时它表示二级路由的默认路由
    {
      path:'', //这里不用写,什么都不用写表示 /employees 不但有布局 layout => 员工主页
      component:() => import('@/views/social'),
      meta:{
        title:'社保', //这里为什么要用title,左侧刁航读取了这里的title属性
        icon:'table'
      }
    }
  ]
}