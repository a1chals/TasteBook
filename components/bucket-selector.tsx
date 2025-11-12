'use client'

import { BUCKETS, type BucketKey } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface BucketSelectorProps {
  value: BucketKey
  onChange: (value: BucketKey) => void
}

export function BucketSelector({ value, onChange }: BucketSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Choose a category</label>
      <div className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
        {BUCKETS.map((bucket) => (
          <button
            key={bucket.key}
            type="button"
            onClick={() => onChange(bucket.key)}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              value === bucket.key
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50'
            )}
          >
            {bucket.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {BUCKETS.find((b) => b.key === value)?.label} dishes are scored from{' '}
        {BUCKETS.find((b) => b.key === value)?.range[0]} to{' '}
        {BUCKETS.find((b) => b.key === value)?.range[1]}
      </p>
    </div>
  )
}

