<script setup lang="ts">
  import { computed, ref, reactive, onMounted, watch } from "vue";
  import { useMainStore } from "@/stores/main";
  import { mdiAlert,mdiBadgeAccount,mdiBallotOutline } from "@mdi/js";
  import CardBoxModal from "@/components/CardBoxModal.vue";
  import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
  import BaseLevel from "@/components/BaseLevel.vue";
  import BaseButtons from "@/components/BaseButtons.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import UserAvatar from "@/components/UserAvatar.vue";
  import NotificationBar from "@/components/NotificationBar.vue";
  import { trackClient, getInfoClient } from "@/api/python"
  import { useMuncityDescriptionStore } from "@/stores"
  import { useStyleStore } from "@/stores/style.ts";
  import loadingModal from "@/assets/spin.gif"
  import moment from "moment"
  const data = ref([])

  const mainStore = useMainStore();

  //const items = computed(() => mainStore.clients);
  const items = computed(() => data.value);

  const isModalActive = ref(false);

  const isModalDangerActive = ref(false);

  const perPage = ref(10);

  const currentPage = ref(0);

  const checkedRows = ref([]);

  const styleStore = useStyleStore();
  
  const props = defineProps({
    checkable: Boolean,
    search_keyword: {
      type: String,
      default: null,
    }
  });

  const data_value = computed(() => data.value);
  const data_flag = ref(false)
  watch(data_value, () => {
    data_flag.value = true
  })

  const search_keyword = computed(() => props.search_keyword);
  watch(search_keyword, (value) => {
    console.log(value)
    _trackClient({ track:value })
  })

  const itemsPaginated = computed(() =>
    items.value.slice(
      perPage.value * currentPage.value,
      perPage.value * (currentPage.value + 1)
    )
  );

  onMounted(() => {
    styleStore.setDarkMode(false);
  })

  const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

  const currentPageHuman = computed(() => currentPage.value + 1);

  const pagesList = computed(() => {
    const pagesList = [];

    for (let i = 0; i < numPages.value; i++) {
      pagesList.push(i);
    }

    return pagesList;
  });

  const remove = (arr, cb) => {
    const newArr = [];

    arr.forEach((item) => {
      if (!cb(item)) {
        newArr.push(item);
      }
    });

    return newArr;
  };

  const checked = (isChecked, client) => {
    if (isChecked) {
      checkedRows.value.push(client);
    } else {
      checkedRows.value = remove(
        checkedRows.value,
        (row) => row.id === client.id
      );
    }
  };

  const _trackClient = async (params: {} = {}) => {
    const response = await trackClient(params)
    data.value = await Promise.all(response.map(async (item: any) => {
        return {
          ...item
        }
    }))
    console.log(data.value)
  }

  const notificationSettingsModel = ref([]);
  const notificationsOutline = computed(
    () => notificationSettingsModel.value.indexOf("outline") > -1
  );

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
</script>

<template>
  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
      {{ checkedRow.firstname+" "+checkedRow.middlename+" "+checkedRow.lastname }}
    </span>
  </div>

  <table v-if="data.length > 0"> 
    <thead>
      <tr>
        <th>Name</th>
        <th>Municipality</th>
        <th>Barangay</th>
        <!-- <th>Progress</th> -->
        <th>Created</th>
        <th>In Active</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in itemsPaginated" :key="client.id">
        <td data-label="Name">
          {{ client.firstname+" "+client.middlename+" "+client.lastname }}
        </td>
        <td data-label="Municipality">
          {{ client.muncity_description }}
        </td>
        <td data-label="barangay">
          {{ client.client_barangay }}
        </td>
        <!-- <td data-label="Progress" class="lg:w-32">
          <progress
            class="flex w-2/5 self-center lg:w-full"
            max="100"
            :value="80"
          >
            80
          </progress>
        </td> -->
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="client.created_on"
            >{{ moment(client.created_on).format('ll') }}</small
          > <br>
          <small class="text-gray-400 dark:text-slate-400">{{ moment(client.created_on).format('h:mm:ss a') }}</small>
        </td>
        <td data-label="In Active">{{ client.is_active ? 'Yes' : 'No' }}</td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiBadgeAccount"
              small
              data-bs-toggle="modal" 
              data-bs-target="#exampleModalLg"
              @click="handleClientInfo(client.id)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="flex flex-row mt-2 p-10" v-else-if="data.length <= 0 && search_keyword && !data_flag">
    <img :src="loadingModal" alt="loading_gif" class="w-10 h-10">
    <p class="text-xl ml-2">Processing...</p>
  </div>
  <NotificationBar v-else-if="data.length <= 0 && search_keyword && data_flag"
    color="info"
    :icon="mdiAlert"
    :outline="notificationsOutline"
  >
    <b>Warning state</b>. No baby found!
  </NotificationBar>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800" v-if="data.length > 0">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>

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
                {{ moment(form.birthdate).format('MMMM Do, YYYY') }}
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

