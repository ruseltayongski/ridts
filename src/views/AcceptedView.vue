<script setup lang="ts">
  import { reactive, ref, computed, onMounted, watch } from "vue";
  import { useMainStore } from "@/stores/main";
  import {
    mdiHandHeartOutline,
    mdiBallotOutline,
    mdiNeedle,
    mdiCalendarEditOutline
  } from "@mdi/js";
  import SectionMain from "@/components/SectionMain.vue";
  import CardBox from "@/components/CardBox.vue";
  import CardBoxFooter from "@/components/CardboxComponentFooter.vue";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
  import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
  import TableAccepted from "@/components/TableAccepted.vue";
  import NotificationMessage from "@/components/NotificationMessage.vue";
  import { getUserBarangay,getUserBarangayAssignment, getUserInfo } from '@/api/auth'
  import { createClient, getInfoClient, updateClient, getVaccineInfo, createVaccineInfo, updateVaccineInfo, getTracking } from "@/api/python"
  import { useUseridStore } from "@/stores"

  import { notify } from "notiwind"
  import moment from "moment"

  const get_barangay = ref([])
  const get_municipality = ref({})

  const mainStore = useMainStore();

  const emit = defineEmits(["loading-modal-open","loading-modal-close"]);

  const button_label = ref("")

  onMounted(() => {
    _getUserBarangay()
    _getTracking()
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

  const trackings = ref([])
  const _getTracking = async () => {
    const response = await getUserBarangayAssignment({ userid: useUseridStore().value })
    const barangay_assignment = await Promise.all(response.map(async (item: any) => item.id))
    trackings.value = await getTracking({ referred_from : barangay_assignment })
  }

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

  const handleClientInfo = async (id:Number) => {
    button_label.value = "Update"
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

  const clearDose = async () => {
    schedule.given_1 = ""
    schedule.given_2 = ""
    schedule.given_3 = ""
    schedule.given_administerred_1 = ""
    schedule.given_administerred_2 = ""
    schedule.given_administerred_3 = ""
    schedule.scheduled_1 = ""
    schedule.scheduled_2 = ""
    schedule.scheduled_3 = ""
    schedule.scheduled_administerred_1 = ""
    schedule.scheduled_administerred_2 = ""
    schedule.scheduled_administerred_3 = ""
    schedule.status1 = ""
    schedule.status2 = ""
    schedule.status3 = ""
    schedule.button_type1 = ""
    schedule.button_type2 = ""
    schedule.button_type3 = ""
  }

  const schedule = reactive({
    client_id: 0,
    vaccine_type: "",
    given_1: "",
    given_2: "",
    given_3: "",
    given_administerred_1: "",
    given_administerred_2: "",
    given_administerred_3: "",
    scheduled_1: "",
    scheduled_2: "",
    scheduled_3: "",
    scheduled_administerred_1: "",
    scheduled_administerred_2: "",
    scheduled_administerred_3: "",
    status1: "",
    status2: "",
    status3: "",
    button_type1: "",
    button_type2: "",
    button_type3: "",
    updated_on: ""
  });

  const dose_modal = ref<HTMLInputElement | null>(null)
  const el_dose_modal = ref<HTMLInputElement | null>(null)
  const handleVaccineInfo = async (vaccine_type:"") => {
    clearDose()
    const response = await getVaccineInfo({ client_id : form.id, vaccine_type: vaccine_type, status: 1 })
    console.log(response)

    schedule.client_id = form.id
    schedule.vaccine_type = vaccine_type
    if(response.length > 0) {
      emit("loading-modal-open")
      schedule.scheduled_1 = response[0].scheduled_1
      schedule.scheduled_2 = response[0].scheduled_2
      schedule.scheduled_3 = response[0].scheduled_3
      const scheduled_administerred_1 = await getUserInfo({ id : response[0].scheduled_administerred_1 })
      schedule.scheduled_administerred_1 = scheduled_administerred_1.fname+" "+scheduled_administerred_1.mname+" "+scheduled_administerred_1.lname
      const scheduled_administerred_2 = await getUserInfo({ id : response[0].scheduled_administerred_2 })
      schedule.scheduled_administerred_2 = scheduled_administerred_2.fname+" "+scheduled_administerred_2.mname+" "+scheduled_administerred_2.lname
      const scheduled_administerred_3 = await getUserInfo({ id : response[0].scheduled_administerred_3 })
      schedule.scheduled_administerred_3 = scheduled_administerred_3.fname+" "+scheduled_administerred_3.mname+" "+scheduled_administerred_3.lname
      schedule.given_1 = response[0].given_1
      schedule.given_2 = response[0].given_2
      schedule.given_3 = response[0].given_3
      const given_administerred_1 = await getUserInfo({ id : response[0].given_administerred_1 })
      schedule.given_administerred_1 = given_administerred_1.fname+" "+given_administerred_1.mname+" "+given_administerred_1.lname
      const given_administerred_2 = await getUserInfo({ id : response[0].given_administerred_2 })
      schedule.given_administerred_2 = given_administerred_2.fname+" "+given_administerred_2.mname+" "+given_administerred_2.lname
      const given_administerred_3 = await getUserInfo({ id : response[0].given_administerred_3 })
      schedule.given_administerred_3 = given_administerred_3.fname+" "+given_administerred_3.mname+" "+given_administerred_3.lname
      schedule.status1 = response[0].status1
      schedule.status2 = response[0].status2
      schedule.status3 = response[0].status3
      schedule.button_type1 = response[0].button_type1
      schedule.button_type2 = response[0].button_type2
      schedule.button_type3 = response[0].button_type3
      emit("loading-modal-close")
    } else {
      button_label.value = "Submit"
    }

    schedule.updated_on = moment().format('YYYY-MM-DD HH:mm:ss')
    
    dose_modal.value = new Modal(el_dose_modal.value); //initialize modal instance
    dose_modal.value?.show()
  }

  const doseSubmit = async () => {
    dose_modal.value?.hide();
    const vaccine_info_save = {
        client_id: schedule.client_id,
        vaccine_type: schedule.vaccine_type,
        scheduled_administerred_1: schedule.scheduled_1 ? mainStore.userId : 0,
        scheduled_administerred_2: schedule.scheduled_2 ? mainStore.userId : 0,
        scheduled_administerred_3: schedule.scheduled_3 != "" ? mainStore.userId : 0,
        given_administerred_1: schedule.given_1 || schedule.given_administerred_1 != "" ? mainStore.userId : 0,
        given_administerred_2: schedule.given_2 || schedule.given_administerred_2 != "" ? mainStore.userId : 0,
        given_administerred_3: schedule.given_3 || schedule.given_administerred_3 != "" ? mainStore.userId : 0,
        updated_on: moment(schedule.updated_on).format('YYYY-MM-DD HH:mm:ss'),
        Client: [schedule.client_id]
    }

    vaccine_info_save.scheduled_1 = schedule.scheduled_1 ? moment(schedule.scheduled_1).format('YYYY-MM-DD') : null
    vaccine_info_save.scheduled_2 = schedule.scheduled_2 ? moment(schedule.scheduled_2).format('YYYY-MM-DD') : null
    vaccine_info_save.scheduled_3 = schedule.scheduled_3 ? moment(schedule.scheduled_3).format('YYYY-MM-DD') : null
    vaccine_info_save.given_1 = schedule.given_1 ? moment(schedule.given_1).format('YYYY-MM-DD') : null
    vaccine_info_save.given_2 = schedule.given_2 ? moment(schedule.given_2).format('YYYY-MM-DD') : null
    vaccine_info_save.given_3 = schedule.given_3 ? moment(schedule.given_3).format('YYYY-MM-DD') : null
    vaccine_info_save.created_on = moment().format('YYYY-MM-DD HH:mm:ss')
  
    if(button_label.value == "Update")
      await updateVaccineInfo(vaccine_info_save)
    else {
      await createVaccineInfo(vaccine_info_save)    
    }
    
    notify({
      group: "success_dose",
      title: "Success",
      text: "Vaccine info was successfully updated!"
    }, 2000)

  };

  const given_1 = computed(() => schedule.given_1);
  watch(given_1, (value) => {
    console.log(value)
    schedule.given_administerred_1 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const given_2 = computed(() => schedule.given_2);
  watch(given_2, (value) => {
    console.log(value)
    schedule.given_administerred_2 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const given_3 = computed(() => schedule.given_3);
  watch(given_3, (value) => {
    console.log(value)
    schedule.given_administerred_3 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const schedule_1 = computed(() => schedule.scheduled_1);
  watch(schedule_1, (value) => {
    console.log(value)
    schedule.scheduled_administerred_1 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const schedule_2 = computed(() => schedule.scheduled_2);
  watch(schedule_2, (value) => {
    console.log(value)
    schedule.scheduled_administerred_2 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const schedule_3 = computed(() => schedule.scheduled_3);
  watch(schedule_3, (value) => {
    console.log(value)
    schedule.scheduled_administerred_3 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiHandHeartOutline" title="Accepted Client" main>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableAccepted @client-info="handleClientInfo" checkable />
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

          <NotificationMessage></NotificationMessage>

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

            <BaseDivider />

            <FormField label="Vaccine Type">
              <BaseButtons>
                <BaseButton
                  color="info"
                  label="BCG"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('bcg')"
                />
                <BaseButton
                  color="info"
                  label="HepB"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('hepb')"
                />
                <BaseButton
                  color="info"
                  label="Pentavalent"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('pentavalent')"
                />
                <BaseButton
                  color="info"
                  label="OPV"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('opv')"
                />
                <BaseButton
                  color="info"
                  label="IPV"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('ipv')"
                />
                <BaseButton
                  color="info"
                  label="PCV"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('pcv')"
                />
                <BaseButton
                  color="info"
                  label="MCV"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('mcv')"
                />
              </BaseButtons>
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


  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" id="vaccineeModal" data-bs-backdrop="static" ref='el_dose_modal' aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-md relative w-auto pointer-events-none border-4 border-indigo-500/100">
      <div class="modal-content border-none shadow-sm relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
        <div class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
          <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalLgLabel">
            Dose Schedule
          </h5>
          <button type="button"
            class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
            data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body relative p-4">
          <CardBox is-form @submit.prevent="doseSubmit">
            <FormField label="1st Dose" :status="schedule.status1" :button_type="schedule.button_type1">
              <FormField label="Date Scheduled" :help="schedule.scheduled_1 ? schedule.scheduled_administerred_1 : ''">
                <FormControl id="dt1" v-model="schedule.scheduled_1" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Scheduled"/>
              </FormField>
              <FormField label="Date Given" :help="schedule.given_1 ? schedule.given_administerred_1 : ''">
                <FormControl id="dt2" v-model="schedule.given_1" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Given"/>
              </FormField>
            </FormField>
                      
            <FormField v-if="schedule.vaccine_type =='mcv' || schedule.vaccine_type =='pentavalent' || schedule.vaccine_type =='opv' || schedule.vaccine_type =='pcv'" label="2nd Dose" :status="schedule.status2" :button_type="schedule.button_type2">
              <FormField label="Date Scheduled" :help="schedule.scheduled_2 ? schedule.scheduled_administerred_2 : ''">
                <FormControl id="dt3" v-model="schedule.scheduled_2" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Scheduled"/>
              </FormField>
              <FormField label="Date Given" :help="schedule.given_2 ? schedule.given_administerred_2 : ''">
                <FormControl id="dt4" v-model="schedule.given_2" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Given"/>
              </FormField>
            </FormField>

            <FormField v-if="schedule.vaccine_type =='pentavalent' || schedule.vaccine_type =='opv' || schedule.vaccine_type =='pcv'" label="3rd Dose" :status="schedule.status3" :button_type="schedule.button_type3">
              <FormField label="Date Scheduled" :help="schedule.scheduled_3 ? schedule.scheduled_administerred_3 : ''">
                <FormControl id="dt5" v-model="schedule.scheduled_3" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Scheduled"/>
              </FormField>
              <FormField label="Date Given" :help="schedule.given_3 ? schedule.given_administerred_3 : ''">
                <FormControl id="dt6" v-model="schedule.given_3" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Given"/>
              </FormField>
            </FormField>

            <BaseButtons>
              <BaseButton type="submit" color="info" :label="button_label" />
              <BaseButton type="button" color="info" outline label="Close" data-bs-dismiss="modal" aria-label="Close"/>
            </BaseButtons>

          </CardBox>
        </div>
      </div>
    </div>
  </div>
  
</template>
<style scoped>
</style>
