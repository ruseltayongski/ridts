<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import UserAvatar from "@/components/UserAvatar.vue";

const mainStore = useMainStore();
</script>

<template>
  <UserAvatar :firstname="mainStore.userFirstname" :lastname="mainStore.userLastname" :avatar="mainStore.userAvatart">
    <slot />
  </UserAvatar>
</template>
