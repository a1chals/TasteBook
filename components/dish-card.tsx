'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Dish } from '@/lib/types'
import { ScoreChip } from './score-chip'
import { BucketBadge } from './bucket-badge'

interface DishCardProps {
  dish: Dish
}

export function DishCard({ dish }: DishCardProps) {
  return (
    <Link
      href={`/dish/${dish.id}`}
      className="group relative overflow-hidden rounded-3xl shadow-lg transition-all hover:scale-[1.03] hover:shadow-2xl border border-neutral-200/50 bg-white"
    >
      <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            width={600}
            height={450}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-50 text-neutral-400">
            <span className="text-sm font-light">No image</span>
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="flex-1 text-lg font-medium leading-tight tracking-tight text-white">
            {dish.name}
          </h3>
          <ScoreChip score={dish.score10} bucket={dish.bucket} />
        </div>
        <div className="flex items-center gap-2">
          <BucketBadge bucket={dish.bucket} />
          {dish.minutes && (
            <span className="text-xs text-white/90 font-light tracking-wide">{dish.minutes} min</span>
          )}
        </div>
      </div>
    </Link>
  )
}
