<script setup lang="ts">
  import { reactive, ref, computed, onMounted } from "vue";
  import { useMainStore } from "@/stores/main";
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
    mdiAmbulance
  } from "@mdi/js";
  import SectionMain from "@/components/SectionMain.vue";
  import NotificationBar from "@/components/NotificationBar.vue";
  import TableSampleReferral from "@/components/TableSampleReferral.vue";
  import CardBox from "@/components/CardBox.vue";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
  import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
  import BaseIcon from "@/components/BaseIcon.vue";
  import { getUserBarangay,getUserBarangayAssignment } from '@/api/auth'
  import { getIncoming } from "@/api/python"
  import { useUseridStore } from "@/stores"
  import moment from "moment"

  const mainStore = useMainStore();

  onMounted(() => {
    _getIncoming()
  })

  const incomings = ref([])
  const _getIncoming = async () => {
    const response = await getUserBarangayAssignment({ userid: useUseridStore().value })
    const barangay_assignment = await Promise.all(response.map(async (item: any) => item.id))
    incomings.value = await getIncoming({ referred_to : barangay_assignment })
    console.log(incomings.value)
  }

  const incomingContent = (incoming:{}) => {
    return incoming.Client[0].firstname+" "+incoming.Client[0].lastname+" [ "+incoming.Client[0].sex.charAt(0).toUpperCase() + incoming.Client[0].sex.slice(1)+", "+getAge(incoming.Client[0].birthdate)+" ] was referred to "+incoming.referred_to_address+" by "+incoming.referring_name+" of "+incoming.referred_from_address
  }

  const getAge = (dateString:String) => {
    const ageInMilliseconds = new Date() - new Date(dateString);
    return Math.floor(ageInMilliseconds/1000/60/60/24/365); // convert to years
  }

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
    is_active: true,
    created_by: 0,
    created_on: "",
    updated_on: ""
  });
  
  const getInfoClient = async (client:{}) => {
    console.log(client)
    form.id = client.id
    form.bhw_address = client.bhw_address
    form.bhw_contact_number = client.bhw_contact_number
    form.bhw_name = client.bhw_name
    form.birthdate = client.birthdate
    form.birthplace = client.birthplace
    form.client_address = client.client_address
    form.client_barangay = client.client_barangay
    form.created_by = client.created_by
    form.firstname = client.firstname
    form.guardian_address = client.guardian_address
    form.guardian_barangay = client.guardian_barangay
    form.guardian_alternate_number = client.guardian_alternate_number
    form.guardian_contact_number = client.guardian_contact_number
    form.guardian_name = client.guardian_name
    form.health_provider_address = client.health_provider_address
    form.health_provider_barangay = client.health_provider_barangay
    form.health_provider_contact = client.health_provider_contact
    form.health_provider_name = client.health_provider_name
    form.is_active = client.is_active
    form.lastname = client.lastname
    form.middlename = client.middlename
    form.sex = client.sex
    form.vaccine_id = client.vaccine_id
    form.created_on = client.created_on
    form.updated_on = client.updated_on
  }

  defineEmits(["loading-modal-open","loading-modal-close"]);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAmbulance" title="Incoming" main>
        
      </SectionTitleLineWithButton>
      <CardBox class="mb-6">
        <ol class="border-l-2 border-blue-600">
          <li v-for="incoming in incomings.results" :key="incoming.id">
            <div class="md:flex flex-start">
              <div class="bg-blue-600 w-8 h-6 flex items-center justify-center rounded-full -ml-3">
                <BaseIcon :path="mdiAmbulance" class="text-white w-4 h-4" role="img" size="20" />
              </div>
              <div class="block p-6 rounded-lg shadow-lg bg-gray-100 w-full ml-6 mb-10">
                <div class="flex justify-between mb-4">
                  <a href="#!" class="font-medium text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">New Referral</a>
                  <a href="#!" class="font-medium text-blue-600 hover:text-blue-700 focus:text-blue-800 duration-300 transition ease-in-out text-sm">{{ moment(incoming.created_on).format('lll') }}</a>
                </div>
                <p class="text-gray-700 mb-6">{{ incomingContent(incoming) }}</p>
                <button @click="getInfoClient(incoming.Client[0])" type="button" class="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" data-mdb-ripple="true" data-bs-toggle="modal" data-bs-target="#exampleModalLg">Preview</button>
                <!-- <button type="button" class="inline-block px-3.5 py-1 border-2 border-blue-600 text-blue-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out" data-mdb-ripple="true">See demo</button> -->
              </div>
            </div>
          </li>
        </ol>
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
            
            <FormField class="text-xl">
              <FormField label="Middlename" class="text-sm">
                {{ form.middlename }}
              </FormField>
              <FormField label="Lastname" class="text-sm">
                {{ form.lastname }}
              </FormField>
            </FormField>

            <FormField class="text-xl">
              <FormField label="Birthdate" class="text-sm">
                {{ form.birthdate }}
              </FormField>
              <FormField label="Birthplace" class="text-sm">
                {{ form.birthplace }}
              </FormField>
            </FormField>

            <FormField label="Sex">
              {{ form.sex.charAt(0).toUpperCase() + form.sex.slice(1) }}
            </FormField>

            <FormField label="Client Address">
              {{ form.client_barangay }}
            </FormField>

            <BaseDivider />

            <FormField label="Name of Parents / Guardian">
              {{ form.guardian_name }}
            </FormField>

            <FormField class="text-xl">
              <FormField label="Guardian Contact Number" class="text-sm">
                {{ form.guardian_contact_number }}
              </FormField>
              <FormField label="Guardian Alternate Number" class="text-sm">
                {{ form.guardian_alternate_number }}
              </FormField>
            </FormField>

            <FormField label="Parent/Guardian Address">
              {{ form.guardian_barangay }}
            </FormField>

            <BaseDivider />

            <FormField label="Name of BHW">
              {{  form.bhw_name }}
            </FormField>

            <FormField >
              <FormField label="BHW contact number">
                {{ form.bhw_contact_number }}
              </FormField>
              <FormField label="BHW Address">
                {{ form.bhw_barangay }}
              </FormField>
            </FormField>

            <BaseDivider />

            <FormField label="Name of Health Provider">
              {{ form.health_provider_name }}
            </FormField>

            <FormField >
              <FormField label="Health Provider Contact Number">
                {{ form.health_provider_contact }}
              </FormField>
              <FormField label="Health Provider Address">
                {{ form.bhw_barangay }}
              </FormField>
            </FormField>

            <BaseButtons>
              <BaseButton type="button" color="warning" label="Print PDF" />
              <BaseButton type="button" color="success" label="Accept" />
              <BaseButton type="button" color="info" outline label="Close" data-bs-dismiss="modal" aria-label="Close"/>
            </BaseButtons>
            
          </CardBox>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import '@/css/main.css';
</style>