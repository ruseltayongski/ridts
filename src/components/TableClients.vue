<script setup lang="ts">
  import { computed, ref, reactive, onMounted, watch, normalizeStyle } from "vue";
  import { useMainStore } from "@/stores/main";
  import { mdiTrashCan,mdiNeedle,mdiAmbulance } from "@mdi/js";
  import CardBoxModal from "@/components/CardBoxModal.vue";
  import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
  import BaseLevel from "@/components/BaseLevel.vue";
  import BaseButtons from "@/components/BaseButtons.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import UserAvatar from "@/components/UserAvatar.vue";
  import { getUserBarangay,getUserBarangayAssignment } from '@/api/auth'
  import { getAllClient,deleteClient,createActivity,createTracking,updateTracking } from "@/api/python"
  import { useUseridStore } from "@/stores"

  import moment from "moment"
  import { notify } from "notiwind"

  import { insertFirebase, readFirebase } from "@/utils/firebase.ts"
  import { trace } from "console";
  
  const props = defineProps({
    checkable: Boolean,
    search_keyword: {
      type: String,
      default: null,
    },
    form: {
      type: Object,
      default: null,
    }
  });

  const mainStore = useMainStore()
  //const items = computed(() => mainStore.clients);
  const data = ref([])
  const items = computed(() => data.value);

  const isModalActive = ref(false);

  const isModalDangerActive = ref(false);

  const perPage = ref(10);

  const currentPage = ref(0);

  const checkedRows = ref([]);

  const client_delete = reactive({
    client_id : 0,
    client_name : ""
  })
  
  const itemsPaginated = computed(() =>
    items.value.slice(
      perPage.value * currentPage.value,
      perPage.value * (currentPage.value + 1)
    )
  );

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

  const selectOptions = [
    { id: 1, label: "Lahug" },
    { id: 2, label: "Sambag II" },
    { id: 3, label: "Day-as" },
  ];

  const form = reactive({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "",
    barangay: selectOptions[0],
    subject: "",
    question: "",
  });

  const referring_facility = ref(0)
  const referred_facility = ref(0)
  const referring_facility_list = ref([])
  const referred_facility_list = ref([])

  const refer_modal = ref<HTMLInputElement | null>(null)
  const el_refer_modal = ref<HTMLInputElement | null>(null)
  
  onMounted(() => {
    _referringFacility()
    _referredFacility()
    _getAllClient()
    refer_modal.value = new Modal(el_refer_modal.value); //initialize modal instance
  })

  const _getAllClient = async (params: {} = {}) => {
    const response = await getAllClient(params)
    data.value = await Promise.all(response.map(async (item: any) => {
        return {
          ...item
        }
    }))
  }

  const _referringFacility = async () => {
    const response = await getUserBarangayAssignment({ userid: useUseridStore().value })
    referring_facility_list.value = await Promise.all(response.map(async (item: any) => {
        return {
          id : item.id,
          label: item.description
        }
    }))
    console.log(referring_facility_list.value)
  }

  const _referredFacility = async () => {
    const response = await getUserBarangay()
    referred_facility_list.value = await Promise.all(response.map(async (item: any) => {
        return {
          id : item.id,
          label: item.description
        }
    }))
  }
  
  const handleDeleteClient = async (client_id:any,client_name:any) => {
    client_delete.client_id = client_id
    client_delete.client_name = client_name
    isModalDangerActive.value = true
  }

  const handleConfirmDelete = async () => {
    data.value = data.value.filter((client) => client.id !== client_delete.client_id)
    await deleteClient({ id : client_delete.client_id })
    notify({
      group: "error",
      title: "Warning",
      text: client_delete.client_name+" was successfully deleted"
    }, 2000)
  }

  const emit = defineEmits(["client-info"])
  const handleClientInfo = (id:Number) => {
    emit("client-info", id);
  };

  const search_keyword = computed(() => props.search_keyword);
  watch(search_keyword, (value) => {
    console.log("search keyword")
    _getAllClient({ search : value })
  })

  const forms = computed(() => props.form);
  watch(forms, (value) => {
    if(value.status == "updated") {
      data.value.filter((client) => {
        if(client.id == value.id) {
          client.firstname = value.firstname
          client.middlename = value.middlename
          client.lastname = value.lastname
          client.client_barangay = value.client_barangay
        }
      })
    } else {
      data.value.unshift(value)
    }
  })

  const remarks = ref("")
  const referClient = async () => {
    //insertFirebase(remarks.value)
    //console.log(refer_client.value)
    const referring_facility_address = referring_facility_list.value.filter((barangay) => barangay.id === referring_facility.value )
    const referred_facility_address = referred_facility_list.value.filter((barangay) => barangay.id === referred_facility.value )
    const refer_json = {
      Client: [refer_client.value.id],
      client_id : refer_client.value.id,
      code : moment().format('YYYY')+ "-" + mainStore.userId+moment().format('MMDDHHmmss')+String(Math.random()).substring(0, 3).split('.').join(""),
      date_referred : moment().format('YYYY-MM-DD HH:mm:ss'),
      referred_from : referring_facility.value,
      referred_from_address : referring_facility_address[0].label,
      referred_to : referred_facility.value,
      referred_to_address : referred_facility_address[0].label,
      referring_id : mainStore.userId,
      referring_name : mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname,
      remarks : remarks.value,
      status : "referred",
      created_on : moment().format('YYYY-MM-DD HH:mm:ss')
    }

    const activity = await createActivity(refer_json)
    refer_json["Activity"] = [activity.id]
    await createTracking(refer_json)
    
    refer_modal.value?.hide()
    notify({
      group: "success",
      title: "success",
      text: "Client was successfully referred!"
    }, 2000)

    remarks.value = ""
  }

  const refer_client = ref({})

  const handleReferClient = (client:{}) => {
    console.log(client)
    refer_client.value = client
  }

  readFirebase()
