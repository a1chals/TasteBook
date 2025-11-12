'use client'

import { cn } from '@/lib/utils'
import { BUCKETS, BucketKey } from '@/lib/types'

interface BucketPillsProps {
  selected: BucketKey | 'ALL'
  onSelect: (bucket: BucketKey | 'ALL') => void
}

export function BucketPills({ selected, onSelect }: BucketPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect('ALL')}
        className={cn(
          'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all',
          selected === 'ALL'
            ? 'bg-neutral-900 text-white shadow-md'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        )}
      >
        All
      </button>
      {BUCKETS.map((bucket) => (
        <button
          key={bucket.key}
          onClick={() => onSelect(bucket.key)}
          className={cn(
            'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all',
            selected === bucket.key
              ? 'bg-neutral-900 text-white shadow-md'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          )}
        >
          {bucket.label}
        </button>
      ))}
    </div>
  )
}

