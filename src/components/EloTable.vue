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
    <p>⚔️ X01, 🕑 Round the Clock, 🧛 Killer, 🪓 Skovhugger, 🦗 Cricket</p>
    <br />
    <br />
    <div
      v-for="[rows, title] in [[sortedRows, 'Active Players']]"
      style="width: 100%"
    >
      <h1 style="text-align: center; font-size: medium">{{ title }}</h1>
      <table style="width: 100%">
        <thead>
          <th>Name</th>
          <th
            v-for="[sb, icon] in columns"
            class="pointer"
            :class="{ selected: sb == sortBy }"
            @click="setSortBy(sb)"
          >
            {{ icon }}
          </th>
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
                >{{ i + 1 }}. {{ stringMaxLength(item, 12) }}</span
              >
              <span v-if="typeof item == 'number'">{{
                item == initialElo || item == 0 ? '-' : Math.round(item)
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
import { computed, onMounted, ref } from 'vue'
import { supabase } from '../scripts/supabase'

enum SortBy {
  x01 = 1,
  rtc,
  killer,
  skovhugger,
  cricket,
  mean,
}
const activeRows = ref<unknown[][]>([])
const initialElo = 1000
const sortBy = ref(SortBy.mean)

const columns = [
  [SortBy.x01, '⚔️'],
  [SortBy.rtc, '🕑'],
  [SortBy.killer, '🧛'],
  [SortBy.skovhugger, '🪓'],
  [SortBy.cricket, '🦗'],
] as const

const stringMaxLength = (str: string | undefined, n: number) => {
  if (!str) return str
  if (str.length > n) {
    return str.slice(0, n - 2) + '..'
  }
  return str
}

function daysBetween(first: Date, second: Date) {
  return Math.round(
    (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
  )
}

onMounted(async () => {
  const { data } = await supabase
    .from('elo')
    .select('*, users (id, name, visible, lastActive)')

  if (!data) return

  activeRows.value = []
  const now = new Date()

  for (const userElo of data) {
    if (!userElo.users) continue
    if (!userElo.users.visible) continue
    if (!userElo.lastUpdate) continue
    if (daysBetween(new Date(userElo.lastUpdate), now) > 14) continue

    activeRows.value.push([
      userElo.users?.name,
      userElo.x01 === 1000 ? 0 : userElo.x01,
      userElo.rtc === 1000 ? 0 : userElo.rtc,
      userElo.killer === 1000 ? 0 : userElo.killer,
      userElo.skovhugger === 1000 ? 0 : userElo.skovhugger,
      userElo.cricket === 1000 ? 0 : userElo.cricket,
      (userElo.x01 ?? initialElo) +
        (userElo.rtc ?? initialElo) +
        (userElo.killer ?? initialElo) +
        (userElo.skovhugger ?? initialElo) +
        (userElo.cricket ?? initialElo),
    ])
  }
})

const setSortBy = (s: SortBy) => {
  if (sortBy.value == s) {
    sortBy.value = SortBy.mean
  } else {
    sortBy.value = s
  }
}

const sortedRows = computed(() => {
  return activeRows.value.sort(
    (a, b) => (b.at(sortBy.value) as number) - (a.at(sortBy.value) as number)
  )
})
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.selected {
  background-color: #36445f66;
  border-radius: 6px;
}
</style>
