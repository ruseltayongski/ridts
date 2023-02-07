<script setup lang="ts">
  import { ref, computed } from "vue";
  import NotificationBar from "@/components/NotificationBar.vue";
  import {
    mdiContrastCircle,
    mdiInformation,
    mdiCheckCircle,
    mdiAlert,
    mdiAlertCircle,
    mdiOpenInNew,
    mdiClose,
    mdiReload,
    mdiTrendingUp,
  } from "@mdi/js";
  
  const notificationSettingsModel = ref([]);
  const notificationsOutline = computed(
    () => notificationSettingsModel.value.indexOf("outline") > -1
  );

  defineProps({
    title: {
      type: String,
      required: true,
    },
  });
</script>

<template>
  <div class="flex pl-5 pt-5 items-center justify-between mb-3 text-white">
    <h1 class="text-1xl">
      {{ title }}
    </h1>
    <slot />
  </div>
  <!-- <NotificationBar
    color="default"
    :outline="notificationsOutline"
  >
    <b>Success state</b>: NotificationBar
  </NotificationBar> -->
</template>
