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
      className="flex items-center gap-4 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-md border border-transparent hover:border-neutral-200 bg-white/50"
    >
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-100 shadow-sm">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-50 text-neutral-400 text-xs">
            <span className="font-light">No image</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-neutral-900 truncate tracking-tight">{dish.name}</h3>
        <p className="text-sm text-neutral-500 font-light tracking-wide">
          {dish.minutes ? `${dish.minutes} min` : 'No time info'}
        </p>
      </div>
      
      <ScoreChip score={dish.score10} bucket={dish.bucket} size="sm" />
      <ChevronRight className="h-5 w-5 flex-shrink-0 text-neutral-300 stroke-[1.5]" />
    </Link>
  )
}

