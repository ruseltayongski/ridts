<script setup lang="ts">
  import { ref, Ref } from "vue";
  import JsonExcel from "vue-json-excel3";
  import {
    mdiBabyFaceOutline,
    mdiAccountPlus,
    mdiMicrosoftExcel
  } from "@mdi/js";
  import SectionMain from "@/components/SectionMain.vue";
  import TableClients from "@/components/TableClients.vue";
  import CardBox from "@/components/CardBox.vue";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
  import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import ModalClientInfo from "@/components/ModalClientInfo.vue";

  import { getVaccineClientInfo } from "@/api/python"
  import BaseIcon from "@/components/BaseIcon.vue";
  import loadingModal from "@/assets/spin.gif"

  const emit = defineEmits(["loading-modal-open","loading-modal-close"]);

  const startDownloadExcel = () => {
    emit("loading-modal-open")
  }

  const finishDownloadExcel = () => {
    emit("loading-modal-close")
  }

  const json_fields = ref({
    "Vaccine ID": "vaccine_id",
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
    "Created On" : "created_on",
    "BCG": "bcg", //1st dose
    "BCG Date Scheduled": "bcg_date_scheduled",
    //"BCG Administerred Schedule": "bcg_administerred_schedule",
    "BCG Date Given": "bcg_date_given",
    //"BCG Administerred Given": "bcg_administerred_given",
    "HepB": "hepb", //1st dose
    "HepB Date Scheduled": "hepb_date_scheduled",
    //"HepB Administerred Schedule": "hepb_administerred_schedule",
    "HepB Date Given": "hepb_date_given",
    //"HepB Administerred Given": "hepb_administerred_given",
    "IPV": "ipv", //1st dose
    "IPV Date Scheduled": "ipv_date_scheduled",
    //"IPV Administerred Schedule": "ipv_administerred_schedule",
    "IPV Date Given": "ipv_date_given",
    //"IPV Administerred Given": "ipv_administerred_given",
    "MCV": "mcv", //2nd dose
    "MCV Date Scheduled1": "mcv_date_scheduled1",
    //"MCV Administerred Schedule1": "mcv_administerred_schedule1",
    "MCV Date Given1": "mcv_date_given1",
    //"MCV Administerred Given1": "mcv_administerred_given1",
    "MCV Date Scheduled2": "mcv_date_scheduled2",
    //"MCV Administerred Schedule2": "mcv_administerred_schedule2",
    "MCV Date Given2": "mcv_date_given2",
    //"MCV Administerred Given2": "mcv_administerred_given2",
    "Pentavalent": "pentavalent", //3rd dose
    "Pentavalent Date Scheduled1": "pentavalent_date_scheduled1",
    //"Pentavalent Administerred Schedule1": "pentavalent_administerred_schedule1",
    "Pentavalent Date Given1": "pentavalent_date_given1",
    //"Pentavalent Administerred Given1": "pentavalent_administerred_given1",
    "Pentavalent Date Scheduled2": "pentavalent_date_scheduled2",
    //"Pentavalent Administerred Schedule2": "pentavalent_administerred_schedule2",
    "Pentavalent Date Given2": "pentavalent_date_given2",
    //"Pentavalent Administerred Given2": "pentavalent_administerred_given2",
    "Pentavalent Date Scheduled3": "pentavalent_date_scheduled3",
    //"Pentavalent Administerred Schedule3": "pentavalent_administerred_schedule3",
    "Pentavalent Date Given3": "pentavalent_date_given3",
    //"Pentavalent Administerred Given3": "pentavalent_administerred_given3",
    "OPV": "opv", //3rd dose
    "OPV Date Scheduled1": "opv_date_scheduled1",
    //"OPV Administerred Schedule1": "opv_administerred_schedule1",
    "OPV Date Given1": "opv_date_given1",
    //"OPV Administerred Given1": "opv_administerred_given1",
    "OPV Date Scheduled2": "opv_date_scheduled2",
    //"OPV Administerred Schedule2": "opv_administerred_schedule2",
    "OPV Date Given2": "opv_date_given2",
    //"OPV Administerred Given2": "opv_administerred_given2",
    "OPV Date Scheduled3": "opv_date_scheduled3",
    //"OPV Administerred Schedule3": "opv_administerred_schedule3",
    "OPV Date Given3": "opv_date_given3",
    //"OPV Administerred Given3": "opv_administerred_given3",
    "PCV": "pcv", //3rd dose
    "PCV Date Scheduled1": "pcv_date_scheduled1",
    //"PCV Administerred Schedule1": "pcv_administerred_schedule1",
    "PCV Date Given1": "pcv_date_given1",
    //"PCV Administerred Given1": "pcv_administerred_given1",
    "PCV Date Scheduled2": "pcv_date_scheduled2",
    //"PCV Administerred Schedule2": "pcv_administerred_schedule2",
    "PCV Date Given2": "pcv_date_given2",
    //"PCV Administerred Given2": "pcv_administerred_given2",
    "PCV Date Scheduled3": "pcv_date_scheduled3",
    //"PCV Administerred Schedule3": "pcv_administerred_schedule3",
    "PCV Date Given3": "pcv_date_given3",
    //"PCV Administerred Given3": "pcv_administerred_given3",
  })

  const isDisabled = ref(true)
  const client_data = ref([])
  const handleClientData = async (data:any) => {
    client_data.value = data
    isDisabled.value = false // re-enable the button
  }

  const processExcelData = async () => {  
    if(isDisabled.value) {
      alert("Some data are still processing in excel, please wait for a while.");  
      return;
    }

    const response = await Promise.all(client_data.value.map(async (item:any) => {
      const bcg = await getVaccineClientInfo({ client_id: item.id, vaccine_type: "bcg" }) 
      const hepb = await getVaccineClientInfo({ client_id: item.id, vaccine_type: "hepb" }) 
      const ipv = await getVaccineClientInfo({ client_id: item.id, vaccine_type: "ipv" }) 
      const mcv = await getVaccineClientInfo({ client_id: item.id, vaccine_type: "mcv" }) 
      const pentavalent = await getVaccineClientInfo({ client_id: item.id, vaccine_type: "pentavalent" })
      const opv = await getVaccineClientInfo({ client_id: item.id, vaccine_type: "opv" }) 
      const pcv = await getVaccineClientInfo({ client_id: item.id, vaccine_type: "pcv" }) 
      if(bcg.length > 0) {
        const response = bcg[0]
        item['bcg'] = 'active'
        item['bcg_date_scheduled'] = response.scheduled_1
        //item['bcg_administerred_schedule'] = await administerredInfo(response.scheduled_administerred_1)
        item['bcg_date_given'] = response.given_1
        //item['bcg_administerred_given'] = await administerredInfo(response.given_administerred_1)
      } else {
        item['bcg'] = ''
        item['bcg_date_scheduled'] = ''
        item['bcg_administerred_schedule'] = ''
        item['bcg_date_given'] = ''
        item['bcg_administerred_given'] = ''
      }
      if(hepb.length > 0) {
        const response = hepb[0]
        item['hepb'] = 'active'
        item['hepb_date_scheduled'] = response.scheduled_1
        //item['hepb_administerred_schedule'] = await administerredInfo(response.scheduled_administerred_1)
        item['hepb_date_given'] = response.given_1
        //item['hepb_administerred_given'] = await administerredInfo(response.given_administerred_1)
      } else {
        item['hepb'] = ''
        item['hepb_date_scheduled'] = ''
        item['hepb_administerred_schedule'] = ''
        item['hepb_date_given'] = ''
        item['hepb_administerred_given'] = ''
      }
      if(ipv.length > 0) {
        const response = ipv[0]
        item['ipv'] = 'active'
        item['ipv_date_scheduled'] = response.scheduled_1
        //item['ipv_administerred_schedule'] = await administerredInfo(response.scheduled_administerred_1)
        item['ipv_date_given'] = response.given_1
        //item['ipv_administerred_given'] = await administerredInfo(response.given_administerred_1)
      } else {
        item['ipv'] = ''
        item['ipv_date_scheduled'] = ''
        item['ipv_administerred_schedule'] = ''
        item['ipv_date_given'] = ''
        item['ipv_administerred_given'] = ''
      }
      if(mcv.length > 0) {
        const response = mcv[0]
        item['mcv'] = 'active'
        item['mcv_date_scheduled1'] = response.scheduled_1
        //item['mcv_administerred_schedule1'] = await administerredInfo(response.scheduled_administerred_1)
        item['mcv_date_given1'] = response.given_1
        //item['mcv_administerred_given1'] = await administerredInfo(response.given_administerred_1)
        item['mcv_date_scheduled2'] = response.scheduled_2
        //item['mcv_administerred_schedule2'] = await administerredInfo(response.scheduled_administerred_2)
        item['mcv_date_given2'] = response.given_2
        //item['mcv_administerred_given2'] = await administerredInfo(response.given_administerred_2)
      } else {
        item['mcv'] = ''
        item['mcv_date_scheduled1'] = ''
        item['mcv_administerred_schedule1'] = ''
        item['mcv_date_given1'] = ''
        item['mcv_administerred_given1'] = ''
        item['mcv_date_scheduled2'] = ''
        item['mcv_administerred_schedule2'] = ''
        item['mcv_date_given2'] = ''
        item['mcv_administerred_given2'] = ''
      }
      if(pentavalent.length > 0) {
        const response = pentavalent[0]
        item['pentavalent'] = 'active'
        item['pentavalent_date_scheduled1'] = response.scheduled_1
        //item['pentavalent_administerred_schedule1'] = await administerredInfo(response.scheduled_administerred_1)
        item['pentavalent_date_given1'] = response.given_1
        //item['pentavalent_administerred_given1'] = await administerredInfo(response.given_administerred_1)
        item['pentavalent_date_scheduled2'] = response.scheduled_2
        //item['pentavalent_administerred_schedule2'] = await administerredInfo(response.scheduled_administerred_2)
        item['pentavalent_date_given2'] = response.given_2
        //item['pentavalent_administerred_given2'] = await administerredInfo(response.given_administerred_2)
        item['pentavalent_date_scheduled3'] = response.scheduled_3
        //item['pentavalent_administerred_schedule3'] = await administerredInfo(response.scheduled_administerred_3)
        item['pentavalent_date_given3'] = response.given_3
        //item['pentavalent_administerred_given3'] = await administerredInfo(response.given_administerred_3)
      } else {
        item['pentavalent'] = ''
        item['pentavalent_date_scheduled1'] = ''
        item['pentavalent_administerred_schedule1'] = ''
        item['pentavalent_date_given1'] = ''
        item['pentavalent_administerred_given1'] = ''
        item['pentavalent_date_scheduled2'] = ''
        item['pentavalent_administerred_schedule2'] = ''
        item['pentavalent_date_given2'] = ''
        item['pentavalent_administerred_given2'] = ''
        item['pentavalent_date_scheduled3'] = ''
        item['pentavalent_administerred_schedule3'] = ''
        item['pentavalent_date_given3'] = ''
        item['pentavalent_administerred_given3'] = ''
      }
      if(opv.length > 0) {
        const response = opv[0]
        item['opv'] = 'active'
        item['opv_date_scheduled1'] = response.scheduled_1
        //item['opv_administerred_schedule1'] = await administerredInfo(response.scheduled_administerred_1)
        item['opv_date_given1'] = response.given_1
        //item['opv_administerred_given1'] = await administerredInfo(response.given_administerred_1)
        item['opv_date_scheduled2'] = response.scheduled_2
        //item['opv_administerred_schedule2'] = await administerredInfo(response.scheduled_administerred_2)
        item['opv_date_given2'] = response.given_2
        //item['opv_administerred_given2'] = await administerredInfo(response.given_administerred_2)
        item['opv_date_scheduled3'] = response.scheduled_3
        //item['opv_administerred_schedule3'] = await administerredInfo(response.scheduled_administerred_3)
        item['opv_date_given3'] = response.given_3
        //item['opv_administerred_given3'] = await administerredInfo(response.given_administerred_3)
      } else {
        item['opv'] = ''
        item['opv_date_scheduled1'] = ''
        item['opv_administerred_schedule1'] = ''
        item['opv_date_given1'] = ''
        item['opv_administerred_given1'] = ''
        item['opv_date_scheduled2'] = ''
        item['opv_administerred_schedule2'] = ''
        item['opv_date_given2'] = ''
        item['opv_administerred_given2'] = ''
        item['opv_date_scheduled3'] = ''
        item['opv_administerred_schedule3'] = ''
        item['opv_date_given3'] = ''
        item['opv_administerred_given3'] = ''
      }
      if(pcv.length > 0) {
        const response = pcv[0]
        item['pcv'] = 'active'
        item['pcv_date_scheduled1'] = response.scheduled_1
        //item['pcv_administerred_schedule1'] = await administerredInfo(response.scheduled_administerred_1)
        item['pcv_date_given1'] = response.given_1
        //item['pcv_administerred_given1'] = await administerredInfo(response.given_administerred_1)
        item['pcv_date_scheduled2'] = response.scheduled_2
        //item['pcv_administerred_schedule2'] = await administerredInfo(response.scheduled_administerred_2)
        item['pcv_date_given2'] = response.given_2
        //item['pcv_administerred_given2'] = await administerredInfo(response.given_administerred_2)
        item['pcv_date_scheduled3'] = response.scheduled_3
        //item['pcv_administerred_schedule3'] = await administerredInfo(response.scheduled_administerred_3)
        item['pcv_date_given3'] = response.given_3
        //item['pcv_administerred_given3'] = await administerredInfo(response.given_administerred_3)
      } else {
        item['pcv'] = ''
        item['pcv_date_scheduled1'] = ''
        item['pcv_administerred_schedule1'] = ''
        item['pcv_date_given1'] = ''
        item['pcv_administerred_given1'] = ''
        item['pcv_date_scheduled2'] = ''
        item['pcv_administerred_schedule2'] = ''
        item['pcv_date_given2'] = ''
        item['pcv_administerred_given2'] = ''
        item['pcv_date_scheduled3'] = ''
        item['pcv_administerred_schedule3'] = ''
        item['pcv_date_given3'] = ''
        item['pcv_administerred_given3'] = ''
      }
      return {
        ...item
      }
    }))
    return response
  }

  const search_keyword = ref("")
  const handleSearchClient = async (payload:"") => {
      search_keyword.value = payload
  };

  const createClient = ref(false)
  const handleCreateClient = () => {
    createClient.value = createClient.value ? false : true
  }

  interface UpdateClient {
    flag: boolean;
    id: number;
  }
  const updateClient: Ref<UpdateClient> = ref({
    flag: false,
    id: 0
  });

  const handleClientInfo = (id: any) => {
    updateClient.value.id = id
    updateClient.value.flag = updateClient.value.flag ? false : true
  }

  const props_form = ref({})
  const handlePropsForm = (data: any) => {
    console.log(data)
    props_form.value = data
  }

  const handleOpenLoading = () => {
    emit("loading-modal-open")
  }

  const handleCloseLoading = () => {
    emit("loading-modal-close")
  }
