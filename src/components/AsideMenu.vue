<script setup lang="ts">
  import { ref, onMounted } from "vue";
  import AsideMenuLayer from "@/components/AsideMenuLayer.vue";
  import OverlayLayer from "@/components/OverlayLayer.vue";
  import { useUseridStore } from "@/stores"

  const props = defineProps({
    menu: {
      type: Array,
      required: true,
    },
    isAsideMobileExpanded: Boolean,
    isAsideLgActive: Boolean,
  });

  const menu_display = ref([])
  onMounted(() => {
    menu_display.value = props.menu.map((item: any) => {
      if(useUseridStore().value === 4413) {
        return {
          ...item
        }
      }
      else if(useUseridStore().value !== 4413 && !['/text_blast'].includes(item.to)) {
        return {
          ...item
        }
      }
    })
    menu_display.value = menu_display.value.filter((item: any) => { return typeof item === 'object' } )
  })            

  const emit = defineEmits(["menu-click", "aside-lg-close-click"]);

  const menuClick = (event, item) => {
    emit("menu-click", event, item);
  };

  const asideLgCloseClick = (event) => {
    emit("aside-lg-close-click", event);
  };
</script>

<template>
  <AsideMenuLayer
    :menu="menu_display"
    :class="[
      isAsideMobileExpanded ? 'left-0' : '-left-60 lg:left-0',
      { 'lg:hidden xl:flex': !isAsideLgActive },
    ]"
    @menu-click="menuClick"
    @aside-lg-close-click="asideLgCloseClick"
  />
  <OverlayLayer
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="asideLgCloseClick"
  />
</template>
