<script setup lang="ts">
  import { computed, ref, reactive, onMounted, watch } from "vue";
  import { useMainStore } from "@/stores/main";
  import { mdiTrashCan,mdiNeedle,mdiAmbulance } from "@mdi/js";
  import CardBoxModal from "@/components/CardBoxModal.vue";
  import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
  import BaseLevel from "@/components/BaseLevel.vue";
  import BaseButtons from "@/components/BaseButtons.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import UserAvatar from "@/components/UserAvatar.vue";
  import { getUserBarangay } from '@/api/auth'
  import { getAllClient,deleteClient } from "@/api/python"

  import moment from "moment"
  import { notify } from "notiwind"

  import { insertFirebase, readFirebase } from "@/utils/firebase.ts"

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

  //const mainStore = useMainStore();
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
    department: selectOptions[0],
    subject: "",
    question: "",
  });

  const get_barangay = ref([])

  onMounted(() => {
    _getUserBarangay()
    _getAllClient()
    _getBarangayInfo(1492)
  })

  const _getAllClient = async (params: {} = {}) => {
    const response = await getAllClient(params)
    data.value = await Promise.all(response.map(async (item: any) => {
        return {
          ...item
        }
    }))
    console.log(data.value)
  }

  const _getUserBarangay = async () => {
    const response = await getUserBarangay()
    get_barangay.value = await Promise.all(response.map(async (item: any) => {
        return {
          id : item.id,
          label: item.description
        }
    }))
  }

  const _getBarangayInfo = async (barangay_id:Number) => {
    const response = await getUserBarangay({ barangay_id:barangay_id })
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
    if(value.id) {
      console.log(value)
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

  const referClient = () => {
    insertFirebase()
  }

  readFirebase()
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Refer Client" button="success" has-cancel has-refer @refer="referClient">
    <FormField label="Barangay" class="mt-6">
      <FormControl v-model="form.department" :options="get_barangay" />
    </FormField>
    <FormField label="Remarks">
      <FormControl
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
      {{ checkedRow.name }}
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
              @click="isModalActive = true"
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

