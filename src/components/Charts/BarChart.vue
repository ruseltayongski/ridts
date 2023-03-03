<script setup lang="ts">
  import { ref, watch, computed, onMounted } from "vue";
  import {
    Chart,
    LineElement,
    PointElement,
    LineController,
    LinearScale,
    CategoryScale,
    Tooltip,
    BarController,
    BarElement
  } from "chart.js";
  import { barChartData } from "@/api/python"
  import { getUserBarangayAssignment } from '@/api/auth'
  import { useUseridStore } from "@/stores"

  const props = defineProps({
    data: {
      type: Object,
      required: true,
    },
  });

  const root = ref(null);

  let chart;

  Chart.register(
    LineElement,
    PointElement,
    LineController,
    LinearScale,
    CategoryScale,
    Tooltip,
    BarController,
    BarElement
  );

  onMounted(() => {
    _barChartData()

    // chart = new Chart(root.value, {
    //   type: "line",
    //   data: props.data,
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     scales: {
    //       y: {
    //         display: false,
    //       },
    //       x: {
    //         display: true,
    //       },
    //     },
    //     plugins: {
    //       legend: {
    //         display: false,
    //       },
    //     },
    //   },
    // });
  });

  const chartData = computed(() => props.data);

  watch(chartData, (data) => {
    if (chart) {
      chart.data = data;
      chart.update();
    }
  });

  const _barChartData = async () => {
    const barangay_assign = await getUserBarangayAssignment({ userid: useUseridStore().value })
    const barangay_assignment = await Promise.all(barangay_assign.map(async (item: any) => item.id))
    const params = { barangay_assignment : barangay_assignment }
    const response = await barChartData(params)
    const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const data = {
      labels: labels,
      datasets: [{
        label: 'Client',
        data: response,
        backgroundColor: [
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)',
          'rgba(59, 130, 246, 0.2)'
        ],
        borderColor: [
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)',
          'rgb(52, 115, 217)'
        ],
        borderWidth: 1
      }]
    };
    new Chart(
      root.value,
      {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    );
  }
</script>

<template>
  <canvas ref="root" />
</template>