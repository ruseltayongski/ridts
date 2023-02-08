<script setup lang="ts">
  import { reactive, ref, computed, onMounted } from "vue";
  import { useMainStore } from "@/stores/main";
  import {
    mdiAmbulance
  } from "@mdi/js";
  import SectionMain from "@/components/SectionMain.vue";
  import CardBox from "@/components/CardBox.vue";
  import CardBoxFooter from "@/components/CardboxComponentFooter.vue";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
  import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
  import { getUserBarangay,getUserBarangayAssignment } from '@/api/auth'
  import { getTracking } from "@/api/python"
  import { useUseridStore } from "@/stores"

  import moment from "moment"

  const get_barangay = ref([])
  const get_municipality = ref({})

  const mainStore = useMainStore();

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
    console.log(trackings.value)
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

  const isModalActive = ref(false);

  const el_modal = ref<HTMLInputElement | null>(null)
  const handleOpenModal = async () => {
    //el_modal.value?.click()
    new Modal(el_modal.value).show()
  }

  const fullname = (client:{}) => {
    return client.firstname+" "+client.lastname+" ["+client.sex.charAt(0).toUpperCase() + client.sex.slice(1)+", "+getAge(client.birthdate)+"]"
  }

  const getAge = (dateString:String) => {
    const ageInMilliseconds = new Date() - new Date(dateString);
    return Math.floor(ageInMilliseconds/1000/60/60/24/365); // convert to years
  }

  defineEmits(["loading-modal-open","loading-modal-close"]);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAmbulance" title="Referred" main>
      </SectionTitleLineWithButton>
      <CardBox hasBoxTitle hasBoxFooter class="mb-6" v-for="tracking in trackings.results" :client="tracking.Client[0]" :name="fullname(tracking.Client[0])" :key="tracking.id">
        <div class="stepper-wrapper">
          <div class="stepper-item completed">
            <div class="step-counter">1</div>
            <div class="step-name">Referred</div>
          </div>
          <div class="stepper-item" :class="{ 'completed' : tracking.date_accepted }">
            <div class="step-counter">2</div>
            <div class="step-name">Accepted</div>
          </div>
          <div class="stepper-item" :class="{ 'completed' : tracking.date_scheduled }">
            <div class="step-counter">3</div>
            <div class="step-name">Scheduled</div>
          </div>
          <div class="stepper-item" :class="{ 'completed' : tracking.date_vaccinated }">
            <div class="step-counter">4</div>
            <div class="step-name">Vaccinated</div>
          </div>
        </div>
        <!-- <div class="max-w-xl mx-auto my-4 border-b-2 pb-4">
          <div class="flex pb-3">
            <div class="flex-1">
            </div>
            <div class="flex-1">
              <div class="w-10 h-10 bg-green mx-auto rounded-full text-lg text-white flex items-center">
                <span class="text-white text-center w-full">
                  <i class="fa fa-check w-full fill-current white">
                  </i>
                </span>
              </div>
            </div>
            <div class="w-1/6 align-center items-center align-middle content-center flex">
              <div class="w-full bg-grey-light rounded items-center align-middle align-center flex-1">
                <div class="bg-green-light text-xs leading-none py-1 text-center text-grey-darkest rounded " style="width: 100%">
                </div>
              </div>
            </div>
            <div class="flex-1">
              <div class="w-10 h-10 bg-green mx-auto rounded-full text-lg text-white flex items-center">
                <span class="text-white text-center w-full">
                  <i class="fa fa-check w-full fill-current white">
                  </i>
                </span>
              </div>
            </div>
            <div class="w-1/6 align-center items-center align-middle content-center flex">
              <div class="w-full bg-grey-light rounded items-center align-middle align-center flex-1">
                <div class="bg-green-light text-xs leading-none py-1 text-center text-grey-darkest rounded " style="width: 20%">
                </div>
              </div>
            </div>
            <div class="flex-1">
              <div class="w-10 h-10 bg-white border-2 border-grey-light mx-auto rounded-full text-lg text-white flex items-center">
                <span class="text-grey-darker text-center w-full">3
                </span>
              </div>
            </div>
            <div class="w-1/6 align-center items-center align-middle content-center flex">
              <div class="w-full bg-grey-light rounded items-center align-middle align-center flex-1">
                <div class="bg-green-light text-xs leading-none py-1 text-center text-grey-darkest rounded " style="width: 0%">
                </div>
              </div>
            </div>
            <div class="flex-1">
              <div class="w-10 h-10 bg-white border-2 border-grey-light mx-auto rounded-full text-lg text-white flex items-center">
                <span class="text-grey-darker text-center w-full">4
                </span>
              </div>
            </div>
            <div class="flex-1">
            </div>    
          </div>
          <div class="flex text-xs content-center text-center">
            <div class="w-1/4">
              Referred
            </div>
            <div class="w-1/4">
              Accepted
            </div>
            <div class="w-1/4">
              Scheduled
            </div>
            <div class="w-1/4">
              Vaccinated
            </div>      
          </div>
        </div> -->
      </CardBox>

    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
  .stepper-wrapper {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .stepper-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

    @media (max-width: 768px) {
      font-size: 12px;
    }
  }

  .stepper-item::before {
    position: absolute;
    content: "";
    border-bottom: 2px solid #ccc;
    width: 100%;
    top: 20px;
    left: -50%;
    z-index: 2;
  }

  .stepper-item::after {
    position: absolute;
    content: "";
    border-bottom: 2px solid #ccc;
    width: 100%;
    top: 20px;
    left: 50%;
    z-index: 2;
  }

  .stepper-item .step-counter {
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #ccc;
    margin-bottom: 6px;
  }

  .stepper-item.active {
    font-weight: bold;
  }

  .stepper-item.completed .step-counter {
    background-color: #4bb543;
  }

  .stepper-item.completed::after {
    position: absolute;
    content: "";
    border-bottom: 2px solid #4bb543;
    width: 100%;
    top: 20px;
    left: 50%;
    z-index: 3;
  }

  .stepper-item:first-child::before {
    content: none;
  }
  .stepper-item:last-child::after {
    content: none;
  }
  /* @import '@/assets/tailwind0.3.0.css'; */
  /* @import 'https://unpkg.com/tailwindcss@0.3.0/dist/tailwind.min.css' */
</style>
