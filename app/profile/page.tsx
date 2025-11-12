'use client'

import { useDishStore } from '@/lib/store'
import { BUCKETS } from '@/lib/types'
import { BottomNav3D } from '@/components/bottom-nav-3d'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, TrendingUp, Award, Clock } from 'lucide-react'

export default function ProfilePage() {
  const dishes = useDishStore((state) => state.dishes)
  
  const totalDishes = dishes.length
  const avgScore = dishes.length > 0
    ? dishes.reduce((sum, dish) => sum + dish.score10, 0) / dishes.length
    : 0
  
  const topDish = dishes.length > 0
    ? dishes.reduce((top, dish) => (dish.score10 > top.score10 ? dish : top))
    : null
  
  const avgMinutes = dishes.filter((d) => d.minutes).length > 0
    ? dishes.filter((d) => d.minutes).reduce((sum, dish) => sum + (dish.minutes || 0), 0) /
      dishes.filter((d) => d.minutes).length
    : 0
  
  const bucketStats = BUCKETS.map((bucket) => {
    const count = dishes.filter((d) => d.bucket === bucket.key).length
    const percentage = totalDishes > 0 ? (count / totalDishes) * 100 : 0
    return { ...bucket, count, percentage }
  })

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-5xl px-8 py-5">
          <h1 className="text-sm font-medium uppercase tracking-wider text-neutral-600">Profile</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-8 py-8">
        {/* Profile Card */}
        <Card className="mb-8 bg-white rounded-3xl shadow-lg border border-neutral-200/50 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-200">
              <User className="h-10 w-10 text-slate-600 stroke-[1.5]" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tight text-neutral-900">Chef</h1>
              <p className="text-sm text-neutral-500 font-light tracking-wide">TasteBook Member</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <p className="text-3xl font-extralight text-slate-900 tabular-nums">{totalDishes}</p>
              <p className="text-xs uppercase tracking-wider text-slate-600 mt-2">Total Dishes</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <p className="text-3xl font-extralight text-slate-900 tabular-nums">{avgScore.toFixed(1)}</p>
              <p className="text-xs uppercase tracking-wider text-slate-600 mt-2">Avg Score</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <p className="text-3xl font-extralight text-slate-900 tabular-nums">{avgMinutes.toFixed(0)}</p>
              <p className="text-xs uppercase tracking-wider text-slate-600 mt-2">Avg Minutes</p>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Dish */}
          {topDish && (
            <Card className="bg-white rounded-2xl shadow-md border border-neutral-200/50 p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-amber-50 rounded-full p-2">
                  <Award className="h-5 w-5 text-amber-600 stroke-[1.5]" />
                </div>
                <h2 className="text-xs uppercase tracking-wider font-medium text-neutral-600">Top Rated Dish</h2>
              </div>
              <div>
                <p className="font-medium text-neutral-900 text-lg tracking-tight">{topDish.name}</p>
                <p className="text-sm text-neutral-500 mt-1 font-light">
                  Score: {topDish.score10.toFixed(1)}/10
                </p>
              </div>
            </Card>
          )}
          
          {/* Time Stats */}
          <Card className="bg-white rounded-2xl shadow-md border border-neutral-200/50 p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-emerald-50 rounded-full p-2">
                <Clock className="h-5 w-5 text-emerald-600 stroke-[1.5]" />
              </div>
              <h2 className="text-xs uppercase tracking-wider font-medium text-neutral-600">Time Statistics</h2>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600 font-light">Average cooking time</span>
                <span className="font-medium text-neutral-900 tabular-nums">
                  {avgMinutes.toFixed(0)} min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 font-light">Dishes with time info</span>
                <span className="font-medium text-neutral-900 tabular-nums">
                  {dishes.filter((d) => d.minutes).length} / {totalDishes}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bucket Distribution */}
        <Card className="mt-6 bg-white rounded-2xl shadow-md border border-neutral-200/50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-slate-50 rounded-full p-2">
              <TrendingUp className="h-5 w-5 text-slate-600 stroke-[1.5]" />
            </div>
            <h2 className="text-xs uppercase tracking-wider font-medium text-neutral-600">
              Category Distribution
            </h2>
          </div>
          
          <div className="space-y-4">
            {bucketStats.map((bucket) => (
              <div key={bucket.key}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-900 tracking-tight">
                    {bucket.label}
                  </span>
                  <span className="text-neutral-600 font-light tabular-nums">
                    {bucket.count} ({bucket.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={`h-full ${bucket.color.split(' ')[0]} transition-all duration-500`}
                    style={{ width: `${bucket.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <BottomNav3D />
    </div>
  )
}

