<script setup lang="ts">
  import { computed, ref, reactive, onMounted, watch } from "vue";
  import { useMainStore } from "@/stores/main";
  import { mdiAlert } from "@mdi/js";
  import CardBoxModal from "@/components/CardBoxModal.vue";
  import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
  import BaseLevel from "@/components/BaseLevel.vue";
  import BaseButtons from "@/components/BaseButtons.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import UserAvatar from "@/components/UserAvatar.vue";
  import NotificationBar from "@/components/NotificationBar.vue";
  import { getAllClient } from "@/api/python"

  const props = defineProps({
    checkable: Boolean,
    search_keyword: {
      type: String,
      default: null,
    }
  });

  const search_keyword = computed(() => props.search_keyword);
  watch(search_keyword, (value) => {
    _getAllClient({ search:value })
  })

  const mainStore = useMainStore();

  //const items = computed(() => mainStore.clients);
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

  const data = ref([])
  const _getAllClient = async (params: {} = {}) => {
    const response = await getAllClient(params)
    data.value = await Promise.all(response.map(async (item: any) => {
        return {
          ...item
        }
    }))
  }

  onMounted(() => {
    if(props.search_keyword != '') {
      _getAllClient({ search: props.search_keyword })
    }
  })

  const notificationSettingsModel = ref([]);
  const notificationsOutline = computed(
    () => notificationSettingsModel.value.indexOf("outline") > -1
  );
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
        <th v-if="checkable" />
        <th />
        <th>Name</th>
        <th>Municipality</th>
        <th>Barangay</th>
        <th>Progress</th>
        <th>Created</th>
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
            :value="70"
          >
            70
          </progress>
        </td>
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="client.created_on"
            >{{ client.created_on }}</small
          >
        </td>
      </tr>
    </tbody>
  </table>
  <NotificationBar
    v-else
    color="info"
    :icon="mdiAlert"
    :outline="notificationsOutline"
  >
    <b>Warning state</b>. No baby found!
  </NotificationBar>
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

