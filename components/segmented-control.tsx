'use client'

import { cn } from '@/lib/utils'
import { BucketKey, BUCKETS } from '@/lib/types'

interface SegmentedControlProps {
  value: BucketKey
  onChange: (value: BucketKey) => void
}

export function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  return (
    <div className="inline-flex rounded-2xl bg-neutral-100 p-1">
      {BUCKETS.map((bucket) => (
        <button
          key={bucket.key}
          onClick={() => onChange(bucket.key)}
          className={cn(
            'rounded-xl px-4 py-3 text-sm font-medium transition-all',
            value === bucket.key
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          )}
        >
          {bucket.label}
        </button>
      ))}
    </div>
  )
}

