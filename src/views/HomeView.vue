<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import { useTokenStore } from "@/stores"
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiMonitorCellphone,
  mdiReload,
  mdiGithub,
  mdiChartPie,
  mdiNeedle,
  mdiCalendarRemoveOutline,
  mdiTableArrowDown
} from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.ts";
import LineChart from "@/components/Charts/LineChart.vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import CardBox from "@/components/CardBox.vue";
import TableClients from "@/components/TableClients.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxTransaction from "@/components/CardBoxTransaction.vue";
import CardBoxClient from "@/components/CardBoxClient.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import SectionBannerStarOnGitHub from "@/components/SectionBannerStarOnGitHub.vue";

const tokenStore = useTokenStore()
console.log(tokenStore.value)

const chartData = ref(null);

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

onMounted(() => {
  fillChartData();
});


const mainStore = useMainStore();

const clientBarItems = computed(() => mainStore.clients.slice(0, 4));

const transactionBarItems = computed(() => mainStore.history);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Overview"
        main
      >
        <!-- <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        /> -->
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6">
        <CardBoxWidget
          trend="12%"
          trend-type="enrolled"
          color="text-blue-500"
          :icon="mdiAccountMultiple"
          :number="7770"
          label="Clients"
        />
        <CardBoxWidget
          trend="12%"
          trend-type="up"
          color="text-emerald-500"
          :icon="mdiNeedle"
          :number="512"
          prefix=""
          label="Vaccinated"
        />
        <CardBoxWidget
          trend="Overflow"
          trend-type="alert"
          color="text-yellow-500"
          :icon="mdiCalendarRemoveOutline"
          :number="256"
          suffix=""
          label="Date Due"
        />
        <CardBoxWidget
          trend="12%"
          trend-type="down"
          color="text-red-500"
          :icon="mdiTableArrowDown"
          :number="256"
          suffix=""
          label="Missed"
        />
      </div>

      <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="flex flex-col justify-between">
          <CardBoxTransaction
            v-for="(transaction, index) in transactionBarItems"
            :key="index"
            :amount="transaction.amount"
            :date="transaction.date"
            :business="transaction.business"
            :type="transaction.type"
            :name="transaction.name"
            :account="transaction.account"
          />
        </div>
        <div class="flex flex-col justify-between">
          <CardBoxClient
            v-for="client in clientBarItems"
            :key="client.id"
            :name="client.name"
            :login="client.login"
            :date="client.created"
            :progress="client.progress"
          />
        </div>
      </div> -->

      <!-- <SectionBannerStarOnGitHub class="mt-6 mb-6" /> -->

      <SectionTitleLineWithButton :icon="mdiChartPie" title="Trends overview last 9 days">
        <BaseButton
          :icon="mdiReload"
          color="whiteDark"
          @click="fillChartData"
        />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <div v-if="chartData">
          <line-chart :data="chartData" class="h-96" />
        </div>
      </CardBox>

      <!-- <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Clients" /> -->

      <!-- <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar> -->

      <!-- <CardBox has-table>
        <TableSampleClients />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
  @import '@/css/main.css';
</style>