</script>

<template>
  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" data-bs-backdrop="static" ref="el_refer_modal" id='referModal' aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-md relative w-auto pointer-events-none border-4 border-indigo-500/100">
      <div class="modal-content border-none shadow-sm relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
        <div class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
          <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalLgLabel">
            Refer Patient
          </h5>
          <button type="button"
            class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
            data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body relative p-4">
          <CardBox is-form @submit.prevent="referClient">
            <FormField label="Referring Facility" class="mt-6">
              <FormControl v-model="referring_facility" :options="referring_facility_list" />
            </FormField>
            <FormField label="Referred Facility" class="mt-6">
              <FormControl v-model="referred_facility" :options="referred_facility_list" />
            </FormField>
            <FormField label="Remarks">
              <FormControl
                v-model="remarks"
                type="textarea"
              />
            </FormField>
            <BaseButtons>
              <BaseButton type="submit" color="success" label="Refer" />
              <BaseButton type="button" color="info" outline label="Close" data-bs-dismiss="modal" data-bs-toggle="modal" 
              data-bs-target="#clientModal"/>
            </BaseButtons>
          </CardBox>
        </div>
      </div>
    </div>
  </div>
  <CardBoxModal v-model="isModalActive" title="Refer Client" button="success" has-cancel has-refer @refer="referClient">
    <FormField label="Referring Facility" class="mt-6">
      <FormControl v-model="referring_facility" :options="referring_facility_list" />
    </FormField>
    <FormField label="Referred Facility" class="mt-6">
      <FormControl v-model="referred_facility" :options="referred_facility_list" />
    </FormField>
    <FormField label="Remarks">
      <FormControl
        v-model="remarks"
        type="textarea"
      />
    </FormField>
  </CardBoxModal>

  <CardBoxModal
    v-model="isModalDangerActive"
    title="Please confirm"
    button="danger"
    has-cancel
    has-confirm
    @confirm-delete="handleConfirmDelete"
  >
    <p>Are you sure you want to delete {{ client_delete.client_name }}?</p>
  </CardBoxModal>

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
      {{ checkedRow.firstname+" "+checkedRow.middlename+" "+checkedRow.lastname }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th />
        <th>Name</th>
        <th>Municipality</th>
        <th>Barangay</th>
        <th>Progress</th>
        <th>Created</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in itemsPaginated" :key="client.id">
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, client)"
        />
        <td class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar
            :firstname="client.firstname+client.middlename+client.lastname"
            class="w-24 h-24 mx-auto lg:w-6 lg:h-6"
          />
        </td>
        <td data-label="Name">
          {{ client.firstname+" "+client.middlename+" "+client.lastname }}
        </td>
        <td data-label="Company">
          Cebu City
        </td>
        <td data-label="City">
          {{ client.client_barangay }}
        </td>
        <td data-label="Progress" class="lg:w-32">
          <progress
            class="flex w-2/5 self-center lg:w-full"
            max="100"
            :value="80"
          >
            80
          </progress>
        </td>
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="client.created_on"
            >{{ moment(client.created_on).format('ll') }}</small
          ><br>
          <small class="text-gray-400 dark:text-slate-400">{{ moment(client.created_on).format('h:mm:ss a') }}</small>
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiNeedle"
              small
              data-bs-toggle="modal" 
              data-bs-target="#clientModal"
              @click="handleClientInfo(client.id)"
            />
            <BaseButton
              color="success"
              :icon="mdiAmbulance"
              small
              data-bs-toggle="modal" 
              data-bs-target="#referModal"
              @click="handleReferClient(client)"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="handleDeleteClient(client.id,client.firstname + ' ' + client.middlename + ' ' + client.lastname)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
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
</template>

