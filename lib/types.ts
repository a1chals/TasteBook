export type BucketKey = 'NOT_GREAT' | 'AVERAGE' | 'REALLY_GOOD'

export type Dish = {
  id: string
  name: string
  bucket: BucketKey
  score10: number
  minutes?: number
  ingredients?: string[]
  recipe?: string
  imageUrl?: string
  createdAt: string
}

export const BUCKETS = [
  {
    key: 'NOT_GREAT' as const,
    label: 'Not Great',
    color: 'bg-rose-100 text-rose-700',
    range: [0, 3.49] as const,
  },
  {
    key: 'AVERAGE' as const,
    label: 'Average',
    color: 'bg-amber-100 text-amber-700',
    range: [3.5, 6.99] as const,
  },
  {
    key: 'REALLY_GOOD' as const,
    label: 'Really Good',
    color: 'bg-emerald-100 text-emerald-700',
    range: [7, 10] as const,
  },
] as const

