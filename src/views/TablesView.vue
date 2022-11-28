<script setup lang="ts">
import { reactive, ref } from "vue";
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
  mdiCardAccountPhoneOutline
} from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableSampleClients from "@/components/TableSampleClients.vue";
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
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBabyFaceOutline" title="Clients for new born baby" main>
        <BaseButton type="button" color="info" label="Create" :icon="mdiAccountPlus" data-bs-toggle="modal" data-bs-target="#exampleModalLg" />
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableSampleClients checkable />
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
</template>
