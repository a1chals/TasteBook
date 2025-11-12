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
      className="group relative overflow-hidden rounded-2xl shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            width={600}
            height={450}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300 text-neutral-400">
            No image
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="flex-1 text-lg font-semibold leading-snug tracking-tight text-white">
            {dish.name}
          </h3>
          <ScoreChip score={dish.score10} bucket={dish.bucket} />
        </div>
        <div className="flex items-center gap-2">
          <BucketBadge bucket={dish.bucket} />
          {dish.minutes && (
            <span className="text-xs text-white/80">{dish.minutes} min</span>
          )}
        </div>
      </div>
    </Link>
  )
}
