<template>
  <div style="position: relative; width: auto; height: 500px; margin-top: 1em">
    <button
      v-if="showSmoothButton"
      style="position: absolute; right: 0; top: -3em"
      :class="{ selected: smoothEnabled }"
      @click="smoothEnabled = !smoothEnabled"
    >
      Toggle Smoothing
    </button>
    <canvas ref="chartElement"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import { Dataset, smoothPoints } from './chart'

const props = withDefaults(
  defineProps<{
    datasets: Dataset[]
    showSmoothButton?: boolean
  }>(),
  { showSmoothButton: true }
)

const chartElement = ref<HTMLCanvasElement | null>(null)
const smoothEnabled = ref(props.showSmoothButton)
let chart: Chart<any> | null = null

const buildChart = async () => {
  if (!chartElement.value) return

  const datasets = props.datasets
    .filter((data) => data.data.length > 0)
    .map((dataset) => ({
      ...dataset,
      data: smoothEnabled.value ? smoothPoints(dataset.data) : dataset.data,
    }))

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
    },
  })
}

onMounted(() => {
  buildChart()
})

watch(
  () => [props.datasets, smoothEnabled.value],
  () => buildChart()
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
