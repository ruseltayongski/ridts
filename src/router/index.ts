import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/views/HomeView.vue";
import Login from '@/views/LoginView.vue'
import Style from '@/views/StyleView.vue'
import Landing from '@/views/LandingPage.vue'
import Archived from '@/views/ArchivedView.vue'
import Referred from '@/views/ReferredView.vue'
import Accepted from '@/views/AcceptedView.vue'
import Incoming from '@/views/IncomingView.vue'
import TextBlast from '@/views/TextBlast.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
          meta: {
            title: "Landing Page",
          },
          path: "/",
          name: "Landing",
          component: Landing,
        },
        {
          meta: {
            title: "Login",
          },
          path: "/login",
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
            title: "Archived",
          },
          path: "/archived",
          name: "archived",
          component: Archived,
        },
        {
          meta: {
            title: "Referred",
          },
          path: "/referred",
          name: "referred",
          component: Referred,
        },
        {
          meta: {
            title: "Accepted",
          },
          path: "/accepted",
          name: "accepted",
          component: Accepted,
        },
        {
          meta: {
            title: "Incoming",
          },
          path: "/incoming",
          name: "incoming",
          component: Incoming,
        },
        {
          meta: {
            title: "Text Blast",
          },
          path: "/text_blast",
          name: "text_blast",
          component: TextBlast,
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
          path: "/clients",
          name: "clients",
          component: () => import("@/views/ClientView.vue"),
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