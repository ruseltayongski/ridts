<script setup lang="ts">
  import { reactive, ref, computed, onMounted, Ref, nextTick } from "vue";
  import { useMainStore } from "@/stores/main";
  import JsonExcel from "vue-json-excel3";
  import {
    mdiCalendarRemoveOutline,
    mdiMicrosoftExcel,
    mdiFileSearch
  } from "@mdi/js";
  import SectionMain from "@/components/SectionMain.vue";
  import TableMissed from "@/components/TableMissed.vue";
  import CardBox from "@/components/CardBox.vue";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
  import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
  import ModalClientInfo from "@/components/ModalClientInfo.vue";
  import BaseButton from "@/components/BaseButton.vue";

  import { getUserBarangay, getUserMunicipality } from '@/api/auth'
  import BaseIcon from "@/components/BaseIcon.vue";
  import loadingModal from "@/assets/spin.gif"

  import moment from "moment"

  import { Datepicker, Input, initTE } from "tw-elements";

  const get_barangay = ref([])
  const get_municipality = ref({})

  const mainStore = useMainStore();
  const pageSite = ref('missed')

  onMounted(() => {
    _getUserBarangay()
    _getUserMunicipality()
    initTE({ Datepicker, Input });
  })

  const _getUserBarangay = async () => {
    const response = await getUserBarangay()
    get_barangay.value = await Promise.all(response.map(async (item: any) => {
        return {
          id : item.id,
          label: item.description
        }
    }))
  }

  const _getUserMunicipality = async () => {
    const response = await getUserMunicipality()
    get_municipality.value = {
      id : response.id,
      label : response.description
    }
    form.vaccine_id = response.id+""+mainStore.userId + "-" + moment().format('YYYYMMDDHHmmss')+String(Math.random()).substring(0, 3).split('.').join("")
  }

  const customElementsForm = reactive({
    checkbox: ["lorem"],
    radio: "one",
    switch: ["one"],
    file: null,
  });

  const form = reactive({
    id: 0, 
    vaccine_id : "",
    firstname: "",
    middlename: "",
    lastname: "",
    birthdate: "",
    birthplace: "",
    sex: "",
    client_address: 0,
    client_barangay: "",
    guardian_name: "",
    guardian_contact_number: "",
    guardian_alternate_number: "",
    guardian_address: 0,
    guardian_barangay: "",
    bhw_name: "",
    bhw_contact_number: "",
    bhw_address: 0,
    bhw_barangay: "",
    health_provider_name: "",
    health_provider_contact: "",
    health_provider_address: 0,
    health_provider_barangay: "",
    remarks: "",
    is_active: true,
    created_by: 0,
    created_on: "",
    updated_on: ""
  });

  const handleClientInfo = (payload:Object) => {
    updateClient.value.vaccine_type = payload.vaccine_type
    updateClient.value.id = payload.id
    updateClient.value.flag = updateClient.value.flag ? false : true
  }

  const json_fields = ref({
    "Vaccine ID": "vaccine_id",
    "Vaccine Type": "vaccine_type",
    "Fullname": "fullname",
    "Birth Date": "birthdate",
    "Birth Place": "birthplace",
    "Sex" : "sex",
    "Guardian Name": "guardian_name",
    "Guardian Contact #": "guardian_contact_number",
    "Guardian Alternate Number": "guardian_alternate_number",
    "Guardian Address": "guardian_barangay",
    "BHW Name": "bhw_name",
    "BHW Contact #": "bhw_contact_number",
    "BHW Address": "bhw_barangay",
    "Health Provider Name": "health_provider_name",
    "Health Provider Contact #": "health_provider_contact",
    "Health Provider Address": "health_provider_barangay",
    "Municipality": "muncity_description",
    "Barangay": "client_barangay",
    "Created On" : "created_on"
  })

  const isDisabled = ref(true)
  const client_data = ref([])
  const handleClientData = async (data:any) => {
      client_data.value = data
      isDisabled.value = false // re-enable the button
  }

  const handleClickExcel = () => {
    if(isDisabled.value)
      alert("Some data are still processing in excel, please wait for a while.")
  }

  interface UpdateClient {
    flag: boolean;
    id: number;
    vaccine_type: String
  }
  const updateClient: Ref<UpdateClient> = ref({
    flag: false,
    id: 0,
    vaccine_type: ""
  });

  const props_form = ref({})
  const handlePropsForm = (data: any) => {
    console.log(data)
    props_form.value = data
  }

  const vaxMissedId = ref(0)
  const handleVaxMissed = (id:any) => {
    console.log(id)
    vaxMissedId.value = id
  }

  const emit = defineEmits(["loading-modal-open","loading-modal-close"]);
  const handleOpenLoading = () => {
    emit("loading-modal-open")
  }

  const handleCloseLoading = () => {
    emit("loading-modal-close")
  }

  const dateFrom = ref("")
  const dateTo = ref("")
  const dateFilter = ref({})
  const handleDateFilter = () => {
    if(!dateFrom.value) {
      alert("PLEASE SELECT DATE FROM!")
      return
    }
    if(!dateTo.value) {
      alert("PLEASE SELECT DATE TO!")
      return
    }
    if(dateFrom.value > dateTo.value) {
      alert("DATE FROM MUST LESS THAN TO DATE TO!")
      return
    }
    const date_from = moment(dateFrom.value,'DD/MM/YYYY').format("YYYY-MM-DD")
    const date_to = moment(dateTo.value,'DD/MM/YYYY').format("YYYY-MM-DD")
    dateFilter.value = {
      dateFrom: date_from,
      dateTo: date_to
    }
  }
  
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiCalendarRemoveOutline" title="Missed" main>
        <div class="flex gap-2">
          <div class="relative mb-3" data-te-datepicker-init data-te-input-wrapper-init>
            <input type="text" v-model="dateFrom" class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0" placeholder="Select a date" />
            <label for="floatingInput" class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">From</label
            >
          </div>
          <div class="relative mb-3" data-te-datepicker-init data-te-input-wrapper-init>
            <input type="text" v-model="dateTo" class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0" placeholder="Select a date" />
            <label for="floatingInput" class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">To</label
            >
          </div>
          <BaseButton class="w-full md:w-40" @click="handleDateFilter" type="button" color="info" label="Filter" :icon="mdiFileSearch"/>
          <json-excel
            class="inline-flex justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border cursor-pointer rounded border-yellow-600 dark:border-yellow-500 ring-yellow-300 dark:ring-yellow-700 bg-yellow-600 dark:bg-yellow-500 text-white hover:bg-yellow-700 hover:border-yellow-700 hover:dark:bg-yellow-600 hover:dark:border-yellow-600 py-2 px-3"
            :data="client_data"
            :fields="json_fields"
            worksheet="Missed"
            name="missed.xls"
            @click="handleClickExcel"
            v-if="isDisabled"
          >
            <BaseIcon :path="mdiMicrosoftExcel"/>
            <div class="flex flex-row">
              <p class="text-sm">Processing</p>
              <img :src="loadingModal" alt="loading_gif" class="ml-2 w-4 h-4">
            </div>
          </json-excel>
          <json-excel
            class="inline-flex justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border cursor-pointer rounded border-yellow-600 dark:border-yellow-500 ring-yellow-300 dark:ring-yellow-700 bg-yellow-600 dark:bg-yellow-500 text-white hover:bg-yellow-700 hover:border-yellow-700 hover:dark:bg-yellow-600 hover:dark:border-yellow-600 py-2 px-3"
            :data="client_data"
            :fields="json_fields"
            worksheet="Missed"
            name="missed.xls"
            @click="handleClickExcel"
            v-else
          >
            <BaseIcon :path="mdiMicrosoftExcel"/> Download Excel
          </json-excel>
        </div>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableMissed @client-data="handleClientData" @client-info="handleClientInfo" :vaxMissedId="vaxMissedId" :dateFilter="dateFilter" checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>

  <ModalClientInfo :updateClientModal="updateClient" :pageSite="pageSite" @vax-missed="handleVaxMissed" @props-form="handlePropsForm" @loading-modal-open="handleOpenLoading" @loading-modal-close="handleCloseLoading"></ModalClientInfo>
</template>

<style scoped>

</style>

