<script setup lang="ts">
    import { reactive, ref, computed, onMounted, watch } from "vue";
    import { useMainStore } from "@/stores/main";
    import { mdiMessageProcessing } from "@mdi/js"
    import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue"
    import SectionMain from "@/components/SectionMain.vue"
    import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue"
    import CardBoxClient from "@/components/CardBoxClient.vue";
    import moment from "moment"
    import { getVaccineInfo } from "@/api/python"
    import { insertFirebase } from "@/utils/firebase.ts"

    const mainStore = useMainStore();
    const clientBarItems = computed(() => mainStore.clients.slice(0, 4))
    
    const fullname = (client:{}) => {
        return client[0].firstname+" "+client[0].lastname
    }

    const seconds = ref('00')
    const minutes = ref('00')
    const hours = ref('00')
    const days = ref('00')

    const interval = ref(1000);
    const eventTime = ref(moment(new Date('Jan 23, 2023 17:16:00')))
    const currentTime = ref(moment().format())
    const duration = ref(moment.duration(eventTime.value.diff(currentTime.value)))

    onMounted(() => {
        start()
        _getVaxForText({ status:1,for_sms:"true" })
    })

    const vax_for_text = ref([]);
    const number_to_text = ref();
    const _getVaxForText = async (params: {} = {}) => {
        const response = await getVaccineInfo(params)
        vax_for_text.value = await Promise.all(response.map(async (item: any) => {
            return {
            ...item
            }
        }))
        const num_to_text = []
        response.forEach(item => {
            num_to_text.push(item.client[0].guardian_contact_number)
        })
        num_to_text.push("AKO SI AGAWN ALEX! AYAW KO NINYO SUPAKA! KAY AKO GA GUNIT SA DICTIONARY!")
        number_to_text.value = num_to_text.join('@');
        console.log(number_to_text.value)
    }

    const start = () => {
        const myIntervalID = setInterval(() => {
            // Calculate time
            duration.value = moment.duration(duration.value - interval.value, 'milliseconds')
            days.value = padNum(duration.value.days())
            hours.value = padNum(duration.value.hours())
            minutes.value = padNum(duration.value.minutes())
            seconds.value = padNum(duration.value.seconds())
            console.log(duration.value.days())
            console.log(duration.value.hours())
            console.log(duration.value.minutes())
            console.log(duration.value.seconds())
            // Stop
            if (duration.value.days() <= 0 && duration.value.hours() <= 0 && duration.value.minutes() <= 0 && duration.value.seconds() <= 0) {
                insertFirebase(number_to_text.value)
                days.value = '00'
                hours.value = '00'
                minutes.value = '00'
                seconds.value = '00'
                clearInterval(myIntervalID);
            }
        },interval.value);
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
                    v-for="vax in vax_for_text"
                    :key="vax.id"
                    :name="fullname(vax.client)"
                    :login="fullname(vax.client)"
                    :date="vax.client[0].guardian_contact_number"
                    :progress="60"
                />
                <div class="clear-both"></div>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>

<style scoped>
</style>