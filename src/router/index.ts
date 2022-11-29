import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/views/HomeView.vue";
import Login from '@/views/LoginView.vue'
import Style from '@/views/StyleView.vue'
import Referral from '@/views/ReferralView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
          meta: {
            title: "Login",
          },
          path: "/",
          name: "Login",
          component: Login,
        },
        {
          meta: {
            title: "StyleView",
          },
          path: "/styles",
          name: "StyleView",
          component: Style,
        },
        {
          meta: {
            title: "BHS Referral",
          },
          path: "/referral",
          name: "referral",
          component: Referral,
        },
        {
          // Document title tag
          // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
          meta: {
            title: "Dashboard",
          },
          path: "/dashboard",
          name: "dashboard",
          component: Home,
        },
        {
          meta: {
            title: "Client",
          },
          path: "/tables",
          name: "tables",
          component: () => import("@/views/TablesView.vue"),
        },
        {
          meta: {
            title: "Forms",
          },
          path: "/forms",
          name: "forms",
          component: () => import("@/views/FormsView.vue"),
        },
        {
          meta: {
            title: "Profile",
          },
          path: "/profile",
          name: "profile",
          component: () => import("@/views/ProfileView.vue"),
        },
        {
          meta: {
            title: "Ui",
          },
          path: "/ui",
          name: "ui",
          component: () => import("@/views/UiView.vue"),
        },
        {
          meta: {
            title: "Responsive layout",
          },
          path: "/responsive",
          name: "responsive",
          component: () => import("@/views/ResponsiveView.vue"),
        },
        {
          meta: {
            title: "Login",
          },
          path: "/login",
          name: "login",
          component: () => import("@/views/LoginView.vue"),
        },
        {
          meta: {
            title: "Error",
          },
          path: "/error",
          name: "error",
          component: () => import("@/views/ErrorView.vue"),
        },
    ]
})

export default router