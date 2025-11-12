'use client'

import { cn } from '@/lib/utils'
import { BucketKey, BUCKETS } from '@/lib/types'

interface ScoreChipProps {
  score: number
  bucket: BucketKey
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreChip({ score, bucket, size = 'md' }: ScoreChipProps) {
  const bucketConfig = BUCKETS.find((b) => b.key === bucket)
  
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-semibold tabular-nums shadow-sm',
        bucketConfig?.color,
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-4 py-1.5 text-base'
      )}
    >
      {score.toFixed(1)}
    </div>
  )
}

