<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: auto;
      width: 100%;
      min-width: 0;
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
      <div class="table-scroll">
        <table class="elo-table">
          <thead>
            <tr>
              <th>Name</th>
              <th
                v-for="[sb, icon] in columns"
                class="pointer"
                :class="{ selected: sb == sortBy }"
                @click="setSortBy(sb)"
              >
                {{ icon }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in rows">
              <td
                v-for="item in row.slice(0, 6)"
                :class="{ 'player-name': typeof item == 'string' }"
                :style="{
                  'text-align': typeof item == 'number' ? 'end' : 'start',
                }"
              >
                <span v-if="typeof item == 'string'"
                  >{{ i + 1 }}. {{ item }}</span
                >
                <span v-if="typeof item == 'number'">{{
                  item == initialElo || item == 0 ? '-' : Math.round(item)
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
.table-scroll {
  width: 100%;
  overflow-x: auto;
}
.elo-table {
  display: table;
  width: 100%;
  overflow: visible;
}
.elo-table th:first-child,
.elo-table td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: inherit;
}
.elo-table th:first-child {
  background-color: var(--vp-c-bg-soft);
}
.player-name {
  width: 100%;
  min-width: 15ch;
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pointer {
  cursor: pointer;
}
.selected {
  background-color: #36445f66;
  border-radius: 6px;
}
</style>
