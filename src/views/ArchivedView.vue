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
    mdiCalendarEditOutline,
    mdiCardBulletedSettings,
    mdiOpenInNew,
    mdiNeedle
  } from "@mdi/js";
  import SectionMain from "@/components/SectionMain.vue";
  import NotificationBar from "@/components/NotificationBar.vue";
  import TableArchived from "@/components/TableArchived.vue";
  import CardBox from "@/components/CardBox.vue";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
  import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
  import { getUserBarangay, getUserMunicipality } from '@/api/auth'
  import { getInfoClient } from "@/api/python"

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
    form.created_on = response.created_on
    form.updated_on = response.updated_on
  }

  defineEmits(["loading-modal-open","loading-modal-close"]);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBabyFaceOutline" title="Archived" main>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableArchived @client-info="handleClientInfo" checkable />
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
              <BaseButton type="button" color="info" outline label="Close" data-bs-dismiss="modal" aria-label="Close"/>
            </BaseButtons>
            
          </CardBox>
        </div>
      </div>
    </div>
  </div>

  <CardBoxModal v-model="isModalActive" title="Vaccinee Info" has-cancel>
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

  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" id="vaccineeModal" data-bs-backdrop="static" ref='el_modal' aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-md relative w-auto pointer-events-none border-4 border-indigo-500/100">
      <div class="modal-content border-none shadow-sm relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
        <div class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
          <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalLgLabel">
            Vaccinee Type
          </h5>
          <button type="button"
            class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
            data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body relative p-4">
          <CardBox is-form>
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

            <template #footer>
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="button" color="info" outline label="Close" data-bs-dismiss="modal" aria-label="Close"/>
              </BaseButtons>
            </template>

          </CardBox>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
  /* @import '@/css/main.css'; */
</style>
