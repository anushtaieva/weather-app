<template>
  <canvas ref="chartRef"></canvas>
</template>

<script setup>
import {
  onMounted,
  watch,
  ref
} from 'vue'

import Chart from 'chart.js/auto'

const props = defineProps({
  labels: Array,
  temperatures: Array
})

const chartRef = ref(null)

let chart = null

const renderChart = () => {
  if (!chartRef.value) return

  if (chart) {
    chart.destroy()
  }

  chart = new Chart(chartRef.value, {
    type: 'line',

    data: {
      labels: props.labels,

      datasets: [
        {
          label: 'Temperature',

          data: props.temperatures,

          tension: 0.45,
          borderWidth: 4,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          borderColor: '#ff74ad',
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#ff74ad',
          backgroundColor: 'rgba(255, 158, 199, 0.16)'
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: true,

      plugins: {
        legend: {
          display: false
        }
      },

      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#876f93',
            font: {
              weight: '700'
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(135, 111, 147, 0.14)'
          },
          ticks: {
            color: '#876f93',
            font: {
              weight: '700'
            }
          }
        }
      }
    }
  })
}

onMounted(renderChart)

watch(
  () => props.temperatures,
  renderChart
)
</script>