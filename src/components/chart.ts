import { ChartDataset } from 'chart.js'

export type Point = { x: Date; y: number | null }

export type Dataset = ChartDataset<'line', Point[]>
