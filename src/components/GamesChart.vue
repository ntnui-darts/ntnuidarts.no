<template>
  <Chart :show-smooth-button="true" :datasets="datasets"></Chart>
</template>

<script setup lang="ts">
import Chart from './Chart.vue'
import { onMounted, ref } from 'vue'
import { Dataset } from './chart'
import { supabase } from '../scripts/supabase'

const datasets = ref<Dataset[]>([])

onMounted(async () => {
  const gamesData = await supabase
    .from('games')
    .select('type, createdAt')
    .order('createdAt')

  if (gamesData.data) {
    gamesData.data.forEach((data) => {
      data.createdAt = data.createdAt.split('T')[0]
    })

    const dateStrings = [
      ...new Set(gamesData.data.map((data) => data.createdAt)),
    ]
    const gameTypes = [...new Set(gamesData.data.map((data) => data.type))]

    datasets.value = gameTypes.map((gameType) => {
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
