import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import Layout from "@/layout";

// 引入多个模块的规则
import approvalsRouter from "./modules/approvals";
import departmentsRouter from "./modules/departments";
import employeesRouter from "./modules/employees";
import permissionRouter from "./modules/permission";
import attendancesRouter from "./modules/attendances";
import salarysRouter from "./modules/salarys";
import settingRouter from "./modules/setting";
import socialRouter from "./modules/social";
import userRouter from './modules/user'
// 动态路由 | 导出变量是为了后期做权限管理
export const asyncRoutes = [
  approvalsRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  attendancesRouter,
  salarysRouter,
  settingRouter,
  socialRouter,
];


// 静态路由
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "主页", icon: "dashboard" },
      },
    ],
  },
  {
    path: "/import",
    component: Layout,
    hidden: true, // 隐藏在左侧菜单中
    children: [
      {
        path: "", // 二级路由path什么都不写 表示二级默认路由
        component: () => import("@/views/import"),
      },
    ],
  },userRouter //防止都可以访问的静态里也有
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: [...constantRoutes], //改成只有静态路由
  });

const router = createRouter();

// 重置路由
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
