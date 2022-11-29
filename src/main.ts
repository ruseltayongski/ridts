import { createApp } from 'vue'
import { createPinia } from "pinia";

//import './style.css'
import App from './App.vue'
import router from './router/index'
import { useMainStore } from "@/stores/main";
import { useStyleStore } from "@/stores/style";
import { darkModeKey, styleKey } from "@/config";

import "./css/main.css";

import 'tw-elements';

import Notifications from 'notiwind'

/* Init Pinia */
const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(Notifications);
app.mount("#app");


/* Init Pinia stores */
const mainStore = useMainStore(pinia);
const styleStore = useStyleStore(pinia);

/* Fetch sample data */
mainStore.fetch("clients");
mainStore.fetch("history");

/* App style */
styleStore.setStyle(localStorage[styleKey] ?? "basic");

/* Dark mode */
if (
  (!localStorage[darkModeKey] &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ||
  localStorage[darkModeKey] === "1"
) {
  styleStore.setDarkMode(true);
}

/* Default title tag */
const defaultDocumentTitle = "RIDTS";

/* Set document title from route meta */
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle;
});
