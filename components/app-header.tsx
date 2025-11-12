'use client'

import { User } from 'lucide-react'

interface AppHeaderProps {
  userName?: string
  totalDishes?: number
  avgScore?: number
  thisWeek?: number
}

export function AppHeader({
  userName = 'Chef',
  totalDishes = 0,
  avgScore = 0,
  thisWeek = 0,
}: AppHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-emerald-400 p-6 pb-8 text-white shadow-lg">
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Welcome back,</p>
            <h1 className="text-2xl font-semibold tracking-tight">{userName}</h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <User className="h-6 w-6" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-xs font-medium opacity-80">Total</p>
            <p className="text-2xl font-semibold tabular-nums">{totalDishes}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-xs font-medium opacity-80">Avg Score</p>
            <p className="text-2xl font-semibold tabular-nums">
              {avgScore.toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <p className="text-xs font-medium opacity-80">This Week</p>
            <p className="text-2xl font-semibold tabular-nums">{thisWeek}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

