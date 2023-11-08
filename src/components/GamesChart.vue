<template>
  <Chart :show-smooth-button="true" :datasets="gameTypesDataset"></Chart>
  <Chart :show-smooth-button="true" :datasets="usersDataset"></Chart>
</template>

<script setup lang="ts">
import Chart from './Chart.vue'
import { onMounted, ref } from 'vue'
import { Dataset } from './chart'
import { supabase } from '../scripts/supabase'

const gameTypesDataset = ref<Dataset[]>([])
const usersDataset = ref<Dataset[]>([])

onMounted(async () => {
  var ms = new Date().getTime() - 1000 * 60 * 60 * 24 * 28
  const gamesData = await supabase
    .from('legs')
    .select('type, createdAt, userId, users (id, name)')
    .gt('createdAt', new Date(ms).toISOString())
    .order('createdAt')

  if (gamesData.data) {
    gamesData.data.forEach((data) => {
      data.createdAt = data.createdAt.split('T')[0]
    })

    const dateStrings = [
      ...new Set(gamesData.data.map((data) => data.createdAt)),
    ]
    const gameTypes = [...new Set(gamesData.data.map((data) => data.type))]
    const userNames = [
      ...new Set(gamesData.data.map((data) => data.users?.name ?? 'Unknown')),
    ].filter(
      (name) =>
        gamesData.data.filter((data) => data.users?.name == name).length > 20
    )

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

    usersDataset.value = userNames.map((name) => {
      return {
        label: name,
        data: dateStrings.map((dateString) => {
          const count = gamesData.data.filter(
            (data) => data.users?.name == name && data.createdAt == dateString
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
