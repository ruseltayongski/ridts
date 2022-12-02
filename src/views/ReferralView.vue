<script setup lang="ts">
import { reactive, ref, computed } from "vue";
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

const isModalActive = ref(false);
const el_modal = ref<HTMLInputElement | null>(null)
const handleCloseModal = async () => {
  el_modal.value?.click()
}

const selectOptions = [
  { id: 1, label: "Lahug" },
  { id: 2, label: "Day-as" },
  { id: 3, label: "Labangon" },
];

const form = reactive({
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "",
  department: selectOptions[0],
  subject: "",
  question: "",
});

const customElementsForm = reactive({
  checkbox: ["lorem"],
  radio: "one",
  switch: ["one"],
  file: null,
});

const submit = () => {
  //
};

const mainStore = useMainStore();

const clientBarItems = computed(() => mainStore.clients.slice(0, 4));

const transactionBarItems = computed(() => mainStore.history);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAmbulance" title="Referral" main>
        
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableSampleReferral checkable />
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
          <CardBox form @submit.prevent="submit">
            <FormField label="Personal Information">
              <FormControl :icon="mdiAccount" placeholder="Vaccine Card Number ID"/>
              <FormControl :icon="mdiAccount" placeholder="Firstname"/>
            </FormField>
            
            <FormField>
              <FormControl :icon="mdiAccount" placeholder="Middlename"/>
              <FormControl :icon="mdiAccount" placeholder="Lastname"/>
            </FormField>

            <FormField>
              <FormControl :icon="mdiAccount" placeholder="Birthdate"/>
              <FormControl :icon="mdiHomeCityOutline" placeholder="Birthplace"/>
            </FormField>

            <FormField label="Sex">
              <FormCheckRadioGroup
                v-model="customElementsForm.radio"
                name="sample-radio"
                type="radio"
                :options="{ one: 'Male', two: 'Female' }"
              />
            </FormField>

            <FormField label="Client Address">
              <FormControl v-model="form.department" :options="selectOptions" />
            </FormField>

            <BaseDivider />

            <FormField label="Name of Parents / Guardian">
              <FormControl :icon="mdiAccount" placeholder="Firstname Middlename Lastname"/>
            </FormField>

            <FormField >
              <FormControl :icon="mdiCardAccountPhoneOutline" placeholder="Contact Number"/>
              <FormControl :icon="mdiCardAccountPhoneOutline" placeholder="Alternate Number"/>
            </FormField>

            <FormField label="Parent/Guardian Address">
              <FormControl v-model="form.department" :options="selectOptions" />
            </FormField>

            <BaseDivider />

            <FormField label="Name of BHW">
              <FormControl :icon="mdiAccount" placeholder="Firstname Middlename Lastname"/>
            </FormField>

            <FormField >
              <FormField label="BHW contact number">
                <FormControl :icon="mdiCardAccountPhoneOutline" placeholder="Contact Number"/>
              </FormField>
              <FormField label="BHW Address">
                <FormControl v-model="form.department" :options="selectOptions" />
              </FormField>
            </FormField>

            <BaseDivider />

            <FormField label="Name of Health Provider">
              <FormControl :icon="mdiAccount" placeholder="Firstname Middlename Lastname"/>
            </FormField>

            <FormField >
              <FormField label="Health Provider Contact Number">
                <FormControl :icon="mdiCardAccountPhoneOutline" placeholder="Contact Number"/>
              </FormField>
              <FormField label="Health Provider Address">
                <FormControl v-model="form.department" :options="selectOptions" />
              </FormField>
            </FormField>
            
            <template #footer>
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Close" data-bs-dismiss="modal" aria-label="Close"/>
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

<style scoped>
  @import '@/css/main.css';
</style>