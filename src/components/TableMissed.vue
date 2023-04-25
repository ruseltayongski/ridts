<script setup lang="ts">
  import { computed, ref, onMounted, watch } from "vue";
  import { useMuncityDescriptionStore } from "@/stores"
  import { mdiNeedle } from "@mdi/js";
  import CardBoxModal from "@/components/CardBoxModal.vue";
  import BaseLevel from "@/components/BaseLevel.vue";
  import BaseButtons from "@/components/BaseButtons.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import NotificationBar from "@/components/NotificationBar.vue";
  import { getUserBarangay,getUserBarangayAssignment } from '@/api/auth'
  import { useUseridStore } from "@/stores"
  import { clientMissed } from "@/api/python"
  import moment from "moment"
  import loadingModal from "@/assets/spin.gif"
  import {
    mdiAlert
  } from "@mdi/js";

  const props = defineProps({
    checkable: Boolean,
    vaxMissedId: {
      type: Number,
      default: 0
    },
    dateFilter: {
      type: Object,
      default: null
    }
  });


  const items = computed(() => data.value);

  const isModalDangerActive = ref(false);

  const perPage = ref(10);

  const currentPage = ref(0);

  const checkedRows = ref([]);

  const itemsPaginated = computed(() =>
    items.value.slice(
      perPage.value * currentPage.value,
      perPage.value * (currentPage.value + 1)
    )
  );

  const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

  const currentPageHuman = computed(() => currentPage.value + 1);

  const pagesList = computed(() => {
    const pagesList = [];

    for (let i = 0; i < numPages.value; i++) {
      pagesList.push(i);
    }

    return pagesList;
  });

  const get_barangay = ref([])

  onMounted(() => {
    _getUserBarangay()
    _getAllClientArchived()
  })

  const data = ref([])
  const dataHandler = ref([])
  const _getAllClientArchived = async (params: {} = {}) => {
    const barangay_assign = await getUserBarangayAssignment({ userid: useUseridStore().value })
    const barangay_assignment = await Promise.all(barangay_assign.map(async (item: any) => item.id))
    const response = await clientMissed({ barangay_assignment:barangay_assignment })
    let vaccine_type = ""
    data.value = await Promise.all(response.map(async (item: any) => {
        if(item.vaccine_type === 'bcg') {
            vaccine_type = "BCG"
        } else if(item.vaccine_type === 'hepb') {
            vaccine_type = "HepB"
        } else if(item.vaccine_type === 'pentavalent') {
            vaccine_type = "Pentavalent"
        } else if(item.vaccine_type === 'opv') {
            vaccine_type = "OPV"
        } else if(item.vaccine_type === 'ipv') {
            vaccine_type = 'IPV'
        } else if(item.vaccine_type === 'pcv') {
            vaccine_type = 'PCV'
        } else if(item.vaccine_type === 'mcv') {
            vaccine_type = 'MCV'
        }
        return {
            vaccine_type : vaccine_type,
            vax_id : item.id,
            overall_scheduled: item.overall_scheduled,
            sex: item.client[0].sex.charAt(0).toUpperCase() + item.client[0].sex.slice(1),
            fullname: item.client[0].firstname+" "+item.client[0].middlename+" "+item.client[0].lastname,
            ...item.client[0]
        }
    }))
    dataHandler.value = data.value
    console.log(data.value)
    emit("client-data",data.value)
  }

  const _getUserBarangay = async () => {
    const response = await getUserBarangay()
    get_barangay.value = await Promise.all(response.map(async (item: any) => {
        return {
          id : item.id,
          label: item.description
        }
    }))
  }

  const notificationSettingsModel = ref([]);
  const notificationsOutline = computed(
    () => notificationSettingsModel.value.indexOf("outline") > -1
  );

  const emit = defineEmits(["client-info","client-data"])
  const handleClientInfo = (id:Number,vaccine_type:String) => {
    emit("client-info", { id: id, vaccine_type: vaccine_type });
  };

  const vaxMissedIdComp = computed(() => props.vaxMissedId)
  watch(vaxMissedIdComp,(value) => {
    data.value = data.value.filter(item => item.vax_id !== value) 
    dataHandler.value = dataHandler.value.filter(item => item.vax_id !== value) 
  })

  const dateFilterComp = computed(() => props.dateFilter)
  watch(dateFilterComp,(value) => {
    data.value = dataHandler.value.filter(obj => {
      const date = obj.overall_scheduled+"00:00:00";
      return date >= value.dateFrom+"00:00:00" && date <= value.dateTo+"23:59:59";
    })
  })

  const loadFlag = ref(false)
  watch(itemsPaginated, (value) => {
    loadFlag.value = true
  })

  const uniqueValue = (index:any,unique:any) => {
    return index+""+unique+moment().format('YYYYMMDDHHmmss')+String(Math.random()).substring(0, 3).split('.').join("")
  }
</script>

<template>
  <CardBoxModal
    v-model="isModalDangerActive"
    title="Please confirm"
    button="danger"
    has-cancel
    has-confirm
  >
    <p>Are you sure you want to delete this client?</p>
  </CardBoxModal>

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
    {{ checkedRow.firstname+" "+checkedRow.middlename+" "+checkedRow.lastname }}
    </span>
  </div>

  <table v-if="loadFlag && itemsPaginated.length > 0">
    <thead>
      <tr>
        <th>Name</th>
        <th>Municipality</th>
        <th>Barangay</th>
        <th>Vaccine Type</th>
        <th>Created</th>
        <th>Scheduled</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(client,index) in itemsPaginated" :key="uniqueValue((index+1),client.id)">
        <td data-label="Name">
          {{ client.firstname+" "+client.middlename+" "+client.lastname }}
        </td>
        <td data-label="Municipality">
          {{ useMuncityDescriptionStore().value }}
        </td>
        <td data-label="Barangay">
          {{ client.client_barangay }}
        </td>
        <td>{{ client.vaccine_type }}</td>
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="client.created_on"
            >{{ moment(client.created_on).format('ll') }}</small> 
            <br>
          <small class="text-gray-400 dark:text-slate-400">{{ moment(client.created_on).format('h:mm:ss a') }}</small>
        </td>
        <td>
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="client.overall_scheduled"
            >{{ moment(client.overall_scheduled).format('ll') }}
          </small> 
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiNeedle"
              small
              @click="handleClientInfo(client.id,client.vaccine_type)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <NotificationBar v-else-if="loadFlag && itemsPaginated.length === 0"
    color="info"
    :icon="mdiAlert"
    :outline="notificationsOutline"
  >
    <b>Warning state</b>. No baby found!
  </NotificationBar>
  <div class="flex flex-row mt-2 p-10" v-else>
    <img :src="loadingModal" alt="loading_gif" class="w-10 h-10">
    <p class="text-xl ml-2">Processing...</p>
  </div>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/css/tailwind/_base.css";
  @import "@/css/tailwind/_utilities.css";
  @import "@/css/_table.css";
</style>