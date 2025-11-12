'use client'

import { useState } from 'react'
import { useDishStore } from '@/lib/store'
import { BucketKey } from '@/lib/types'
import { BucketPills } from '@/components/bucket-pills'
import { DishCard } from '@/components/dish-card'
import { DishRow } from '@/components/dish-row'
import { BottomNav } from '@/components/bottom-nav'
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
      <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-neutral-900">My Dishes</h1>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'gallery' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('gallery')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mx-auto max-w-md px-4 pb-4">
          <BucketPills selected={selectedBucket} onSelect={setSelectedBucket} />
        </div>
        
        <div className="mx-auto max-w-md px-4 pb-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Score</option>
            <option value="fastest">Fastest to Make</option>
          </select>
        </div>
      </div>
      
      <div className="mx-auto max-w-md px-4 py-6">
        {filteredDishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
              <List className="h-10 w-10 text-neutral-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-neutral-900">
              No dishes yet
            </h2>
            <p className="mb-6 text-neutral-600">
              Start by rating your first homemade dish!
            </p>
            <Link href="/rate">
              <Button>Rate Your First Dish</Button>
            </Link>
          </div>
        ) : (
          <>
            {viewMode === 'gallery' && (
              <div className="grid grid-cols-2 gap-3">
                {filteredDishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
            )}
            
            {viewMode === 'list' && (
              <div className="space-y-2">
                {filteredDishes.map((dish) => (
                  <DishRow key={dish.id} dish={dish} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <FABRate />
      <BottomNav />
    </div>
  )
}
