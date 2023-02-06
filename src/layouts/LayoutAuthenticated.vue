<script setup lang="ts">
  import { mdiForwardburger, mdiBackburger, mdiMenu } from "@mdi/js";
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useTokenStore,useUseridStore } from "@/stores"
  import { getUserProfile } from "@/api/auth"
  import menuAside from "@/menuAside.ts";
  import menuNavBar from "@/menuNavBar.ts";
  import { useMainStore } from "@/stores/main.ts";
  import { useStyleStore } from "@/stores/style.ts";
  import BaseIcon from "@/components/BaseIcon.vue";
  import FormControl from "@/components/FormControl.vue";
  import NavBar from "@/components/NavBar.vue";
  import NavBarItemPlain from "@/components/NavBarItemPlain.vue";
  import AsideMenu from "@/components/AsideMenu.vue";
  import FooterBar from "@/components/FooterBar.vue";

  import { S } from "@/utils"

  const props = defineProps({
    hasLandingPage: Boolean,
  });

  // useMainStore().setUser({
  //   firstname: "",
  //   lastname: "",
  //   avatar:
  //     "https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93",
  // });

  onMounted(() => {
    if(!useMainStore().userFirstname && !props.hasLandingPage) {
      _getUserProfile()
    }
  })

  const _getUserProfile = async () => {
    const response = await getUserProfile()
    useMainStore().setUser({
      id: response.id,
      firstname: response.fname,
      middlename: response.mname,
      lastname: response.lname,
      avatar:
        "https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93",
    });
  }

  const layoutAsidePadding = "xl:pl-60";

  const styleStore = useStyleStore();

  const router = useRouter()
  const router_path = ref(router.currentRoute.value.path)
  const tokenStore = useTokenStore()
  const useridStore = useUseridStore()

  const isAsideMobileExpanded = ref(false);
  const isAsideLgActive = ref(false);

  const search_keyword = ref("")

  router.beforeEach(() => {
    isAsideMobileExpanded.value = false;
    isAsideLgActive.value = false;
  });

  const menuClick = (event, item) => {
    if (item.isToggleLightDark) {
      styleStore.setDarkMode();
    }

    if (item.isLogout) {
      // S.delete('authToken')
      S.deleteAll(true);
      tokenStore.dispatch("");
      useridStore.dispatch("");
      useMainStore().setUser({
        firstname: "",
        lastname: "",
        avatar: "",
      });

      router.push({
          path: "/",
      });
    }
  };

  const emit = defineEmits(["search-client"])
  const handleSearchClient = () => {
    emit("search-client", search_keyword.value);
  };
</script>

<template>
  <div
    :class="{
      dark: styleStore.darkMode,
      'overflow-hidden lg:overflow-visible': isAsideMobileExpanded,
    }"
  >
    <div
      v-if="!hasLandingPage"
      :class="[ layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
      class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
    >
      <NavBar
        :menu="menuNavBar"
        :class="[
          layoutAsidePadding,
          { 'ml-60 lg:ml-0': isAsideMobileExpanded },
        ]"
        @menu-click="menuClick"
      >
        <NavBarItemPlain
          display="flex lg:hidden"
          @click.prevent="isAsideMobileExpanded = !isAsideMobileExpanded"
        >
          <BaseIcon
            :path="isAsideMobileExpanded ? mdiBackburger : mdiForwardburger"
            size="24"
          />
        </NavBarItemPlain>
        <NavBarItemPlain
          display="hidden lg:flex xl:hidden"
          @click.prevent="isAsideLgActive = true"
        >
          <BaseIcon :path="mdiMenu" size="24" />
        </NavBarItemPlain>
        <NavBarItemPlain use-margin>
          <FormControl
            v-if="router_path == '/clients'"
            placeholder="Search (ctrl+k)"
            ctrl-k-focus
            transparent
            borderless
            class="border-2 border-indigo-500/100 lg:w-96"
            v-model="search_keyword"
            @keyup="handleSearchClient"
          />
        </NavBarItemPlain>
      </NavBar>
      <AsideMenu
        :is-aside-mobile-expanded="isAsideMobileExpanded"
        :is-aside-lg-active="isAsideLgActive"
        :menu="menuAside"
        @menu-click="menuClick"
        @aside-lg-close-click="isAsideLgActive = false"
      />
      <slot />
      <FooterBar>
        <!-- Get more with
        <a
          href="https://tailwind-vue.justboil.me/"
          target="_blank"
          class="text-blue-600"
          >Premium version</a
        > -->
      </FooterBar>
    </div>
    <slot v-else />
  </div>
</template>

<style scoped>
  @import '@/css/main.css';
</style>
