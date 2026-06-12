//контейнер для графіка + зберігаємо його в компонент chartRef
<template>
  <canvas ref="chartRef"></canvas>
</template>

<script setup>
import {
  onMounted,
  watch,
  ref
} from 'vue'

//під'єднуємо бібліотеку chart.js
import Chart from 'chart.js/auto'

//отримуємо підписи для вісей
const props = defineProps({
  labels: Array,
  temperatures: Array
})

//створюємо компонент для зберігання графіка, поки що зі значенням null
const chartRef = ref(null)
let chart = null


//функція побудови графіка
const renderChart = () => {
  if (!chartRef.value) return

  //перевірка чи є старий графік і видалення його
  if (chart) {
    chart.destroy()
  }

  //створення нового графіка
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

//будуємо графік, коли з'явився компонент
onMounted(renderChart)

//слідкуємо за змінами температур
watch(
  () => props.temperatures,
  renderChart
)
</script>