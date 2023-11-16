<template>
  <div style="display: flex; justify-content: center">
    <table style="width: 90%; max-width: 900px">
      <thead>
        <th>Name</th>
        <th>X01</th>
        <th>RTC</th>
        <th>Killer</th>
        <th>Skov.</th>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows">
          <td
            v-for="item in row.slice(0, 5)"
            :style="{ 'text-align': typeof item == 'number' ? 'end' : 'start' }"
          >
            <span v-if="typeof item == 'string'"
              >{{ i + 1 }}. {{ stringMaxLength(item, 12) }}</span
            >
            <span v-if="typeof item == 'number'">{{ Math.round(item) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../scripts/supabase'

const rows = ref<unknown[][]>([])
const initialElo = 1000

const stringMaxLength = (str: string | undefined, n: number) => {
  if (!str) return str
  if (str.length > n) {
    return str.slice(0, n - 2) + '..'
  }
  return str
}

onMounted(async () => {
  const eloData = await supabase.from('elo').select('*, users (id, name)')
  rows.value = []
  if (eloData.data) {
    eloData.data.forEach((userElo) => {
      rows.value.push([
        userElo.users?.name,
        userElo.x01,
        userElo.rtc,
        userElo.killer,
        userElo.skovhugger,
        ((userElo.x01 ?? initialElo) +
          (userElo.rtc ?? initialElo) +
          (userElo.killer ?? initialElo) +
          (userElo.skovhugger ?? initialElo)) /
          4,
      ])
    })
  }
  rows.value.sort((a, b) => (b[5] as number) - (a[5] as number))
})
</script>
