<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import numeral from "numeral";
import loadingModal from "@/assets/spin.gif"

const props = defineProps({
  prefix: {
    type: String,
    default: null,
  },
  suffix: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: "",
  },
  value: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 500,
  },
});

const newValue = ref(0);

const newValueFormatted = computed(() =>
  newValue.value < 1000 ? newValue.value : numeral(newValue.value).format("0,0")
);

const value = computed(() => props.value);

const grow = (m) => {
  const v = Math.ceil(newValue.value + m);

  if (v > value.value) {
    newValue.value = value.value;
    return false;
  }

  newValue.value = v;

  setTimeout(() => {
    grow(m);
  }, 25);
};

const growInit = () => {
  newValue.value = 0;
  grow(props.value / (props.duration / 25));
};

watch(value, () => {
  growInit();
});

onMounted(() => {
  growInit();
});

</script>

<template>
  <div v-if="status == 'success'">{{ prefix }}{{ newValueFormatted }}{{ suffix }}</div>
  <div class="flex flex-row mt-2" v-else>
    <img :src="loadingModal" alt="loading_gif" class="w-5 h-5">
    <p class="text-xs ml-2">Processing...</p>
  </div>
</template>

