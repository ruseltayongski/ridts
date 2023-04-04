<script setup lang="ts">
  import { reactive, ref, computed, onMounted } from "vue";
  import { useMainStore } from "@/stores/main";
  import JsonExcel from "vue-json-excel3";
  import {
    mdiMonitorCellphone,
    mdiTableBorder,
    mdiTableOff,
    mdiGithub,
    mdiAccountCircle,
    mdiBabyFaceOutline,
    mdiAccountPlus,
    mdiBallotOutline,
    mdiAccount,
    mdiMail,
    mdiHomeCityOutline,
    mdiCardAccountPhoneOutline,
    mdiCalendarEditOutline,
    mdiCardBulletedSettings,
    mdiOpenInNew,
    mdiNeedle,
    mdiCalendarRemoveOutline,
    mdiMicrosoftExcel
  } from "@mdi/js";
  import SectionMain from "@/components/SectionMain.vue";
  import NotificationBar from "@/components/NotificationBar.vue";
  import TableMissed from "@/components/TableMissed.vue";
  import CardBox from "@/components/CardBox.vue";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
  import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
  import { getUserBarangay, getUserMunicipality } from '@/api/auth'
  import { getInfoClient } from "@/api/python"
  import BaseIcon from "@/components/BaseIcon.vue";
  import loadingModal from "@/assets/spin.gif"

  import moment from "moment"

  const get_barangay = ref([])
  const get_municipality = ref({})

  const mainStore = useMainStore();
  const transactionBarItems = computed(() => mainStore.history);
  const clientBarItems = computed(() => mainStore.clients.slice(0, 4));

  onMounted(() => {
    _getUserBarangay()
    _getUserMunicipality()
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

  const buttonSettingsModel = ref([]);
  const buttonsOutline = computed(
    () => buttonSettingsModel.value.indexOf("outline") > -1
  );

  const buttonsSmall = computed(
    () => buttonSettingsModel.value.indexOf("small") > -1
  );

  const buttonsDisabled = computed(
    () => buttonSettingsModel.value.indexOf("disabled") > -1
  );

  const buttonsRounded = computed(
    () => buttonSettingsModel.value.indexOf("rounded") > -1
  );

  const isModalActive = ref(false);


  const handleClientInfo = async (id:Number) => {
      _getInfoClient(id)
  };

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

  const _getInfoClient = async (id:Number) => {
    const response = await getInfoClient({ id : id })
    console.log(response)
    form.id = response.id
    form.bhw_address = response.bhw_address
    form.bhw_contact_number = response.bhw_contact_number
    form.bhw_name = response.bhw_name
    form.bhw_barangay = response.bhw_barangay
    form.birthdate = response.birthdate
    form.birthplace = response.birthplace
    form.client_address = response.client_address
    form.client_barangay = response.client_barangay
    form.created_by = response.created_by
    form.firstname = response.firstname
    form.guardian_address = response.guardian_address
    form.guardian_barangay = response.guardian_barangay
    form.guardian_alternate_number = response.guardian_alternate_number
    form.guardian_contact_number = response.guardian_contact_number
    form.guardian_name = response.guardian_name
    form.health_provider_address = response.health_provider_address
    form.health_provider_barangay = response.health_provider_barangay
    form.health_provider_contact = response.health_provider_contact
    form.health_provider_name = response.health_provider_name
    form.is_active = response.is_active
    form.lastname = response.lastname
    form.middlename = response.middlename
    form.sex = response.sex
    form.vaccine_id = response.vaccine_id
    form.remarks = response.remarks
    form.created_on = response.created_on
    form.updated_on = response.updated_on
  }

  const getAge = (dob:any) => {
    const check = moment(dob, 'YYYY/MM/DD');
    const a = moment([moment().format('YYYY'), moment().format('MM'), moment().format('DD')]);
    const b = moment([check.format('YYYY'), check.format('MM'), check.format('DD')]);
  
    const diffDuration = moment.duration(a.diff(b));

    const year = diffDuration.years()
    const month = diffDuration.months()
    const days = diffDuration.days()  
    
    return year+" Years, "+month+" month, "+days+" days"; 
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
      console.log(data)
      client_data.value = data
      isDisabled.value = false // re-enable the button
  }

  const handleClickExcel = () => {
    if(isDisabled.value)
      alert("Some data are still processing in excel, please wait for a while.")
  }

  const startDownloadExcel = () => {
    emit("loading-modal-open")
  }

  const finishDownloadExcel = () => {
    setTimeout(function(){
      emit("loading-modal-close")
    }, 1000);
  }

  const emit = defineEmits(["loading-modal-open","loading-modal-close"]);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiCalendarRemoveOutline" title="Missed" main>
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
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableMissed @client-data="handleClientData" @client-info="handleClientInfo" checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>

  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalLg" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg relative w-auto pointer-events-none">
      <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
        <div class="modal-body relative p-4">
          <SectionTitleLineWithButton
            :icon="mdiBallotOutline"
            title="Client Info"
            main
          >
          </SectionTitleLineWithButton>
          <CardBox is-form>
            <FormField label="Personal Information" class="text-xl">
              <FormField label="Vaccine Card Number ID" class="text-sm">
                {{ form.vaccine_id }}
              </FormField>
              <FormField label="Firstname" class="text-sm">
                {{ form.firstname }}
              </FormField>
            </FormField>
            
            <FormField >
              <FormField label="Middlename" class="text-sm">
                {{ form.middlename }}
              </FormField>
              <FormField label="Lastname" class="text-sm">
                {{ form.lastname }}
              </FormField>
            </FormField>

            <FormField >
              <FormField label="Birthdate" class="text-sm">
                {{ moment(form.birthdate).format('ll') }}
              </FormField>
              <FormField label="Age" class="text-sm">
                {{ getAge(form.birthdate) }}
              </FormField>
            </FormField>

            <FormField>
              <FormField label="Birthplace" class="text-sm">
                {{ form.birthplace }}
              </FormField>
              <FormField label="Sex" class="text-sm">
                {{ form.sex.charAt(0).toUpperCase() + form.sex.slice(1) }}
              </FormField>
            </FormField>

            <FormField label="Client Address" class="text-sm">
              {{ form.client_barangay }}
            </FormField>

            <BaseDivider />

            <FormField label="Name of Parents / Guardian" class="text-sm">
              {{ form.guardian_name }}
            </FormField>

            <FormField>
              <FormField label="Guardian Contact Number" class="text-sm">
                {{ form.guardian_contact_number }}
              </FormField>
              <FormField label="Guardian Alternate Number" class="text-sm">
                {{ form.guardian_alternate_number }}
              </FormField>
            </FormField>

            <FormField label="Parent/Guardian Address" class="text-sm">
              {{ form.guardian_barangay }}
            </FormField>

            <BaseDivider />

            <FormField label="Name of BHW" class="text-sm">
              {{ form.bhw_name }}
            </FormField>

            <FormField >
              <FormField label="BHW contact number" class="text-sm">
                {{ form.bhw_contact_number }}
              </FormField>
              <FormField label="BHW Address" class="text-sm">
                {{ form.bhw_barangay }}
              </FormField>
            </FormField>

            <BaseDivider />

            <FormField label="Name of Health Provider" class="text-sm">
              {{ form.health_provider_name }}
            </FormField>

            <FormField >
              <FormField label="Health Provider Contact Number" class="text-sm">
                {{ form.health_provider_contact }}
              </FormField>
              <FormField label="Health Provider Address" class="text-sm">
                {{ form.health_provider_barangay }}
              </FormField>
            </FormField>

            <BaseDivider />

            <FormField label="Remarks" class="text-sm">
              {{ form.remarks }}
            </FormField>

            <BaseDivider />

            <BaseButtons>
              <BaseButton type="button" color="warning" label="Print PDF" />
              <BaseButton type="button" color="info" outline label="Close" data-bs-dismiss="modal" aria-label="Close"/>
            </BaseButtons>
            
          </CardBox>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
  /* @import '@/css/main.css'; */
</style>
