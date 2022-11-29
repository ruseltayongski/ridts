<script setup lang="ts">
import { ref,computed } from "vue";

const props = defineProps({
  firstname: {
    type: String,
    dafault: "",
  },
  lastname: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: null,
  },
  api: {
    type: String,
    default: "avataaars",
  },
});

const temp_email = props.firstname+"@example.com"
const avatar = computed(
  () =>
    props.avatar ??
    `https://avatars.dicebear.com/api/${props.api}/${temp_email.replace(
      /[^a-z0-9]+/i,
      "-"
    )}.svg`
);

// const avatar = computed(
//   () =>
//     props.avatar ??
//     `https://avatars.dicebear.com/api/${props.api}/${props.username.replace(
//       /[^a-z0-9]+/i,
//       "-"
//     )}.svg`
// );
//const avatar = ref("https://avatars.dicebear.com/api/avataaars/Adrienne-Mayer III.svg");

const fullname = computed(() => props.firstname + " " + props.lastname );
</script>

<template>
  <div>
    <img
      :src="avatar"
      :alt="fullname"
      class="rounded-full block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800"
    />
    <slot />
  </div>
</template>
