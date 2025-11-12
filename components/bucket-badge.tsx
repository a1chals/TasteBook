'use client'

import { BucketKey, BUCKETS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface BucketBadgeProps {
  bucket: BucketKey
}

export function BucketBadge({ bucket }: BucketBadgeProps) {
  const bucketConfig = BUCKETS.find((b) => b.key === bucket)
  
  if (!bucketConfig) return null
  
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        bucketConfig.color
      )}
    >
      {bucketConfig.label}
    </span>
  )
}

