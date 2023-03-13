<script setup lang="ts">
  import { reactive, ref, computed, onMounted, watch, defineComponent } from "vue";
  import { useMainStore } from "@/stores/main";
  import { insertFirebase } from "@/utils/firebase.ts"
  import JsonExcel from "vue-json-excel3";
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
    mdiNeedle,
    mdiMicrosoftExcel
  } from "@mdi/js";
  import SectionMain from "@/components/SectionMain.vue";
  import NotificationBar from "@/components/NotificationBar.vue";
  import TableClients from "@/components/TableClients.vue";
  import CardBox from "@/components/CardBox.vue";
  import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
  import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
  import BaseButtons from "@/components/BaseButtons.vue";
  import BaseButton from "@/components/BaseButton.vue";
  import NotificationMessage from "@/components/NotificationMessage.vue";
  import { getUserBarangay, getUserMunicipality, getUserInfo, getUserBarangayAssignment,textBlast } from '@/api/auth'
  import { useUseridStore,useMuncityStore,useMuncityDescriptionStore } from "@/stores"

  import moment from "moment"
  import { notify } from "notiwind"
  import { createClient, getInfoClient, updateClient, getVaccineInfo, createVaccineInfo, updateVaccineInfo } from "@/api/python"
  import BaseIcon from "@/components/BaseIcon.vue";
  
  const search_keyword = ref("")
  const get_barangay = ref([])
  const get_municipality = ref({})
  
  const mainStore = useMainStore();
  const fullname = computed(() => mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname );

  const transactionBarItems = computed(() => mainStore.history);
  const clientBarItems = computed(() => mainStore.clients.slice(0, 4));

  const client_modal = ref<HTMLInputElement | null>(null)
  const el_client_modal = ref<HTMLInputElement | null>(null)

  const props_form = ref({})
  const button_label = ref("")
  const show_vaccine_type = ref(false)

  const emit = defineEmits(["loading-modal-open","loading-modal-close"]);

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
    muncity_id: useMuncityStore().value,
    muncity_description: useMuncityDescriptionStore().value,
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

  onMounted(() => {
    const min_date =  moment().format('Y-MM-DD')
    // if(document.getElementById('dt1'))
    //   document.getElementById('dt1').setAttribute('min', min_date)
    // if(document.getElementById('dt2'))
    //   document.getElementById('dt2').setAttribute('min', min_date)
    // if(document.getElementById('dt3'))  
    //   document.getElementById('dt3').setAttribute('min', min_date)
    // if(document.getElementById('dt4'))  
    //   document.getElementById('dt4').setAttribute('min', min_date)
    // if(document.getElementById('dt5'))
    //   document.getElementById('dt5').setAttribute('min', min_date)
    // if(document.getElementById('dt6'))
    //   document.getElementById('dt6').setAttribute('min', min_date)

    _getUserBarangay()
    _getUserMunicipality()
    //_getUserInfo()
    client_modal.value = new Modal(el_client_modal.value); //initialize modal instance
  })

  // const _getUserInfo = async () => {
  //   const response = await getUserInfo({ id : 1 })
  //   console.log(response)
  // }

  const _getUserBarangay = async () => {
    const barangay_assign = await getUserBarangayAssignment({ userid: useUseridStore().value })
    //const response = await getUserBarangay()
    get_barangay.value = await Promise.all(barangay_assign.map(async (item: any) => {
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
  }

  const schedule = reactive({
    client_id: 0,
    vaccine_type: "",
    given_1: "",
    given_2: "",
    given_3: "",
    given_administerred_1: "",
    given_administerred_2: "",
    given_administerred_3: "",
    scheduled_1: "",
    scheduled_2: "",
    scheduled_3: "",
    scheduled_administerred_1: "",
    scheduled_administerred_2: "",
    scheduled_administerred_3: "",
    status1: "",
    status2: "",
    status3: "",
    button_type1: "",
    button_type2: "",
    button_type3: "",
    updated_on: ""
  });

  const vaccine_button = reactive({
    bcg: "default",
    hepb: "default",
    pentavalent: "default",
    opv: "default",
    ipv: "default",
    pcv: "default",
    mcv: "default"
  });

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

  const dose_modal = ref<HTMLInputElement | null>(null)
  const el_dose_modal = ref<HTMLInputElement | null>(null)
  const handleVaccineInfo = async (vaccine_type:"") => {
    try {
      clearDose()
      const response = await getVaccineInfo({ client_id : form.id, vaccine_type: vaccine_type, status: 1 })
      console.log(response)

      schedule.client_id = form.id
      schedule.vaccine_type = vaccine_type
      if(response.length > 0) {
        emit("loading-modal-open")
        button_label.value = "Update"
        schedule.scheduled_1 = response[0].scheduled_1
        schedule.scheduled_2 = response[0].scheduled_2
        schedule.scheduled_3 = response[0].scheduled_3
        const scheduled_administerred_1 = await getUserInfo({ id : response[0].scheduled_administerred_1 })
        schedule.scheduled_administerred_1 = scheduled_administerred_1.fname+" "+scheduled_administerred_1.mname+" "+scheduled_administerred_1.lname
        const scheduled_administerred_2 = await getUserInfo({ id : response[0].scheduled_administerred_2 })
        schedule.scheduled_administerred_2 = scheduled_administerred_2.fname+" "+scheduled_administerred_2.mname+" "+scheduled_administerred_2.lname
        const scheduled_administerred_3 = await getUserInfo({ id : response[0].scheduled_administerred_3 })
        schedule.scheduled_administerred_3 = scheduled_administerred_3.fname+" "+scheduled_administerred_3.mname+" "+scheduled_administerred_3.lname
        schedule.given_1 = response[0].given_1
        schedule.given_2 = response[0].given_2
        schedule.given_3 = response[0].given_3
        const given_administerred_1 = await getUserInfo({ id : response[0].given_administerred_1 })
        schedule.given_administerred_1 = given_administerred_1.fname+" "+given_administerred_1.mname+" "+given_administerred_1.lname
        const given_administerred_2 = await getUserInfo({ id : response[0].given_administerred_2 })
        schedule.given_administerred_2 = given_administerred_2.fname+" "+given_administerred_2.mname+" "+given_administerred_2.lname
        const given_administerred_3 = await getUserInfo({ id : response[0].given_administerred_3 })
        schedule.given_administerred_3 = given_administerred_3.fname+" "+given_administerred_3.mname+" "+given_administerred_3.lname
        schedule.status1 = response[0].status1
        schedule.status2 = response[0].status2
        schedule.status3 = response[0].status3
        schedule.button_type1 = response[0].button_type1
        schedule.button_type2 = response[0].button_type2
        schedule.button_type3 = response[0].button_type3
        emit("loading-modal-close")
      } else {
        button_label.value = "Submit"
      }
      schedule.updated_on = moment().format('YYYY-MM-DD HH:mm:ss')
      
      dose_modal.value = new Modal(el_dose_modal.value); //initialize modal instance
      dose_modal.value?.show()
    } catch (error) {
      console.error(error)
      alert("There was something wrong, will restart your page.")
      window.location.reload()
    }
  }

  const clientSubmit = async () => {
    try {
      emit("loading-modal-open")
      const client_barangay = await getUserBarangay({ barangay_id:form.client_address })
      form.client_barangay = client_barangay.description
      const guardian_barangay = await getUserBarangay({ barangay_id:form.guardian_address })
      form.guardian_barangay = guardian_barangay.description
      const bhw_barangay = await getUserBarangay({ barangay_id:form.bhw_address })
      form.bhw_barangay = bhw_barangay.description
      const health_provider_barangay = await getUserBarangay({ barangay_id:form.health_provider_address })
      form.health_provider_barangay = health_provider_barangay.description
      form.created_by = mainStore.userId
    
      let message = ""
      let status = ""
      if(form.id) {
        message = "Client was successfully updated!"
        form.updated_on = moment().format('YYYY-MM-DD HH:mm:ss')
        await updateClient(form) // update into mongo db
        status = "updated"
      } else {
        message = "Client was successfully added!"
        form.created_on = moment().format('YYYY-MM-DD HH:mm:ss')
        const create_response = await createClient(form) // insert into mongo db
        form.id = create_response.id
        status = "created"
      }

      props_form.value = {
        id : form.id,
        firstname : form.firstname,
        middlename : form.middlename,
        lastname : form.lastname,
        fullname : form.firstname+" "+form.middlename+" "+form.lastname,
        client_barangay : form.client_barangay,
        status : status,
        client_address : form.client_address,
        muncity_description : form.muncity_description
      } //send to props

      console.log(props_form.value)

      clearClientForm()

      client_modal.value?.hide();
      emit("loading-modal-close")

      notify({
        group: "success",
        title: "Success",
        text: message
      }, 2000)
    } catch (error) {
      console.error(error)
      alert("There was something wrong, will restart your page.")
      window.location.reload()
    }
  };

  const clearClientForm = async (option:String = "") => {
    form.vaccine_id = "LLC # "+mainStore.userId + "-" + moment().format('YYYYMMDDHHmmss')+String(Math.random()).substring(0, 3).split('.').join("")
    form.id = 0
    
    if(option != "create")
      form.vaccine_id = ""
    
    form.firstname = ""
    form.middlename = ""
    form.lastname = ""
    form.birthdate = ""
    form.birthplace = ""
    form.sex = ""
    form.client_address = 0
    form.client_barangay = ""
    form.guardian_name = ""
    form.guardian_contact_number = ""
    form.guardian_alternate_number = ""
    form.guardian_address = 0
    form.guardian_barangay = ""
    form.bhw_name = ""
    form.bhw_contact_number = ""
    form.bhw_address = 0
    form.bhw_barangay = ""
    form.health_provider_name = ""
    form.health_provider_contact = ""
    form.health_provider_address = 0
    form.health_provider_barangay = ""
    form.remarks = ""
    form.is_active = true
    form.created_by = 0
    form.created_on = ""
    form.updated_on = ""
  }

  const clearDose = async () => {
    schedule.given_1 = ""
    schedule.given_2 = ""
    schedule.given_3 = ""
    schedule.given_administerred_1 = ""
    schedule.given_administerred_2 = ""
    schedule.given_administerred_3 = ""
    schedule.scheduled_1 = ""
    schedule.scheduled_2 = ""
    schedule.scheduled_3 = ""
    schedule.scheduled_administerred_1 = ""
    schedule.scheduled_administerred_2 = ""
    schedule.scheduled_administerred_3 = ""
    schedule.status1 = ""
    schedule.status2 = ""
    schedule.status3 = ""
    schedule.button_type1 = ""
    schedule.button_type2 = ""
    schedule.button_type3 = ""
  }

  const doseSubmit = async () => {
    try {
      dose_modal.value?.hide();
      const vaccine_info_save = {
          client_id: schedule.client_id,
          vaccine_type: schedule.vaccine_type,
          scheduled_administerred_1: schedule.scheduled_1 ? mainStore.userId : 0,
          scheduled_administerred_2: schedule.scheduled_2 ? mainStore.userId : 0,
          scheduled_administerred_3: schedule.scheduled_3 != "" ? mainStore.userId : 0,
          given_administerred_1: schedule.given_1 || schedule.given_administerred_1 != "" ? mainStore.userId : 0,
          given_administerred_2: schedule.given_2 || schedule.given_administerred_2 != "" ? mainStore.userId : 0,
          given_administerred_3: schedule.given_3 || schedule.given_administerred_3 != "" ? mainStore.userId : 0,
          updated_on: moment(schedule.updated_on).format('YYYY-MM-DD HH:mm:ss'),
          Client: [schedule.client_id]
      }

      vaccine_info_save.scheduled_1 = schedule.scheduled_1 ? moment(schedule.scheduled_1).format('YYYY-MM-DD') : null
      vaccine_info_save.scheduled_2 = schedule.scheduled_2 ? moment(schedule.scheduled_2).format('YYYY-MM-DD') : null
      vaccine_info_save.scheduled_3 = schedule.scheduled_3 ? moment(schedule.scheduled_3).format('YYYY-MM-DD') : null
      vaccine_info_save.given_1 = schedule.given_1 ? moment(schedule.given_1).format('YYYY-MM-DD') : null
      vaccine_info_save.given_2 = schedule.given_2 ? moment(schedule.given_2).format('YYYY-MM-DD') : null
      vaccine_info_save.given_3 = schedule.given_3 ? moment(schedule.given_3).format('YYYY-MM-DD') : null
      vaccine_info_save.created_on = moment().format('YYYY-MM-DD HH:mm:ss')
    
      console.log(vaccine_info_save)
      console.log(button_label.value)

      if(button_label.value == "Update")
        await updateVaccineInfo(vaccine_info_save)
      else {
        await createVaccineInfo(vaccine_info_save)    
      }

      vaccine_button[schedule.vaccine_type] = await Promise.resolve(handleDose3(form.id,schedule.vaccine_type))
      
      let sms_message = ""
      sms_message = "Congratulations!\n\n"
      sms_message += "Baby "+form.firstname+" "+form.middlename+" "+form.lastname
      if(schedule.vaccine_type == 'bcg') {
        sms_message += " is scheduled for BCG Vaccination on"
        sms_message += " "+ moment(vaccine_info_save.scheduled_1).format('LL')+".";
        sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
        sms_message += "Ang bakuna nga BCG maga protekta sa mga bata batok sa sakit nga Tuberculosis o TB. Importante nga ang bata mabakunahan sa tukmang schedule arun siya ma depensahan batok sa maong sakit.\n\n"
        sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
        if(vaccine_info_save.scheduled_1) {
          if(!vaccine_info_save.given_1) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
            //await sendTextBlast(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        }
      }
      else if(schedule.vaccine_type == 'hepb') {
        sms_message += " is scheduled for HEPA B Vaccination on"
        sms_message += " "+ moment(vaccine_info_save.scheduled_1).format('LL')+".";
        sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
        sms_message += "\n\n"
        sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
        if(vaccine_info_save.scheduled_1) {
          if(!vaccine_info_save.given_1) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        }
      }
      else if(schedule.vaccine_type == 'pentavalent') {
        sms_message += " is scheduled for PENTAVALENT Vaccination on"
        if(vaccine_info_save.scheduled_3) {
          sms_message += " "+ moment(vaccine_info_save.scheduled_3).format('LL')+".";
        } else if(vaccine_info_save.scheduled_2) {
          sms_message += " "+ moment(vaccine_info_save.scheduled_2).format('LL')+".";
        } else {
          sms_message += " "+ moment(vaccine_info_save.scheduled_1).format('LL')+".";
        }
        sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
        sms_message += "Ang Pentavalent Vaccine maga protektar sa bata batok sa sakit nga Diptheria, Tetanus, Hepa B, Pertussis, Pneumonia ug Meningitis.\n\n"
        sms_message += "Importante nga ang bata mabakunahan sa tukmang schedule ug makompleto ang 3 ka dose sa bakuna arun siya ma depensahan batok sa maong mga sakit.\n\n" 
        sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
        if(vaccine_info_save.scheduled_3) {
          if(!vaccine_info_save.given_3) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        } else if(vaccine_info_save.scheduled_2) {
          if(!vaccine_info_save.given_2) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        } else if(vaccine_info_save.scheduled_1) {
          if(!vaccine_info_save.given_1) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        }
      }
      else if(schedule.vaccine_type == 'opv') {
        sms_message += " is scheduled for OPV Vaccination on"
        if(vaccine_info_save.scheduled_3) {
          sms_message += " "+ moment(vaccine_info_save.scheduled_3).format('LL')+".";
        } else if(vaccine_info_save.scheduled_2) {
          sms_message += " "+ moment(vaccine_info_save.scheduled_2).format('LL')+".";
        } else {
          sms_message += " "+ moment(vaccine_info_save.scheduled_1).format('LL')+".";
        }
        sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
        sms_message += "Ang bakuna nga OPV kon Oral Polio Vaccine maga protektar sa bata batok sa sakit nga Polio.\n\n"
        sms_message += "Importante nga ang bata mabakunahan sa tukmang schedule ug makompleto ang 3 ka dose sa bakuna arun siya ma depensahan batok sa maong mga sakit.\n\n"
        sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
        if(vaccine_info_save.scheduled_3) {
          if(!vaccine_info_save.given_3) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        } else if(vaccine_info_save.scheduled_2) {
          if(!vaccine_info_save.given_2) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        } else if(vaccine_info_save.scheduled_1) {
          if(!vaccine_info_save.given_1) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        }
      }
      else if(schedule.vaccine_type == 'ipv') {
        sms_message += " is scheduled for IPV Vaccination on"
        sms_message += " "+ moment(vaccine_info_save.scheduled_1).format('LL')+".";
        sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
        sms_message += "\n\n"
        sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
        if(vaccine_info_save.scheduled_1) {
          if(!vaccine_info_save.given_1) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        }
      }
      else if(schedule.vaccine_type == 'pcv') {
        sms_message += " is scheduled for PCV Vaccination on"
        if(vaccine_info_save.scheduled_3) {
          sms_message += " "+ moment(vaccine_info_save.scheduled_3).format('LL')+".";
        } else if(vaccine_info_save.scheduled_2) {
          sms_message += " "+ moment(vaccine_info_save.scheduled_2).format('LL')+".";
        } else {
          sms_message += " "+ moment(vaccine_info_save.scheduled_1).format('LL')+".";
        } 
        sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
        sms_message += "Ang bakuna nga PCV kon Pneumococcal Conjugate Vaccine maga protektar sa bata batok sa sakit nga Pneumonia ug Meningitis.\n\n"
        sms_message += "Importante nga ang bata mabakunahan sa tukmang schedule ug makompleto ang 3 ka dose sa bakuna arun siya ma depensahan batok sa maong mga sakit.\n\n"
        sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
        if(vaccine_info_save.scheduled_3) {
          if(!vaccine_info_save.given_3) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        } else if(vaccine_info_save.scheduled_2) {
          if(!vaccine_info_save.given_2) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        } else if(vaccine_info_save.scheduled_1) {
          if(!vaccine_info_save.given_1) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        }
      }
      else if(schedule.vaccine_type == 'mcv') {
        sms_message += " is scheduled for MCV Vaccination on"
        if(vaccine_info_save.scheduled_2) {
          sms_message += " "+ moment(vaccine_info_save.scheduled_2).format('LL')+".";
        } else {
          sms_message += " "+ moment(vaccine_info_save.scheduled_1).format('LL')+".";
        }  
        sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
        sms_message += "\n\n"
        sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
        if(vaccine_info_save.scheduled_2) {
          if(!vaccine_info_save.given_2) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        } else if(vaccine_info_save.scheduled_1) {
          if(!vaccine_info_save.given_1) {
            insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
          }
        }
      }
        
      notify({
        group: "success_dose",
        title: "Success",
        text: "Vaccine info was successfully updated!"
      }, 2000)
    } catch(error) {
      console.error(error); // return error
      alert("There was something wrong, will restart your page.")
      window.location.reload()
    }
  };

  const handleClientInfo = async (id:Number) => {
      show_vaccine_type.value = true
      _getInfoClient(id)
  };

  const _getInfoClient = async (id:Number) => {
    button_label.value = "Update"
    const response = await getInfoClient({ id : id })
    console.log(response)
    form.id = response.id
    form.bhw_address = response.bhw_address
    form.bhw_contact_number = response.bhw_contact_number
    form.bhw_name = response.bhw_name
    form.birthdate = response.birthdate
    form.birthplace = response.birthplace
    form.client_address = response.client_address
    form.client_barangay = response.client_barangay
    form.created_by = response.created_by
    form.guardian_address = response.guardian_address
    form.guardian_barangay = response.guardian_barangay
    form.guardian_alternate_number = response.guardian_alternate_number
    form.guardian_contact_number = response.guardian_contact_number
    form.guardian_name = response.guardian_name
    form.health_provider_address = response.health_provider_address
    form.health_provider_barangay = response.health_provider_barangay
    form.health_provider_contact = response.health_provider_contact
    form.health_provider_name = response.health_provider_name
    form.remarks = response.remarks
    form.is_active = response.is_active
    form.firstname = response.firstname
    form.lastname = response.lastname
    form.middlename = response.middlename
    form.sex = response.sex
    form.vaccine_id = response.vaccine_id
    form.created_on = response.created_on
    form.updated_on = response.updated_on

    vaccine_button.pentavalent = await Promise.resolve(handleDose3(form.id,'pentavalent'))
    vaccine_button.opv = await Promise.resolve(handleDose3(form.id,'opv'))
    vaccine_button.pcv = await Promise.resolve(handleDose3(form.id,'pcv'))
    vaccine_button.mcv = await Promise.resolve(handleDose2(form.id,'mcv'))
    vaccine_button.bcg = await Promise.resolve(handleDose1(form.id,'bcg'))
    vaccine_button.hepb = await Promise.resolve(handleDose1(form.id,'hepb'))
    vaccine_button.ipv = await Promise.resolve(handleDose1(form.id,'ipv'))

    console.log(vaccine_button)
  }

  const handleDose3 = async (client_id:Number,vaccine_type:String) => {
    const response = await getVaccineInfo({ client_id : client_id, vaccine_type: vaccine_type, status: 1 })
    if(response.length > 0) {
      if(response[0].scheduled_3 != "") {
        return response[0].button_type3
      }
      else if(response[0].scheduled_2 != "") {
        return response[0].button_type2
      }
      else if(response[0].scheduled_1 != "") {
        return response[0].button_type1
      }
    } else {
      return ""
    }
  }

  const handleDose2 = async (client_id:Number,vaccine_type:String) => {
    const response = await getVaccineInfo({ client_id : client_id, vaccine_type: vaccine_type, status: 1 })
    if(response.length > 0) {
      if(response[0].scheduled_2 != "")
        return response[0].button_type2
      else if(response[0].scheduled_1 != "")
        return response[0].button_type1
    } else {
      return ""
    }
    
  }

  const handleDose1 = async (client_id:Number,vaccine_type:String) => {
    const response = await getVaccineInfo({ client_id : client_id, vaccine_type: vaccine_type, status: 1 })
    if(response.length > 0) {
      if(response[0].scheduled_1 != "")
        return response[0].button_type1
    } else {
      return ""
    }
  }

  const handleSearchClient = async (payload:"") => {
      search_keyword.value = payload
  };

  const handleCreateClient = () => {
      button_label.value = "Submit"
      show_vaccine_type.value = false
      clearClientForm("create")
  };

  const given_1 = computed(() => schedule.given_1);
  watch(given_1, (value) => {
    console.log(value)
    schedule.given_administerred_1 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const given_2 = computed(() => schedule.given_2);
  watch(given_2, (value) => {
    console.log(value)
    schedule.given_administerred_2 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const given_3 = computed(() => schedule.given_3);
  watch(given_3, (value) => {
    console.log(value)
    schedule.given_administerred_3 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const schedule_1 = computed(() => schedule.scheduled_1);
  watch(schedule_1, (value) => {
    console.log(value)
    schedule.scheduled_administerred_1 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const schedule_2 = computed(() => schedule.scheduled_2);
  watch(schedule_2, (value) => {
    console.log(value)
    schedule.scheduled_administerred_2 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const schedule_3 = computed(() => schedule.scheduled_3);
  watch(schedule_3, (value) => {
    console.log(value)
    schedule.scheduled_administerred_3 = mainStore.userFirstname + " " + mainStore.userMiddlename + " " + mainStore.userLastname
  })

  const sendTextBlast = async (message:String) => {
    await textBlast({ message: message, to:"eN0lsyKOTK-3alOQSopGnb:APA91bF1yFP8QfvUr7lZZ9WfS39y6SD--bVcco7hqFx_SKAuOyCrSHNxvIFz5HSiPum5kjrnwqZ76XJGzTiGQKF0pi39a69vnYGbdMa3OX8Lhe7lnNBt_be_qqLKE53eao_wO0FIXsd5" })
  }

  const startDownloadExcel = () => {
    emit("loading-modal-open")
  }

  const finishDownloadExcel = () => {
    setTimeout(function(){
      emit("loading-modal-close")
    }, 1000);
  }

  const json_fields = ref({
    "Vaccine ID": "vaccine_id",
    "Fullname": "fullname",
    "Birth Date": "birthdate",
    "Birth Place": "birthplace",
    "Sex" : "sex",
    "Guardian Name": "guardian_name",
    "Guardian Contact #": "guardian_contact_number",
    "Guardian Alternate Number": "guardian_alternate_number",
    "Guardian Address": "guardian_barangay",
    "BHW Name": "bhw_name",
    "BHW Contact #": "bhw_contact_number",
    "BHW Address": "bhw_barangay",
    "Health Provider Name": "health_provider_name",
    "Health Provider Contact #": "health_provider_contact",
    "Health Provider Address": "health_provider_barangay",
    "Municipality": "muncity_description",
    "Barangay": "client_barangay",
    "Created On" : "created_on"
  })

  const client_data = ref([])
  const handleClientData = async (data:any) => {
      console.log(data)
      client_data.value = data
  }

</script>

<template>
  <LayoutAuthenticated @search-client="handleSearchClient">
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBabyFaceOutline" title="Clients for new born baby" main>
        <div class="flex gap-4">
            <json-excel
              class="inline-flex justify-center items-center whitespace-nowrap focus:outline-none transition-colors focus:ring duration-150 border cursor-pointer rounded border-yellow-600 dark:border-yellow-500 ring-yellow-300 dark:ring-yellow-700 bg-yellow-600 dark:bg-yellow-500 text-white hover:bg-yellow-700 hover:border-yellow-700 hover:dark:bg-yellow-600 hover:dark:border-yellow-600 py-2 px-3"
              :data="client_data"
              :fields="json_fields"
              :before-generate = "finishDownloadExcel"
              :before-finish   = "startDownloadExcel"
              worksheet="Vaccinated"
              name="clients.xls"
            >
              <BaseIcon :path="mdiMicrosoftExcel"/> Download Excel
            </json-excel>
          <BaseButton @click="handleCreateClient" type="button" color="info" label="Create" :icon="mdiAccountPlus" data-bs-toggle="modal" data-bs-target="#clientModal"/>
        </div>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" has-table>
        <TableClients @client-info="handleClientInfo" @client-data="handleClientData" :search_keyword="search_keyword" :form="props_form" checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>

  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" ref="el_client_modal" id="clientModal" data-bs-backdrop="static" aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg relative w-auto pointer-events-none">
      <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
        <div class="modal-body relative p-4">
          <SectionTitleLineWithButton
            :icon="mdiBallotOutline"
            title="Client Info"
            main
          >
          </SectionTitleLineWithButton>

          <NotificationMessage></NotificationMessage>

          <CardBox is-form @submit.prevent="clientSubmit">
            <FormField label="Personal Information" class="text-xl">
              <FormField label="Vaccine Card Number ID" class="text-sm">
                <FormControl v-model="form.vaccine_id" :icon="mdiCardBulletedSettings" :readonly="true"/>
              </FormField>
              <FormControl v-model="form.firstname" :icon="mdiAccount" class="mt-7" placeholder="Firstname" required/>
            </FormField>
            
            <FormField>
              <FormControl v-model="form.middlename" :icon="mdiAccount" placeholder="Middlename" required/>
              <FormControl v-model="form.lastname" :icon="mdiAccount" placeholder="Lastname" required/>
            </FormField>

            <FormField>
              <FormField label="Birthdate">
                <FormControl v-model="form.birthdate" type="date" :icon="mdiCalendarEditOutline" required/>
              </FormField>
              <FormControl v-model="form.birthplace" :icon="mdiHomeCityOutline" class="mt-8" placeholder="Birthplace" required/>
            </FormField>

            <FormField label="Sex">
              <FormCheckRadioGroup
                v-model="form.sex"
                name="sex"
                type="radio"
                :options="{ male: 'Male', female: 'Female' }"
              />
            </FormField>

            <FormField label="Client Address">
              <FormControl v-model="form.client_address" :options="get_barangay"/>
            </FormField>

            <BaseDivider />

            <FormField label="Name of Parents / Guardian">
              <FormControl v-model="form.guardian_name" :icon="mdiAccount" placeholder="Firstname Middlename Lastname" required/>
            </FormField>

            <FormField >
              <FormControl v-model="form.guardian_contact_number" :icon="mdiCardAccountPhoneOutline" placeholder="Contact Number" required/>
              <FormControl v-model="form.guardian_alternate_number" :icon="mdiCardAccountPhoneOutline" placeholder="Alternate Number" required/>
            </FormField>

            <FormField label="Parent/Guardian Address">
              <FormControl v-model="form.guardian_address" :options="get_barangay" required/>
            </FormField>

            <BaseDivider />

            <FormField label="Name of BHW">
              <FormControl v-model="form.bhw_name" :icon="mdiAccount" placeholder="Firstname Middlename Lastname" required/>
            </FormField>

            <FormField >
              <FormField label="BHW contact number">
                <FormControl v-model="form.bhw_contact_number" :icon="mdiCardAccountPhoneOutline" placeholder="Contact Number" required/>
              </FormField>
              <FormField label="BHW Address">
                <FormControl v-model="form.bhw_address" :options="get_barangay" required/>
              </FormField>
            </FormField>

            <BaseDivider />

            <FormField label="Name of Health Provider">
              <FormControl v-model="form.health_provider_name" :icon="mdiAccount" placeholder="Firstname Middlename Lastname"/>
            </FormField>

            <FormField >
              <FormField label="Health Provider Contact Number">
                <FormControl v-model="form.health_provider_contact" :icon="mdiCardAccountPhoneOutline" placeholder="Contact Number"/>
              </FormField>
              <FormField label="Health Provider Address">
                <FormControl v-model="form.health_provider_address" :options="get_barangay"/>
              </FormField>
            </FormField>

            <FormField label="Remarks">
              <FormControl
                v-model="form.remarks"
                type="textarea"
                required
              />
            </FormField>

            <BaseDivider v-if="show_vaccine_type"/>

            <FormField label="Vaccine Type" v-if="show_vaccine_type">
              <BaseButtons>
                <BaseButton
                  :color="vaccine_button.bcg"
                  label="BCG"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('bcg')"
                />
                <BaseButton
                  :color="vaccine_button.hepb"
                  label="HepB"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('hepb')"
                />
                <BaseButton
                  :color="vaccine_button.pentavalent"
                  label="Pentavalent"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('pentavalent')"
                />
                <BaseButton
                  :color="vaccine_button.opv"
                  label="OPV"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('opv')"
                />
                <BaseButton
                  :color="vaccine_button.ipv"
                  label="IPV"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('ipv')"
                />
                <BaseButton
                  :color="vaccine_button.pcv"
                  label="PCV"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('pcv')"
                />
                <BaseButton
                  :color="vaccine_button.mcv"
                  label="MCV"
                  :icon="mdiNeedle"
                  :small="buttonsSmall"
                  :outline="buttonsOutline"
                  :disabled="buttonsDisabled"
                  :rounded-full="buttonsRounded"
                  @click="handleVaccineInfo('mcv')"
                />
              </BaseButtons>
            </FormField>

            <BaseDivider />
            
            <BaseButtons>
              <BaseButton type="submit" color="info" :label="button_label" />
              <BaseButton type="button" color="info" outline label="Close" data-bs-dismiss="modal" aria-label="Close"/>
            </BaseButtons>
          </CardBox>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" id="vaccineeModal" data-bs-backdrop="static" ref='el_dose_modal' aria-labelledby="exampleModalLgLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-md relative w-auto pointer-events-none border-4 border-indigo-500/100">
      <div class="modal-content border-none shadow-sm relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
        <div class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
          <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalLgLabel">
            Dose Schedule
          </h5>
          <button type="button"
            class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
            data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body relative p-4">
          <CardBox is-form @submit.prevent="doseSubmit">
            <FormField label="1st Dose" :status="schedule.status1" :button_type="schedule.button_type1">
              <FormField label="Date Scheduled" :help="schedule.scheduled_1 ? schedule.scheduled_administerred_1 : ''">
                <FormControl id="dt1" v-model="schedule.scheduled_1" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Scheduled"/>
              </FormField>
              <FormField label="Date Given" :help="schedule.given_1 ? schedule.given_administerred_1 : ''">
                <FormControl id="dt2" v-model="schedule.given_1" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Given"/>
              </FormField>
            </FormField>
                      
            <FormField v-if="schedule.vaccine_type =='mcv' || schedule.vaccine_type =='pentavalent' || schedule.vaccine_type =='opv' || schedule.vaccine_type =='pcv'" label="2nd Dose" :status="schedule.status2" :button_type="schedule.button_type2">
              <FormField label="Date Scheduled" :help="schedule.scheduled_2 ? schedule.scheduled_administerred_2 : ''">
                <FormControl id="dt3" v-model="schedule.scheduled_2" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Scheduled"/>
              </FormField>
              <FormField label="Date Given" :help="schedule.given_2 ? schedule.given_administerred_2 : ''">
                <FormControl id="dt4" v-model="schedule.given_2" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Given"/>
              </FormField>
            </FormField>

            <FormField v-if="schedule.vaccine_type =='pentavalent' || schedule.vaccine_type =='opv' || schedule.vaccine_type =='pcv'" label="3rd Dose" :status="schedule.status3" :button_type="schedule.button_type3">
              <FormField label="Date Scheduled" :help="schedule.scheduled_3 ? schedule.scheduled_administerred_3 : ''">
                <FormControl id="dt5" v-model="schedule.scheduled_3" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Scheduled"/>
              </FormField>
              <FormField label="Date Given" :help="schedule.given_3 ? schedule.given_administerred_3 : ''">
                <FormControl id="dt6" v-model="schedule.given_3" type="date" :icon="mdiCalendarEditOutline" placeholder="Date Given"/>
              </FormField>
            </FormField>

            <BaseButtons>
              <BaseButton type="submit" color="info" :label="button_label" />
              <BaseButton type="button" color="info" outline label="Close" data-bs-dismiss="modal" aria-label="Close"/>
            </BaseButtons>

          </CardBox>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
  /* @import '@/css/main.css'; */
</style>
