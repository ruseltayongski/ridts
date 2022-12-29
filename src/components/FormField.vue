<script setup lang="ts">
import { computed, useSlots, ref } from "vue";
import PillTag from "@/components/PillTag.vue";
import {mdiTrendingUp} from "@mdi/js";

defineProps({
  label: {
    type: String,
    default: null,
  },
  labelFor: {
    type: String,
    default: null,
  },
  help: {
    type: String,
    default: null,
  },
  isPillTag: Boolean,
});

const slots = useSlots();

const wrapperClass = computed(() => {
  const base = [];
  const slotsLength = slots.default().length;

  if (slotsLength > 1) {
    base.push("grid grid-cols-1 gap-3");
  }

  if (slotsLength === 2) {
    base.push("md:grid-cols-2");
  }

  return base;
});

const pillsSettingsModel = ref(["icon"]);

const pillsOutline = computed(
  () => pillsSettingsModel.value.indexOf("outline") > -1
);

const pillsSmall = computed(
  () => pillsSettingsModel.value.indexOf("small") > -1
);

</script>

<template>
  <div class="mb-6 last:mb-0">
    <div class="flex flex-row">
      <label v-if="label" :for="labelFor" class="block font-bold mb-2">{{
        label
      }}</label>
      <div class="px-2" v-if="isPillTag">
          <PillTag
          color="success"
          label="Vaccinated"
          :small="pillsSmall"
          :outline="pillsOutline"
        />
      </div>
    </div>
    <div :class="wrapperClass">
      <slot />
    </div>
    <div v-if="help" class="text-xs text-gray-500 dark:text-slate-400 mt-1">
      {{ help }}
    </div>
  </div>
</template>

