<script setup lang="ts">
    import { ref, onMounted } from "vue";
    import { mdiMessageProcessing } from "@mdi/js"
    import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue"
    import SectionMain from "@/components/SectionMain.vue"
    import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue"
    import CardBoxClient from "@/components/CardBoxClient.vue";
    import moment from "moment"
    import { getVaccineInfo } from "@/api/python"
    import { insertFirebase } from "@/utils/firebase.ts"
    
    const seconds = ref('00')
    const minutes = ref('00')
    const hours = ref('00')
    const days = ref('00')

    const interval = ref(1000);
    //const static_date = ref(new Date(moment().format('ll')+' 15:00:00'))
    const static_date = ref(new Date())
    static_date.value.setMinutes(static_date.value.getMinutes() + 15);
    console.log(static_date.value)
    const eventTime = ref(moment(static_date.value))
    const currentTime = ref(moment().format())
    const duration = ref(moment.duration(eventTime.value.diff(currentTime.value)))

    const fullname = (client:{}) => {
        return client[0].firstname+" "+client[0].lastname
    }
    
    onMounted(() => {
        start()
        _getVaxForText({ status: 1,for_sms: "true", filter: "overall", vaccine_status: "-3days", lapse: -3 })
    })

    const vax_for_text = ref([]);
    const bhw_handler = ref([]);
    const _getVaxForText = async (params: {} = {}) => {
        const response = await getVaccineInfo(params)
        vax_for_text.value = await Promise.all(response.map(async (item: any) => {
            bhw_handler.value.push({
                ...item,
                contact: item.client[0].bhw_contact_number,
                fullname: fullname(item.client),
                handler_status: "BHW",
                isCompleted: ""
            })
            return {
                ...item,
                contact: item.client[0].guardian_contact_number,
                fullname: fullname(item.client),
                handler_status: "Parent",
                isCompleted: ""
            }
        }))
        bhw_handler.value.forEach((item) => {
            vax_for_text.value.push(item)
        })
        console.log(await vax_for_text.value)
        console.log(await bhw_handler.value)

        // for(let i = 0; i < 2; i++) {
        //     let item = {
        //         contact: "123123123",
        //         fullname: "John Doe",
        //         handler_status: "BHW",
        //         isCompleted: ""
        //     };
        //     vax_for_text.value.push(item);
        // }
    }

    const reminderTextProcess = () => {
        let counter = 0;
        vax_for_text.value.forEach((item,index) => {
            let sms_message = ""
            sms_message = "Reminders!\n\n"
            sms_message += "Baby "+item.client[0].firstname+" "+item.client[0].middlename+" "+item.client[0].lastname
            if(item.vaccine_type == 'bcg') {
                sms_message += " is scheduled for BCG Vaccination on"
                sms_message += " "+ moment(item.overall_scheduled).format('LL')+".";
                sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
                sms_message += "Ang bakuna nga BCG maga protekta sa mga bata batok sa sakit nga Tuberculosis o TB. Importante nga ang bata mabakunahan sa tukmang schedule arun siya ma depensahan batok sa maong sakit.\n\n"
                sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
                //insertFirebase(form.bhw_contact_number+"@"+form.guardian_contact_number+"@"+sms_message)
            }
            else if(item.vaccine_type == 'hepb') {
                sms_message += " is scheduled for HEPA B Vaccination on"
                sms_message += " "+ moment(item.overall_scheduled).format('LL')+".";
                sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
                sms_message += "\n\n"
                sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
            }
            else if(item.vaccine_type == 'pentavalent') {
                sms_message += " is scheduled for PENTAVALENT Vaccination on"
                sms_message += " "+ moment(item.overall_scheduled).format('LL')+".";
                sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
                sms_message += "Ang Pentavalent Vaccine maga protektar sa bata batok sa sakit nga Diptheria, Tetanus, Hepa B, Pertussis, Pneumonia ug Meningitis.\n\n"
                sms_message += "Importante nga ang bata mabakunahan sa tukmang schedule ug makompleto ang 3 ka dose sa bakuna arun siya ma depensahan batok sa maong mga sakit.\n\n" 
                sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
            }
            else if(item.vaccine_type == 'opv') {
                sms_message += " is scheduled for OPV Vaccination on"
                sms_message += " "+ moment(item.overall_scheduled).format('LL')+".";
                sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
                sms_message += "Ang bakuna nga OPV kon Oral Polio Vaccine maga protektar sa bata batok sa sakit nga Polio.\n\n"
                sms_message += "Importante nga ang bata mabakunahan sa tukmang schedule ug makompleto ang 3 ka dose sa bakuna arun siya ma depensahan batok sa maong mga sakit.\n\n"
                sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
            }
            else if(item.vaccine_type == 'ipv') {
                sms_message += " is scheduled for IPV Vaccination on"
                sms_message += " "+ moment(item.overall_scheduled).format('LL')+".";
                sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
                sms_message += "\n\n"
                sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
            }
            else if(item.vaccine_type == 'pcv') {
                sms_message += " is scheduled for PCV Vaccination on"
                sms_message += " "+ moment(item.overall_scheduled).format('LL')+"."; 
                sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
                sms_message += "Ang bakuna nga PCV kon Pneumococcal Conjugate Vaccine maga protektar sa bata batok sa sakit nga Pneumonia ug Meningitis.\n\n"
                sms_message += "Importante nga ang bata mabakunahan sa tukmang schedule ug makompleto ang 3 ka dose sa bakuna arun siya ma depensahan batok sa maong mga sakit.\n\n"
                sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
            }
            else if(item.vaccine_type == 'mcv') {
                sms_message += " is scheduled for MCV Vaccination on"
                sms_message += " "+ moment(item.overall_scheduled).format('LL')+".";
                sms_message += " Please come on your schedule and bring the vaccination card when you visit the Health Center.\n\n"
                sms_message += "\n\n"
                sms_message += "Ang bakuna luwas ug epektibo. Ang BAKUNADO ay PROTEKTADO!"
            }
            setTimeout(() => {
                console.log(item)
                item.isCompleted = "text-completed";
                insertFirebase(item.contact+"@"+sms_message)
                counter++
                if (counter == vax_for_text.value.length) {
                    console.log('Text blast finished!');
                }
            }, 10000 * (index + 1));
        })
    }

    const start = () => {
        const myIntervalID = setInterval(() => {
            console.log("tick")
            // Calculate time
            duration.value = moment.duration(duration.value - interval.value, 'milliseconds')
            days.value = padNum(duration.value.days())
            hours.value = padNum(duration.value.hours())
            minutes.value = padNum(duration.value.minutes())
            seconds.value = padNum(duration.value.seconds())
        },1000);

        const specifiedDate = static_date.value
        const currentDate = new Date();
        // calculate the overall seconds between the two dates
        const overallSeconds = Math.floor((specifiedDate.getTime() - currentDate.getTime()));
        setTimeout(function() {
            clearInterval(myIntervalID);
            days.value = '00'
            hours.value = '00'
            minutes.value = '00'
            seconds.value = '00'
            reminderTextProcess()
        }, overallSeconds);
    }

    const padNum = (num:Number) => {
        var zero = '';
        for (var i = 0; i < 2; i++) {
            zero += '0';
        }
        return (zero + num).slice(-2);
    }
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiMessageProcessing" title="Text blast for the 3 days before due date" main>
            </SectionTitleLineWithButton>
            <div class="min-w-screen h-80 bg-blue-500 flex items-center justify-center px-5 py-5">
                <div class="text-blue-100">
                    <h1 class="text-3xl text-center mb-3 font-extralight">Will pubs your baby to be vaccinated</h1>
                    <div class="text-6xl text-center flex w-full items-center justify-center">
                        <div class="text-2xl mr-1 font-extralight">in</div>
                        <div class="w-24 mx-1 p-2 bg-white text-blue-500 rounded-lg">
                            <div class="font-mono leading-none">{{ days }}</div>
                            <div class="font-mono uppercase text-sm leading-none">Days</div>
                        </div>
                        <div class="w-24 mx-1 p-2 bg-white text-blue-500 rounded-lg">
                            <div class="font-mono leading-none">{{ hours }}</div>
                            <div class="font-mono uppercase text-sm leading-none">Hours</div>
                        </div>
                        <div class="w-24 mx-1 p-2 bg-white text-blue-500 rounded-lg">
                            <div class="font-mono leading-none">{{ minutes }}</div>
                            <div class="font-mono uppercase text-sm leading-none">Minutes</div>
                        </div>
                        <div class="text-2xl mx-1 font-extralight">and</div>
                        <div class="w-24 mx-1 p-2 bg-white text-blue-500 rounded-lg">
                            <div class="font-mono leading-none">{{ seconds }}</div>
                            <div class="font-mono uppercase text-sm leading-none">Seconds</div>
                        </div>
                    </div>
                    <p class="text-sm text-center mt-3">*<a href="https://twitter.com/10DowningStreet/status/1363897254340419587" class="underline hover:text-yellow-200" target="_blank">waiting of API of</a>, Alex Jumao-as</p>
                </div>
            </div>
            <div class="grid gap-x-8 gap-y-1 lg:grid-cols-2 mb-6 mt-6">
                <CardBoxClient
                    v-for="(vax,index) in vax_for_text"
                    :key="vax.id"
                    :name="index+1+'.) '+vax.fullname"
                    :login="vax.handler_status"
                    :date="vax.contact"
                    :progress="60"
                    :class="vax.isCompleted"
                />
                <div class="clear-both"></div>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>

<style scoped>
    .text-completed {
        background-color:rgb(212, 235, 212);
    }
</style>