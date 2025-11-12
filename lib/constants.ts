export const BUCKETS = [
  { key: 'NOT_GREAT', label: 'Not Great', range: [0, 3.49] },
  { key: 'AVERAGE', label: 'Average', range: [3.5, 6.99] },
  { key: 'REALLY_GOOD', label: 'Really Good', range: [7, 10] },
] as const

export type BucketKey = (typeof BUCKETS)[number]['key']

export function getBucketByKey(key: BucketKey) {
  return BUCKETS.find((b) => b.key === key)
}

export function getBucketBounds(key: BucketKey): { L: number; U: number } {
  const bucket = getBucketByKey(key)
  if (!bucket) throw new Error(`Invalid bucket key: ${key}`)
  return { L: bucket.range[0], U: bucket.range[1] }
}

export function getBucketLabel(key: BucketKey): string {
  const bucket = getBucketByKey(key)
  return bucket?.label || key
}

export function getBucketColor(key: BucketKey): string {
  switch (key) {
    case 'NOT_GREAT':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'AVERAGE':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'REALLY_GOOD':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

