<script setup lang="ts">
import { ref } from "vue";
  import loadingModal from "@/assets/spin.gif"

  const el_loading_modal = ref<HTMLInputElement | null>(null)
  const loading_modal = ref<HTMLInputElement | null>(null)
  const handleOpenLoading = () => {
    loading_modal.value = new Modal(el_loading_modal.value); //initialize modal instance
    loading_modal.value?.show()
  }

  const handleCloseModal = () => {
    loading_modal.value?.hide()
  }
</script>
<template>
  <router-view @loading-modal-open="handleOpenLoading" @loading-modal-close="handleCloseModal"></router-view>
  <NotificationGroup group="success">
    <div
      class="fixed inset-0 flex items-start justify-end p-6 px-4 py-6 pointer-events-none mt-20 z-40"
    >
      <div class="w-full max-w-sm">
        <Notification
          v-slot="{ notifications }"
          enter="transform ease-out duration-300 transition"
          enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
          enter-to="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
          move="transition duration-500"
          move-delay="delay-300"
        >
          <div
            class="flex w-full max-w-sm mx-auto mt-4 overflow-hidden bg-white rounded-lg shadow-md"
            v-for="notification in notifications"
            :key="notification.id"
          >
            <div class="flex items-center justify-center w-12 bg-green-500">
              <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
              </svg>
            </div>

            <div class="px-4 py-2 -mx-3">
              <div class="mx-3">
                <span class="font-semibold text-green-500">{{ notification.title }}</span>
                <p class="text-sm text-gray-600">{{ notification.text }}</p>
              </div>
            </div>
          </div>
        </Notification>
      </div>
    </div>
  </NotificationGroup>

  <NotificationGroup group="error">
    <div
      class="fixed inset-0 flex items-start justify-end p-6 px-4 py-6 pointer-events-none z-40"
    >
      <div class="w-full max-w-sm">
        <Notification
          v-slot="{ notifications }"
          enter="transform ease-out duration-300 transition"
          enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
          enter-to="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
          move="transition duration-500"
          move-delay="delay-300"
        >
          <div
            class="flex w-full max-w-sm mx-auto mt-4 overflow-hidden bg-white rounded-lg shadow-md"
            v-for="notification in notifications"
            :key="notification.id"
          >
          <div class="flex items-center justify-center w-12 bg-red-500">
            <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"/>
            </svg>
          </div>

          <div class="px-4 py-2 -mx-3">
            <div class="mx-3">
              <span class="font-semibold text-red-500">{{ notification.title }}</span>
              <p class="text-sm text-gray-600">{{ notification.text }}</p>
            </div>
          </div>
          </div>
        </Notification>
      </div>
    </div>
  </NotificationGroup>

  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" data-bs-backdrop="static" ref='el_loading_modal' aria-labelledby="exampleModalCenterTitle" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-dialog-centered relative w-auto pointer-events-none">
      <div class="modal-content border-none relative flex flex-col w-full pointer-events-auto bg-clip-padding rounded-md outline-none text-current">
        <div class="modal-body">
          <img :src="loadingModal" alt="" class="center">
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  @import "@/css/main.css";
</style>
