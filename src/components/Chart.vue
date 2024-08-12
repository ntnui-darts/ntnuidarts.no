<template>
  <div style="position: relative; width: auto; height: 500px; margin-top: 1em">
    <canvas ref="chartElement"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import { Dataset } from './chart'

const props = defineProps<{
  datasets: Dataset[]
  options: object
}>()

const chartElement = ref<HTMLCanvasElement | null>(null)
let chart: Chart<any> | null = null

const buildChart = async (options: object) => {
  if (!chartElement.value) return

  const datasets = props.datasets.filter((data) => data.data.length > 0)

  if (chart) {
    chart.data.datasets = datasets
    chart.update()
    return
  }
  chart = new Chart(chartElement.value, {
    type: 'bar',
    data: {
      datasets,
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'timeseries',
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
      ...options,
    },
  })
}

onMounted(() => {
  buildChart(props.options)
})

watch(
  () => props.datasets,
  () => buildChart(props.options)
)
</script>

<style scoped>
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 0.8em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: white;
  background-color: #1a1a1a;
  cursor: pointer;
}
</style>
