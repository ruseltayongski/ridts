<script setup lang="ts">
  import { computed, ref, reactive, onMounted } from "vue";
  import { useMainStore } from "@/stores/main";
  import { useMuncityDescriptionStore } from "@/stores"
  import { mdiBadgeAccount } from "@mdi/js";
  import CardBoxModal from "@/components/CardBoxModal.vue";
  import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
  import BaseLevel from "@/components/BaseLevel.vue";
  import BaseButtons from "@/components/BaseButtons.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import UserAvatar from "@/components/UserAvatar.vue";
  import { getUserBarangay,getUserBarangayAssignment } from '@/api/auth'
  import { useUseridStore } from "@/stores"
  import { clientMissed } from "@/api/python"
  import moment from "moment"
  import loadingModal from "@/assets/spin.gif"

  defineProps({
    checkable: Boolean,
  });

  const mainStore = useMainStore();

  const items = computed(() => data.value);

  const isModalActive = ref(false);

  const isModalDangerActive = ref(false);

  const perPage = ref(10);

  const currentPage = ref(0);

  const checkedRows = ref([]);

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
    _getAllClientArchived()
  })

  const data = ref([])
  const _getAllClientArchived = async (params: {} = {}) => {
    const barangay_assign = await getUserBarangayAssignment({ userid: useUseridStore().value })
    const barangay_assignment = await Promise.all(barangay_assign.map(async (item: any) => item.id))
    const response = await clientMissed({ barangay_assignment:barangay_assignment })
    let vaccine_type = ""
    data.value = await Promise.all(response.map(async (item: any) => {
        if(item.vaccine_type === 'bcg') {
            vaccine_type = "BCG"
        } else if(item.vaccine_type === 'hepb') {
            vaccine_type = "HepB"
        } else if(item.vaccine_type === 'pentavalent') {
            vaccine_type = "Pentavalent"
        } else if(item.vaccine_type === 'opv') {
            vaccine_type = "OPV"
        } else if(item.vaccine_type === 'ipv') {
            vaccine_type = 'IPV'
        } else if(item.vaccine_type === 'pcv') {
            vaccine_type = 'PCV'
        } else if(item.vaccine_type === 'mcv') {
            vaccine_type = 'MCV'
        }
        return {
            vaccine_type : vaccine_type,
            sex: item.client[0].sex.charAt(0).toUpperCase() + item.client[0].sex.slice(1),
            fullname: item.client[0].firstname+" "+item.client[0].middlename+" "+item.client[0].lastname,
            ...item.client[0]
        }
    }))
    emit("client-data",data.value)
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

  const emit = defineEmits(["client-info","client-data"])
  const handleClientInfo = (id:Number) => {
    emit("client-info", id);
  };
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Refer Client" button="success" has-cancel has-refer>
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
  >
    <p>Are you sure you want to delete this client?</p>
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

  <table v-if="itemsPaginated.length > 0">
    <thead>
      <tr>
        <!-- <th v-if="checkable" />
        <th /> -->
        <th>Name</th>
        <th>Municipality</th>
        <th>Barangay</th>
        <th>Vaccine Type</th>
        <!-- <th>Progress</th> -->
        <th>Created</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in itemsPaginated" :key="client.id">
        <!-- <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, client)"
        />
        <td class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar
          :firstname="client.firstname+client.middlename+client.lastname"
            class="w-24 h-24 mx-auto lg:w-6 lg:h-6"
          />
        </td> -->
        <td data-label="Name">
          {{ client.firstname+" "+client.middlename+" "+client.lastname }}
        </td>
        <td data-label="Company">
          {{ useMuncityDescriptionStore().value }}
        </td>
        <td data-label="City">
          {{ client.client_barangay }}
        </td>
        <td>{{ client.vaccine_type }}</td>
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
  <div class="flex flex-row mt-2 p-10" v-else>
    <img :src="loadingModal" alt="loading_gif" class="w-10 h-10">
    <p class="text-xl ml-2">Processing...</p>
  </div>
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