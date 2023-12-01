<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 900px;
      padding: 1em;
      margin: auto;
    "
  >
    <h1 style="text-align: center; font-size: larger">Elo Rating</h1>
    <p>⚔️ X01, 🕑 Round the Clock, 🐱‍👤 Killer, 🪓 Skovhugger, 🦗 Cricket</p>
    <br />
    <br />
    <div
      v-for="[rows, title] in [
        [activeRows, 'Active Players'],
        [inactiveRows, 'Inactive Players'],
      ]"
      style="width: 100%"
    >
      <h1 style="text-align: center; font-size: medium">{{ title }}</h1>
      <table style="width: 100%">
        <thead>
          <th>Name</th>
          <th>⚔️</th>
          <th>🕑</th>
          <th>🐱‍👤</th>
          <th>🪓</th>
          <th>🦗</th>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows">
            <td
              v-for="item in row.slice(0, 6)"
              :style="{
                'text-align': typeof item == 'number' ? 'end' : 'start',
              }"
            >
              <span v-if="typeof item == 'string'"
                >{{ i + 1 + (rows == inactiveRows ? activeRows.length : 0) }}.
                {{ stringMaxLength(item, 12) }}</span
              >
              <span v-if="typeof item == 'number'">{{
                item == initialElo ? '-' : Math.round(item)
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../scripts/supabase'

const activeRows = ref<unknown[][]>([])
const inactiveRows = ref<unknown[][]>([])
const initialElo = 1000

const stringMaxLength = (str: string | undefined, n: number) => {
  if (!str) return str
  if (str.length > n) {
    return str.slice(0, n - 2) + '..'
  }
  return str
}

onMounted(async () => {
  const { data } = await supabase
    .from('elo')
    .select('*, users (id, name, visible)')

  if (!data) return

  activeRows.value = []
  inactiveRows.value = []
  for (const userElo of data) {
    if (!userElo.users?.visible) continue
    const { count } = await supabase
      .from('legs')
      .select('userId', { count: 'estimated', head: true })
      .eq('userId', userElo.id)

    const rows = (count ?? 0) >= 20 ? activeRows : inactiveRows

    rows.value.push([
      userElo.users?.name,
      userElo.x01,
      userElo.rtc,
      userElo.killer,
      userElo.skovhugger,
      userElo.cricket,
      (userElo.x01 ?? initialElo) +
        (userElo.rtc ?? initialElo) +
        (userElo.killer ?? initialElo) +
        (userElo.skovhugger ?? initialElo) +
        (userElo.cricket ?? initialElo),
    ])
    rows.value.sort((a, b) => (b.at(-1) as number) - (a.at(-1) as number))
  }
})
</script>
