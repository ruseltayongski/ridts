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

const el_modal = ref<HTMLInputElement | null>(null)
const handleOpenModal = async () => {
  //el_modal.value?.click()
  new Modal(el_modal.value).show()
}
defineEmits(["loading-modal-open","loading-modal-close"]);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBabyFaceOutline" title="Referred" main>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6">

        <div class="max-w-xl mx-auto my-4 border-b-2 pb-4">	
          <div class="flex pb-3">
            <div class="flex-1">
            </div>

            <div class="flex-1">
              <div class="w-10 h-10 bg-green mx-auto rounded-full text-lg text-white flex items-center">
                <span class="text-white text-center w-full"><i class="fa fa-check w-full fill-current white"></i></span>
              </div>
            </div>


            <div class="w-full align-center items-center align-middle content-center flex">
              <div class="w-full bg-grey-light rounded items-center align-middle align-center flex-1">
                <div class="bg-green-light text-xs leading-none py-1 text-center text-grey-darkest rounded" style="width: 100%"></div>
              </div>
            </div>
          
            
            <div class="flex-1">
              <div class="w-10 h-10 bg-green mx-auto rounded-full text-lg text-white flex items-center">
                <span class="text-white text-center w-full"><i class="fa fa-check w-full fill-current white"></i></span>
              </div>
            </div>
    
            <div class="flex-1">
            </div>		
          </div>
          
          <div class="flex text-xs content-center text-center">
            <div class="left-0">
              Referred
            </div>
            
            <div class="w-full flex justify-end">
              Accepted
            </div>
            
          </div>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
  @import '@/assets/tailwind0.3.0.css';
  /* @import 'https://unpkg.com/tailwindcss@0.3.0/dist/tailwind.min.css' */
</style>
