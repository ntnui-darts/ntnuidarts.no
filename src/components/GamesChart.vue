<template>
  <h1 style="text-align: center; font-size: larger">
    Number of games, by game type
  </h1>
  <div class="year-navigation">
    <button type="button" :disabled="loading" @click="selectedYear--">
      Previous year
    </button>
    <strong aria-live="polite">{{ selectedYear }}</strong>
    <button
      type="button"
      :disabled="loading || selectedYear >= currentYear"
      @click="selectedYear++"
    >
      Next year
    </button>
  </div>
  <div v-if="loading || error || !gameTypesDataset.length" class="chart-status">
    <p v-if="loading" role="status">Loading games…</p>
    <p v-else-if="error" role="alert">{{ error }}</p>
    <p v-else role="status">No games in {{ selectedYear }}.</p>
  </div>
  <Chart v-else :datasets="gameTypesDataset" :options="chartOptions"></Chart>
</template>

<script setup lang="ts">
import { color } from 'chart.js/helpers'
import { startOfWeek } from 'date-fns'
import { computed, onMounted, ref, watch } from 'vue'
import { supabase } from '../scripts/supabase'
import { Dataset } from './chart'
import Chart from './Chart.vue'

const gameTypeColors = new Map([
  ['x01', '#36a2eb'],
  ['rtc', '#ff6384'],
  ['killer', '#ff9f40'],
  ['skovhugger', '#ffcd56'],
  ['cricket', '#4bc0c0'],
])
const gameTypeOrder = [...gameTypeColors.keys()]

const getGameTypeOrder = (type: string) => {
  const index = gameTypeOrder.indexOf(type.toLowerCase())
  return index === -1 ? gameTypeOrder.length : index
}

const getGameTypeColor = (type: string) => {
  const name = type.toLowerCase()
  const color = gameTypeColors.get(name)
  if (color) return color

  // Give new game types a stable color independent of the year's datasets.
  let hue = 0
  for (const character of name) {
    hue = (hue * 31 + character.charCodeAt(0)) % 360
  }
  return `hsl(${hue}, 65%, 55%)`
}

const gameTypesDataset = ref<Dataset[]>([])
const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const loading = ref(true)
const error = ref('')
const chartOptions = computed(() => ({
  scales: {
    x: {
      type: 'time',
      stacked: true,
      min: new Date(selectedYear.value, 0, 1).getTime(),
      max: new Date(selectedYear.value + 1, 0, 1).getTime() - 1,
      offset: false,
      time: { unit: 'month' },
    },
    y: { stacked: true },
  },
}))

const loadGames = async () => {
  loading.value = true
  error.value = ''
  gameTypesDataset.value = []

  try {
    const year = selectedYear.value
    const games: { type: string; createdAt: string }[] = []
    const pageSize = 1000
    let total = 0

    // Fetch every page so years with many legs are not silently truncated.
    do {
      const { data, error: queryError, count } = await supabase
        .from('legs')
        .select('type, createdAt', { count: 'exact' })
        .gte('createdAt', new Date(year, 0, 1).toISOString())
        .lt('createdAt', new Date(year + 1, 0, 1).toISOString())
        .order('createdAt')
        .order('id')
        .range(games.length, games.length + pageSize - 1)

      if (queryError) throw queryError
      if (!data?.length) break
      games.push(...data)
      total = count ?? games.length
    } while (games.length < total)

    const weeks = new Set<string>()
    const countsByType = new Map<string, Map<string, number>>()
    for (const game of games) {
      const weekStart = startOfWeek(new Date(game.createdAt))
      if (weekStart.getFullYear() < year) continue
      const week = weekStart.toISOString()
      weeks.add(week)
      const counts = countsByType.get(game.type) ?? new Map<string, number>()
      counts.set(week, (counts.get(week) ?? 0) + 1)
      countsByType.set(game.type, counts)
    }

    gameTypesDataset.value = [...countsByType]
      .sort(
        ([a], [b]) =>
          getGameTypeOrder(a) - getGameTypeOrder(b) || a.localeCompare(b)
      )
      .map(([type, counts]) => ({
        label: type,
        backgroundColor: color(getGameTypeColor(type)).alpha(0.5).rgbString(),
        borderColor: getGameTypeColor(type),
        data: [...weeks].map((week) => ({
          x: new Date(week),
          y: counts.get(week) ?? 0,
        })),
      }))
  } catch (cause) {
    console.error('Failed to load games', cause)
    error.value = 'Could not load games. Please try again by selecting a year.'
  } finally {
    loading.value = false
  }
}

onMounted(loadGames)
watch(selectedYear, loadGames)
</script>

<style scoped>
.chart-status {
  display: grid;
  place-items: center;
  height: 500px;
  margin-top: 1em;
}

.year-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  margin: 1em 0;
}

button {
  padding: 0.4em 0.8em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
