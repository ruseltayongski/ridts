<script setup lang="ts">
    import { reactive, ref, computed, onMounted, watch } from "vue";
    import { mdiMessageProcessing } from "@mdi/js"
    import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue"
    import SectionMain from "@/components/SectionMain.vue"
    import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue"
    

    const seconds = ref('00')
    const minutes = ref('00')
    const hours = ref('00')
    const days = ref('00')
    const countdown = ref()
    const beerTime = ref(new Date('May 17, 2023 00:00:00').getTime())
    const now = ref()
    const distance = ref(0)

    onMounted(() => {
        start()
    })

    const start = () => {
        setInterval(() => {
            // Calculate time
            now.value = new Date().getTime()
            distance.value = beerTime.value = now.value
            // Set Times
            days.value = padNum( Math.floor(distance.value / (1000*60*60*24)) );
                hours.value = padNum( Math.floor((distance.value % (1000*60*60*24)) / (1000*60*60)) );
                minutes.value = padNum( Math.floor((distance.value % (1000*60*60)) / (1000*60)) );
                seconds.value = padNum( Math.floor((distance.value % (1000*60)) / 1000) );
                // Stop
                if (distance.value < 0) {
                    clearInterval(countdown.value);
                    days.value = '00';
                    hours.value = '00';
                    minutes.value = '00';
                    seconds.value = '00';
                }
        },100);
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
            <div class="min-w-screen h-80 bg-yellow-500 flex items-center justify-center px-5 py-5">
                <div class="text-yellow-100">
                    <h1 class="text-3xl text-center mb-3 font-extralight">Will pubs to your baby to be vaccinated</h1>
                    <div class="text-6xl text-center flex w-full items-center justify-center">
                        <div class="text-2xl mr-1 font-extralight">in</div>
                        <div class="w-24 mx-1 p-2 bg-white text-yellow-500 rounded-lg">
                            <div class="font-mono leading-none">{{ days }}</div>
                            <div class="font-mono uppercase text-sm leading-none">Days</div>
                        </div>
                        <div class="w-24 mx-1 p-2 bg-white text-yellow-500 rounded-lg">
                            <div class="font-mono leading-none">{{ hours }}</div>
                            <div class="font-mono uppercase text-sm leading-none">Hours</div>
                        </div>
                        <div class="w-24 mx-1 p-2 bg-white text-yellow-500 rounded-lg">
                            <div class="font-mono leading-none">{{ minutes }}</div>
                            <div class="font-mono uppercase text-sm leading-none">Minutes</div>
                        </div>
                        <div class="text-2xl mx-1 font-extralight">and</div>
                        <div class="w-24 mx-1 p-2 bg-white text-yellow-500 rounded-lg">
                            <div class="font-mono leading-none">{{ seconds }}</div>
                            <div class="font-mono uppercase text-sm leading-none">Seconds</div>
                        </div>
                    </div>
                    <!-- <p class="text-sm text-center mt-3">*<a href="https://twitter.com/10DowningStreet/status/1363897254340419587" class="underline hover:text-yellow-200" target="_blank">As per goverment plan</a>. Subject to change.</p> -->
                </div>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>

<style scoped>

</style>