<template>
  <Chart :show-smooth-button="false" :datasets="datasets"></Chart>
</template>

<script setup lang="ts">
import Chart from './Chart.vue'
import { onMounted, ref } from 'vue'
import { Dataset } from './chart'
import { supabase } from '../scripts/supabase'

const datasets = ref<Dataset[]>([])

onMounted(async () => {
  const types = await supabase
    .from('games')
    .select('type, createdAt')
    .order('createdAt')
  if (types.data) {
    const map = new Map<string, Map<string, number>>()
    types.data.forEach((data) => {
      const dateString = data.createdAt.split('T')[0]
      if (!map.has(data.type)) {
        map.set(data.type, new Map())
      }
      let subMap = map.get(data.type)
      if (!subMap) {
        subMap = new Map()
        map.set(data.type, subMap)
      }
      subMap.set(dateString, (subMap.get(dateString) ?? 0) + 1)
    })
    datasets.value = [...map.entries()].map(([gameType, subMap]) => {
      return {
        label: gameType,
        data: [...subMap.entries()].map(([dateString, count]) => ({
          x: new Date(dateString),
          y: count,
        })),
      }
    })
  }
})
</script>
