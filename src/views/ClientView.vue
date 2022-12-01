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
  mdiCardBulletedSettings
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableClients from "@/components/TableClients.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import { getUserBarangay, getUserMunicipality } from '@/api/auth'

import moment from "moment"

const get_barangay = ref([])
const get_municipality = ref({})

const mainStore = useMainStore();
const transactionBarItems = computed(() => mainStore.history);

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

const form = reactive({
  vaccine_id : "",
	firstname: "",
	middlename: "",
	lastname: "",
	birthdate: "",
	birthplace: "",
	sex: "",
	client_address: 0,
	guardian_name: "",
	guardian_contact_number: "",
	guardian_alternate_number: "",
	guardian_address: 0,
	bhw_name: "",
	bhw_contact_number: "",
	bhw_address: 0,
	health_provider_name: "",
	health_provider_contact: "",
	health_provider_address: 0,
	created_by: 0
});

const customElementsForm = reactive({
  checkbox: ["lorem"],
  radio: "one",
  switch: ["one"],
  file: null,
});

const submit = async () => {
  console.log(form)
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBabyFaceOutline" title="Clients for new born baby" main>
        <BaseButton type="button" color="info" label="Create" :icon="mdiAccountPlus" data-bs-toggle="modal" data-bs-target="#exampleModalLg"/>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableClients checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalLg" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg relative w-auto pointer-events-none">
      <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
        <div class="modal-body relative p-4">
          <SectionTitleLineWithButton
            :icon="mdiBallotOutline"
            title="Client Info"
            main
          >
          </SectionTitleLineWithButton>
          <CardBox is-form @submit.prevent="submit">
            <FormField label="Personal Information" class="text-xl">
              <FormField label="Vaccine Card Number ID" class="text-sm">
                <FormControl v-model="form.vaccine_id" :icon="mdiCardBulletedSettings" :readonly="true"/>
              </FormField>
              <FormControl v-model="form.firstname" :icon="mdiAccount" class="mt-7" placeholder="Firstname" required/>
            </FormField>
            
            <FormField>
              <FormControl v-model="form.middlename" :icon="mdiAccount" placeholder="Middlename" required/>
              <FormControl v-model="form.lastname" :icon="mdiAccount" placeholder="Lastname" required/>
            </FormField>

            <FormField>
              <FormField label="Birthdate">
                <FormControl v-model="form.birthdate" type="date" :icon="mdiCalendarEditOutline" required/>
              </FormField>
              <FormControl v-model="form.birthplace" :icon="mdiHomeCityOutline" class="mt-8" placeholder="Birthplace" required/>
            </FormField>

            <FormField label="Sex">
              <FormCheckRadioGroup
                v-model="form.sex"
                name="sex"
                type="radio"
                :options="{ male: 'Male', female: 'Female' }"
              />
            </FormField>

            <FormField label="Client Address">
              <FormControl v-model="form.client_address" :options="get_barangay"/>
            </FormField>

            <BaseDivider />

            <FormField label="Name of Parents / Guardian">
              <FormControl v-model="form.guardian_name" :icon="mdiAccount" placeholder="Firstname Middlename Lastname" required/>
            </FormField>

            <FormField >
              <FormControl v-model="form.guardian_contact_number" :icon="mdiCardAccountPhoneOutline" placeholder="Contact Number" required/>
              <FormControl v-model="form.guardian_alternate_number" :icon="mdiCardAccountPhoneOutline" placeholder="Alternate Number" required/>
            </FormField>

            <FormField label="Parent/Guardian Address">
              <FormControl v-model="form.guardian_address" :options="get_barangay" required/>
            </FormField>

            <BaseDivider />

            <FormField label="Name of BHW">
              <FormControl v-model="form.bhw_name" :icon="mdiAccount" placeholder="Firstname Middlename Lastname" required/>
            </FormField>

            <FormField >
              <FormField label="BHW contact number">
                <FormControl v-model="form.bhw_contact_number" :icon="mdiCardAccountPhoneOutline" placeholder="Contact Number" required/>
              </FormField>
              <FormField label="BHW Address">
                <FormControl v-model="form.bhw_address" :options="get_barangay" required/>
              </FormField>
            </FormField>

            <BaseDivider />

            <FormField label="Name of Health Provider">
              <FormControl v-model="form.health_provider_name" :icon="mdiAccount" placeholder="Firstname Middlename Lastname" required/>
            </FormField>

            <FormField >
              <FormField label="Health Provider Contact Number">
                <FormControl v-model="form.health_provider_contact" :icon="mdiCardAccountPhoneOutline" placeholder="Contact Number" required/>
              </FormField>
              <FormField label="Health Provider Address">
                <FormControl v-model="form.bhw_address" :options="get_barangay" required/>
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

  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" id="vaccineeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-md relative w-auto pointer-events-none">
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
          <div class="grid grid-cols-1">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
