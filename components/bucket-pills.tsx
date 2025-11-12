'use client'

import { cn } from '@/lib/utils'
import { BUCKETS, BucketKey } from '@/lib/types'

interface BucketPillsProps {
  selected: BucketKey | 'ALL'
  onSelect: (bucket: BucketKey | 'ALL') => void
}

export function BucketPills({ selected, onSelect }: BucketPillsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto">
      <button
        onClick={() => onSelect('ALL')}
        className={cn(
          'whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium transition-all tracking-wide',
          selected === 'ALL'
            ? 'bg-slate-600 text-white shadow-lg shadow-slate-200'
            : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200 shadow-sm'
        )}
      >
        All
      </button>
      {BUCKETS.map((bucket) => (
        <button
          key={bucket.key}
          onClick={() => onSelect(bucket.key)}
          className={cn(
            'whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium transition-all tracking-wide',
            selected === bucket.key
              ? 'bg-slate-600 text-white shadow-lg shadow-slate-200'
              : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200 shadow-sm'
          )}
        >
          {bucket.label}
        </button>
      ))}
    </div>
  )
}

