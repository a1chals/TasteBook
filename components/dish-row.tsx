'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Dish } from '@/lib/types'
import { ScoreChip } from './score-chip'

interface DishRowProps {
  dish: Dish
}

export function DishRow({ dish }: DishRowProps) {
  return (
    <Link
      href={`/dish/${dish.id}`}
      className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-neutral-50"
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-neutral-200 text-neutral-400 text-xs">
            No image
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-neutral-900 truncate">{dish.name}</h3>
        <p className="text-sm text-neutral-500">
          {dish.minutes ? `${dish.minutes} min` : 'No time info'}
        </p>
      </div>
      
      <ScoreChip score={dish.score10} bucket={dish.bucket} size="sm" />
      <ChevronRight className="h-5 w-5 flex-shrink-0 text-neutral-400" />
    </Link>
  )
}