</script>

<template>
  <LayoutAuthenticated @search-client="handleSearchClient">
    <SectionMain class="mt-8 lg:mt-0">
      <SectionTitleLineWithButton :icon="mdiBabyFaceOutline" title="Clients for new born baby" main>
        <div class="flex gap-4">
            <div class="md:block">
              <json-excel
                class="inline-flex justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border cursor-pointer rounded border-yellow-600 dark:border-yellow-500 ring-yellow-300 dark:ring-yellow-700 bg-yellow-600 dark:bg-yellow-500 text-white hover:bg-yellow-700 hover:border-yellow-700 hover:dark:bg-yellow-600 hover:dark:border-yellow-600 py-2 px-3"
                :fetch="processExcelData"
                :fields="json_fields"
                worksheet="Vaccinated"
                name="vaccinated.xls"
                v-if="isDisabled"
              >
                <BaseIcon :path="mdiMicrosoftExcel"/>
                <div class="flex flex-row">
                  <p class="text-sm">Processing</p>
                  <img :src="loadingModal" alt="loading_gif" class="ml-2 w-4 h-4">
                </div>
              </json-excel>
              <json-excel
                class="w-full md:w-40 inline-flex justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border cursor-pointer rounded border-yellow-600 dark:border-yellow-500 ring-yellow-300 dark:ring-yellow-700 bg-yellow-600 dark:bg-yellow-500 text-white hover:bg-yellow-700 hover:border-yellow-700 hover:dark:bg-yellow-600 hover:dark:border-yellow-600 py-2 px-3"
                :fetch="processExcelData"
                :fields="json_fields"
                :before-generate = "startDownloadExcel"
                :before-finish   = "finishDownloadExcel"
                worksheet="Clients"
                name="clients.xls"
                v-else
              >
              <!-- @click="processExcelData" -->
              <BaseIcon :path="mdiMicrosoftExcel"/> Download Excel
              </json-excel>
              <BaseButton class="w-full md:w-40" @click="handleCreateClient" type="button" color="info" label="Create" :icon="mdiAccountPlus"/>
            </div>
        </div>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableClients @client-info="handleClientInfo" @client-data="handleClientData" :search_keyword="search_keyword" :form="props_form" checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>

  <ModalClientInfo :createClient="createClient" :updateClientModal="updateClient" @props-form="handlePropsForm" @loading-modal-open="handleOpenLoading" @loading-modal-close="handleCloseLoading"></ModalClientInfo>
</template>

<style scoped>
  /* @import '@/css/main.css'; */
</style>
