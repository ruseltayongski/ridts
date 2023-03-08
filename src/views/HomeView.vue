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
    mdiTableArrowDown,
    mdiChartBar,
    mdiChartMultiple
  } from "@mdi/js";
  import * as chartConfig from "@/components/Charts/chart.config.ts";
  import LineChart from "@/components/Charts/LineChart.vue";
  import * as barChartConfig from "@/components/Charts/bar_chart.config.ts";
  import BarChart from "@/components/Charts/BarChart.vue";
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
  import { useRouter } from "vue-router"
  import { getUserBarangayAssignment } from '@/api/auth'
  import { useUseridStore } from "@/stores"
  import { clientCount, getVaccineInfo, clientVaccinated, clientDateDue, clientMissed } from "@/api/python"
  import loadingModal from "@/assets/spin.gif"

  const router = useRouter();

  const chartData = ref(null);
  const fillChartData = async () => {
    chartData.value = await chartConfig.lineChartDataProcess()
    console.log(chartData.value)
  };

  const tokenStore = useTokenStore()
  console.log(tokenStore.value)

  onMounted(() => {
    fillChartData();
    cardBoxCount()
  });

  const clients_count = ref(0)
  const vaccinated_count = ref(0)
  const date_due_count = ref(0)
  const missed_count = ref(0)
  const cardBoxCount = async () => {
    const barangay_assign = await getUserBarangayAssignment({ userid: useUseridStore().value })
    const barangay_assignment = await Promise.all(barangay_assign.map(async (item: any) => item.id))
    const client_api = await clientCount({ barangay_assignment : barangay_assignment })
    clients_count.value = client_api

    const vacinated_api = await clientVaccinated({ barangay_assignment:barangay_assignment,count:"true" })
    vaccinated_count.value = vacinated_api

    const date_due_api = await clientDateDue({ barangay_assignment:barangay_assignment,count:"true" })
    date_due_count.value = date_due_api

    const missed_api = await clientMissed({ barangay_assignment:barangay_assignment,count:"true" })
    missed_count.value = missed_api
  }

  const handleCarboxMenu = (redirect:String) => {
    router.push({
      path: "/"+redirect,
    });
  }
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Overview"
        main
      >
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6">
        <CardBoxWidget
          trend="#"
          trend-type="enrolled"
          color="text-blue-500"
          :icon="mdiAccountMultiple"
          :number="clients_count.count"
          :status="clients_count.status"
          label="Clients"
          class="cursor-pointer"
          @click="handleCarboxMenu('clients')"
        />
        <CardBoxWidget
          trend="#"
          trend-type="up"
          color="text-emerald-500"
          :icon="mdiNeedle"
          :number="vaccinated_count.count"
          :status="vaccinated_count.status"
          prefix=""
          label="Vaccinated"
          class="cursor-pointer"
          @click="handleCarboxMenu('vaccinated')"
        />
        <CardBoxWidget
          trend="#"
          trend-type="alert"
          color="text-yellow-500"
          :icon="mdiTableArrowDown"
          :number="date_due_count.count"
          :status="date_due_count.status"
          suffix=""
          label="Date Due"
          class="cursor-pointer"
          @click="handleCarboxMenu('date_due')"
        />
        <CardBoxWidget
          trend="#"
          trend-type="down"
          color="text-red-500"
          :icon="mdiCalendarRemoveOutline"
          :number="missed_count.count"
          :status="missed_count.status"
          suffix=""
          label="Missed"
          class="cursor-pointer"
          @click="handleCarboxMenu('missed')"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiChartBar" title="Clients per month">
        <!-- <BaseButton
          color="whiteDark"
          @click="fillBarChartData"
        /> -->
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <bar-chart class="h-96" />
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiChartMultiple" title="Trends overview last 9 days">
        <!-- <BaseButton
          :icon="mdiReload"
          color="whiteDark"
          @click="fillChartData"
        /> -->
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <div v-if="chartData">
          <line-chart :data="JSON.parse(JSON.stringify(chartData))" class="h-96" />
        </div>
        <div class="flex flex-row mt-2 p-10" v-else>
          <img :src="loadingModal" alt="loading_gif" class="w-10 h-10">
          <p class="text-xl ml-2">Processing...</p>
        </div>
      </CardBox>
      
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
  @import '@/css/main.css';
</style>

