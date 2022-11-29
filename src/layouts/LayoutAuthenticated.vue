<script setup lang="ts">
  import { mdiForwardburger, mdiBackburger, mdiMenu } from "@mdi/js";
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useTokenStore } from "@/stores"
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


  // useMainStore().setUser({
  //   firstname: "",
  //   lastname: "",
  //   avatar:
  //     "https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93",
  // });

  onMounted(() => {
    if(!useMainStore().userFirstname) {
      _getUserProfile()
    }
  })

  const _getUserProfile = async () => {
      const response = await getUserProfile()
      useMainStore().setUser({
        id: response.id,
        firstname: response.fname,
        lastname: response.lname,
        avatar:
          "https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93",
      });
  }

  const layoutAsidePadding = "xl:pl-60";

  const styleStore = useStyleStore();

  const router = useRouter()
  const tokenStore = useTokenStore()

  const isAsideMobileExpanded = ref(false);
  const isAsideLgActive = ref(false);

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

      router.push({
          path: "/",
      });
    }
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
      :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
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
            placeholder="Search (ctrl+k)"
            ctrl-k-focus
            transparent
            borderless
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
  </div>
</template>
