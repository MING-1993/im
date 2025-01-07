import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from "@/views/home/HomeView.vue";
import LoginView from "@/views/login/LoginView.vue";

const router = createRouter({
  history: createWebHashHistory(), // 使用 Hash 模式，避免刷新时路径问题
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ]
});

router.beforeEach(async (to, from, next) => {
  if (window.electronAPI) {
    const isAuthenticated = await window.electronAPI.getLoginState();
    if (to.name !== 'login' && !isAuthenticated) next({name: 'login'});
    else next();
  }
});

export default router
