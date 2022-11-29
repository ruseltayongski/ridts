<script setup lang="ts">
  import { computed,ref } from "vue";
  import {
    mdiCashMinus,
    mdiCashPlus,
    mdiReceipt,
    mdiCreditCardOutline,
    mdiNeedle,
    mdiAccount,
    mdiCalendarEditOutline
  } from "@mdi/js";
  import CardBox from "@/components/CardBox.vue";
  import BaseLevel from "@/components/BaseLevel.vue";
  import PillTag from "@/components/PillTag.vue";
  import IconRounded from "@/components/IconRounded.vue";

  const props = defineProps({
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    business: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
  });

  const icon = computed(() => {
    if (props.type === "withdrawal") {
      return {
        icon: mdiNeedle,
        type: "danger",
      };
    } else if (props.type === "deposit") {
      return {
        icon: mdiNeedle,
        type: "success",
      };
    } else if (props.type === "invoice") {
      return {
        icon: mdiNeedle,
        type: "warning",
      };
    }

    return {
      icon: mdiNeedle,
      type: "info",
    };
  });

  const vaccinee_label = computed(() => {
    if (props.type === "withdrawal") {
      return "BCG"
    } else if (props.type === "deposit") {
      return "HEPB"
    } else if (props.type === "invoice") {
      return "PENTA";
    }
    return "OPV";
  });

  const isModalActive = ref(false);
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Vaccinee Info">
    <FormField label="1st Dose">
      <FormField label="Date Scheduled">
        <FormControl type="date" :icon="mdiCalendarEditOutline" placeholder="Date Scheduled"/>
      </FormField>
      <FormField label="Date Given">
        <FormControl type="date" :icon="mdiCalendarEditOutline" placeholder="Date Given"/>
      </FormField>
    </FormField>

    <FormField label="2nd Dose">
      <FormField label="Date Scheduled">
        <FormControl type="date" :icon="mdiCalendarEditOutline" placeholder="Date Scheduled"/>
      </FormField>
      <FormField label="Date Given">
        <FormControl type="date" :icon="mdiCalendarEditOutline" placeholder="Date Given"/>
      </FormField>
    </FormField>

    <FormField label="3rd Dose">
      <FormField label="Date Scheduled">
        <FormControl type="date" :icon="mdiCalendarEditOutline" placeholder="Date Scheduled"/>
      </FormField>
      <FormField label="Date Given">
        <FormControl type="date" :icon="mdiCalendarEditOutline" placeholder="Date Given"/>
      </FormField>
    </FormField>
  </CardBoxModal>

  <CardBox class="mb-6 last:mb-0 cursor-pointer" is-hoverable @click="isModalActive = true">
    <BaseLevel>
      <BaseLevel type="justify-start">
        <IconRounded :icon="icon.icon" :color="icon.type" class="md:mr-6" />
        <div class="text-center space-y-1 md:text-left md:mr-6">
          <p class="text-gray-500 dark:text-slate-400">
            Vaccinated by Rusel T. Tayong via 1st dose <b>{{ date }}</b>
          </p>
        </div>
      </BaseLevel>
      <div class="text-center md:text-right space-y-2">
        <div>
          <PillTag :color="icon.type" :label="vaccinee_label" small />
        </div>
      </div>
    </BaseLevel>
  </CardBox>

</template>
