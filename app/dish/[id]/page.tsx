'use client'

import { use } from 'react'
import { useDishStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { BucketBadge } from '@/components/bucket-badge'
import { ScoreChip } from '@/components/score-chip'
import { BottomNav3D } from '@/components/bottom-nav-3d'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ArrowLeft, Clock, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface DishPageProps {
  params: Promise<{ id: string }>
}

export default function DishPage({ params }: DishPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const getDishById = useDishStore((state) => state.getDishById)
  const deleteDish = useDishStore((state) => state.deleteDish)
  
  const dish = getDishById(id)
  
  if (!dish) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Dish not found</h1>
          <Link href="/dishes">
            <Button>Back to Dishes</Button>
          </Link>
        </div>
      </div>
    )
  }
  
  const handleDelete = () => {
    deleteDish(id)
    toast({
      title: 'Dish deleted',
      description: `${dish.name} has been removed from your collection.`,
    })
    router.push('/dishes')
  }
  
  const createdDate = new Date(dish.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="relative">
        {/* Hero Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-200">
          {dish.imageUrl ? (
            <>
              <Image
                src={dish.imageUrl}
                alt={dish.name}
                width={1200}
                height={675}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-300 text-neutral-500">
              No image available
            </div>
          )}
          
          {/* Back button */}
          <div className="absolute left-4 top-4">
            <Link href="/dishes">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Title and Score */}
        <div className="mx-auto max-w-md px-4 py-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="flex-1 text-3xl font-bold leading-tight tracking-tight text-neutral-900">
              {dish.name}
            </h1>
            <ScoreChip score={dish.score10} bucket={dish.bucket} size="lg" />
          </div>
          
          {/* Meta info */}
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
            <BucketBadge bucket={dish.bucket} />
            {dish.minutes && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{dish.minutes} minutes</span>
              </div>
            )}
            <span>Added {createdDate}</span>
          </div>
          
          {/* Ingredients */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-neutral-900">
                Ingredients
              </h2>
              <ul className="space-y-2 rounded-xl bg-white p-4">
                {dish.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-neutral-700"
                  >
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-600" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Recipe */}
          {dish.recipe && (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-neutral-900">
                Recipe
              </h2>
              <div className="rounded-xl bg-white p-4">
                {dish.recipe.startsWith('http') ? (
                  <a
                    href={dish.recipe}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 underline hover:text-slate-800"
                  >
                    View recipe →
                  </a>
                ) : (
                  <p className="whitespace-pre-wrap text-neutral-700">
                    {dish.recipe}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" disabled>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete dish?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete "{dish.name}"? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <BottomNav3D />
    </div>
  )
}
