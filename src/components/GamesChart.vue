<template>
  <h1 style="text-align: center; font-size: larger">
    Number of games, by game type
  </h1>
  <Chart :datasets="gameTypesDataset" :options="{}"></Chart>
</template>

<script setup lang="ts">
import Chart from './Chart.vue'
import { onMounted, ref } from 'vue'
import { Dataset } from './chart'
import { supabase } from '../scripts/supabase'
import { startOfWeek } from 'date-fns'

const gameTypesDataset = ref<Dataset[]>([])

onMounted(async () => {
  const gamesData = await supabase
    .from('legs')
    .select('type, createdAt, userId, users (id, name)')
    .order('createdAt')

  if (gamesData.data) {
    gamesData.data.forEach((data) => {
      data.createdAt = startOfWeek(new Date(data.createdAt)).toISOString()
    })

    const dateStrings = [
      ...new Set(gamesData.data.map((data) => data.createdAt)),
    ]
    const gameTypes = [...new Set(gamesData.data.map((data) => data.type))]

    gameTypesDataset.value = gameTypes.map((gameType) => {
      return {
        label: gameType,
        data: dateStrings.map((dateString) => {
          const count = gamesData.data.filter(
            (data) => data.type == gameType && data.createdAt == dateString
          ).length
          return {
            x: new Date(dateString),
            y: count,
          }
        }),
      }
    })
  }
})
</script>
