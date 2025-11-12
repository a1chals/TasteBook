'use client'

import { useState } from 'react'
import { useDishStore } from '@/lib/store'
import { BucketKey } from '@/lib/types'
import { BucketPills } from '@/components/bucket-pills'
import { DishCard } from '@/components/dish-card'
import { DishRow } from '@/components/dish-row'
import { BottomNav3D } from '@/components/bottom-nav-3d'
import { FABRate } from '@/components/fab-rate'
import { Button } from '@/components/ui/button'
import { Grid, List, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type ViewMode = 'gallery' | 'list'
type SortBy = 'newest' | 'highest' | 'fastest'

export default function DishesPage() {
  const dishes = useDishStore((state) => state.dishes)
  const [selectedBucket, setSelectedBucket] = useState<BucketKey | 'ALL'>('ALL')
  const [viewMode, setViewMode] = useState<ViewMode>('gallery')
  const [sortBy, setSortBy] = useState<SortBy>('newest')
  
  // Filter by bucket
  let filteredDishes = selectedBucket === 'ALL'
    ? dishes
    : dishes.filter((dish) => dish.bucket === selectedBucket)
  
  // Sort dishes
  filteredDishes = [...filteredDishes].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (sortBy === 'highest') {
      return b.score10 - a.score10
    }
    if (sortBy === 'fastest') {
      return (a.minutes || 999) - (b.minutes || 999)
    }
    return 0
  })

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="sticky top-0 z-30 border-b border-neutral-200/50 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="flex items-center justify-between px-6 py-5">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-neutral-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-sm font-medium uppercase tracking-wider text-neutral-600">My Dishes</h1>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'gallery' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('gallery')}
              className="rounded-xl"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-xl"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="px-6 pb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <BucketPills selected={selectedBucket} onSelect={setSelectedBucket} />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Score</option>
              <option value="fastest">Fastest to Make</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-8">
        {filteredDishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-50 to-slate-50 border border-slate-100">
              <List className="h-12 w-12 text-slate-500 stroke-[1.5]" />
            </div>
            <h2 className="mb-3 text-2xl font-light text-neutral-900 tracking-tight">
              No dishes yet
            </h2>
            <p className="mb-8 text-neutral-500 font-light tracking-wide max-w-md">
              Start by rating your first homemade dish and build your personal collection!
            </p>
            <Link href="/rate">
              <Button className="bg-gradient-to-r from-slate-600 via-slate-500 to-emerald-400 text-white hover:opacity-90 rounded-xl px-6 shadow-lg shadow-slate-200">
                Rate Your First Dish
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {viewMode === 'gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {filteredDishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
            )}
            
            {viewMode === 'list' && (
              <div className="space-y-3">
                {filteredDishes.map((dish) => (
                  <DishRow key={dish.id} dish={dish} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <FABRate />
      <BottomNav3D />
    </div>
  )
}
