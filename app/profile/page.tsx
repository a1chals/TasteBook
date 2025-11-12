'use client'

import { useDishStore } from '@/lib/store'
import { BUCKETS } from '@/lib/types'
import { BottomNav } from '@/components/bottom-nav'
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
      <div className="bg-gradient-to-br from-violet-500 via-fuchsia-500 to-emerald-400 px-4 py-12 text-white">
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Chef</h1>
              <p className="text-sm text-white/80">TasteBook Member</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{totalDishes}</p>
              <p className="text-xs text-white/80">Total Dishes</p>
            </Card>
            <Card className="bg-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{avgScore.toFixed(1)}</p>
              <p className="text-xs text-white/80">Avg Score</p>
            </Card>
            <Card className="bg-white/10 p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{avgMinutes.toFixed(0)}</p>
              <p className="text-xs text-white/80">Avg Minutes</p>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="mx-auto max-w-md space-y-4 px-4 py-6">
        {/* Top Dish */}
        {topDish && (
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-amber-600">
              <Award className="h-5 w-5" />
              <h2 className="font-semibold">Top Rated Dish</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">{topDish.name}</p>
                <p className="text-sm text-neutral-600">
                  Score: {topDish.score10.toFixed(1)}/10
                </p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Bucket Distribution */}
        <Card className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <h2 className="font-semibold text-neutral-900">
              Category Distribution
            </h2>
          </div>
          
          <div className="space-y-3">
            {bucketStats.map((bucket) => (
              <div key={bucket.key}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-900">
                    {bucket.label}
                  </span>
                  <span className="text-neutral-600">
                    {bucket.count} ({bucket.percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={`h-full ${bucket.color.split(' ')[0]}`}
                    style={{ width: `${bucket.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Time Stats */}
        <Card className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold text-neutral-900">Time Statistics</h2>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Average cooking time</span>
              <span className="font-medium text-neutral-900">
                {avgMinutes.toFixed(0)} minutes
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Dishes with time info</span>
              <span className="font-medium text-neutral-900">
                {dishes.filter((d) => d.minutes).length} / {totalDishes}
              </span>
            </div>
          </div>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  )
}

