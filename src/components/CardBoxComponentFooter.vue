<script setup lang="ts">
  import { reactive } from "vue";
  import {
    mdiBadgeAccount,
    mdiBallotOutline
  } from "@mdi/js";

  defineProps({
    client: {
      type: Object,
      default: {},
    }
  });

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
    is_active: true,
    created_by: 0,
    created_on: "",
    updated_on: ""
  });
  
  const getInfoClient = async (client:{}) => {
    form.id = client.id
    form.bhw_address = client.bhw_address
    form.bhw_contact_number = client.bhw_contact_number
    form.bhw_name = client.bhw_name
    form.birthdate = client.birthdate
    form.birthplace = client.birthplace
    form.client_address = client.client_address
    form.client_barangay = client.client_barangay
    form.created_by = client.created_by
    form.firstname = client.firstname
    form.guardian_address = client.guardian_address
    form.guardian_barangay = client.guardian_barangay
    form.guardian_alternate_number = client.guardian_alternate_number
    form.guardian_contact_number = client.guardian_contact_number
    form.guardian_name = client.guardian_name
    form.health_provider_address = client.health_provider_address
    form.health_provider_barangay = client.health_provider_barangay
    form.health_provider_contact = client.health_provider_contact
    form.health_provider_name = client.health_provider_name
    form.is_active = client.is_active
    form.lastname = client.lastname
    form.middlename = client.middlename
    form.sex = client.sex
    form.vaccine_id = client.vaccine_id
    form.created_on = client.created_on
    form.updated_on = client.updated_on
  }
</script>
<template>
  <footer class="p-6">
    <BaseButton
        label="Client Info"
        color="info"
        :icon="mdiBadgeAccount"
        small
        data-bs-toggle="modal" 
        data-bs-target="#exampleModalLg"
        @click="getInfoClient(client)"
      />
  </footer>

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
            
            <FormField class="text-xl">
              <FormField label="Middlename" class="text-sm">
                {{ form.middlename }}
              </FormField>
              <FormField label="Lastname" class="text-sm">
                {{ form.lastname }}
              </FormField>
            </FormField>

            <FormField class="text-xl">
              <FormField label="Birthdate" class="text-sm">
                {{ form.birthdate }}
              </FormField>
              <FormField label="Birthplace" class="text-sm">
                {{ form.birthplace }}
              </FormField>
            </FormField>

            <FormField label="Sex">
              {{ form.sex.charAt(0).toUpperCase() + form.sex.slice(1) }}
            </FormField>

            <FormField label="Client Address">
              {{ form.client_barangay }}
            </FormField>

            <BaseDivider />

            <FormField label="Name of Parents / Guardian">
              {{ form.guardian_name }}
            </FormField>

            <FormField class="text-xl">
              <FormField label="Guardian Contact Number" class="text-sm">
                {{ form.guardian_contact_number }}
              </FormField>
              <FormField label="Guardian Alternate Number" class="text-sm">
                {{ form.guardian_alternate_number }}
              </FormField>
            </FormField>

            <FormField label="Parent/Guardian Address">
              {{ form.guardian_barangay }}
            </FormField>

            <BaseDivider />

            <FormField label="Name of BHW">
              {{  form.bhw_name }}
            </FormField>

            <FormField >
              <FormField label="BHW contact number">
                {{ form.bhw_contact_number }}
              </FormField>
              <FormField label="BHW Address">
                {{ form.bhw_barangay }}
              </FormField>
            </FormField>

            <BaseDivider />

            <FormField label="Name of Health Provider">
              {{ form.health_provider_name }}
            </FormField>

            <FormField >
              <FormField label="Health Provider Contact Number">
                {{ form.health_provider_contact }}
              </FormField>
              <FormField label="Health Provider Address">
                {{ form.bhw_barangay }}
              </FormField>
            </FormField>

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

  