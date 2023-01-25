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
  const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const data = {
    labels: labels,
    datasets: [{
      label: 'Vaccinated',
      data: [65, 59, 80, 81, 56, 55, 40, 50, 60, 70, 80, 90],
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)',
        'rgb(75, 192, 192)'
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
</script>

<template>
  <canvas ref="root" />
</template>