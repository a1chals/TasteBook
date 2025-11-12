'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDishStore } from '@/lib/store'
import { BucketKey, BUCKETS } from '@/lib/types'
import { SegmentedControl } from '@/components/segmented-control'
import { BucketBadge } from '@/components/bucket-badge'
import { BottomNav } from '@/components/bottom-nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '@/components/ui/use-toast'

type Step = 1 | 2 | 3

export default function RatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const addDish = useDishStore((state) => state.addDish)
  const getDishesByBucket = useDishStore((state) => state.getDishesByBucket)
  
  const [step, setStep] = useState<Step>(1)
  const [bucket, setBucket] = useState<BucketKey>('AVERAGE')
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [minutes, setMinutes] = useState('')
  const [recipe, setRecipe] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setImageUrl(value)
    if (value.startsWith('http')) {
      setImagePreview(value)
    }
  }
  
  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      if (!name.trim()) {
        toast({
          title: 'Name required',
          description: 'Please enter a name for your dish.',
          variant: 'destructive',
        })
        return
      }
      setStep(3)
    }
  }
  
  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for your dish.',
        variant: 'destructive',
      })
      return
    }
    
    const bucketConfig = BUCKETS.find((b) => b.key === bucket)
    const bucketDishes = getDishesByBucket(bucket)
    const [minScore, maxScore] = bucketConfig!.range
    
    // Calculate score based on position (simulate inserting at top)
    const score = bucketDishes.length === 0
      ? (minScore + maxScore) / 2
      : Math.min(maxScore, bucketDishes[0].score10 + 0.1)
    
    addDish({
      name: name.trim(),
      bucket,
      score10: parseFloat(score.toFixed(1)),
      minutes: minutes ? parseInt(minutes) : undefined,
      ingredients: ingredients
        .split('\n')
        .map((i) => i.trim())
        .filter(Boolean),
      recipe: recipe.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    })
    
    toast({
      title: 'Dish added!',
      description: `${name} has been added to ${bucketConfig!.label}.`,
    })
    
    router.push('/dishes')
  }
  
  const bucketDishes = getDishesByBucket(bucket)
  const bucketConfig = BUCKETS.find((b) => b.key === bucket)

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
          {step === 1 ? (
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setStep((s) => (s - 1) as Step)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-neutral-900">
            Rate a Dish
          </h1>
          <div className="w-10" />
        </div>
        
        {/* Progress indicators */}
        <div className="mx-auto flex max-w-md gap-1 px-4 pb-3">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-violet-500' : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="mx-auto max-w-md px-4 py-6">
        {/* Step 1: Choose Bucket */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-neutral-900">
                How was it?
              </h2>
              <p className="text-neutral-600">
                Choose the category that best describes your dish.
              </p>
            </div>
            
            <div className="flex justify-center">
              <SegmentedControl value={bucket} onChange={setBucket} />
            </div>
            
            <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <BucketBadge bucket={bucket} />
                <span className="text-sm font-medium text-neutral-700">
                  Score range: {bucketConfig?.range[0]} - {bucketConfig?.range[1]}
                </span>
              </div>
              <p className="text-sm text-neutral-600">
                {bucket === 'NOT_GREAT' &&
                  'Not quite there yet. These dishes need some work.'}
                {bucket === 'AVERAGE' &&
                  'Pretty good! Solid everyday dishes you enjoy.'}
                {bucket === 'REALLY_GOOD' &&
                  'Outstanding! Your best homemade creations.'}
              </p>
            </Card>
            
            <Button onClick={handleNext} className="w-full" size="lg">
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Step 2: Add Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-neutral-900">
                Add details
              </h2>
              <p className="text-neutral-600">
                Tell us about your dish.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-neutral-900">
                  Dish name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Grandma's Lasagna"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="ingredients" className="text-neutral-900">
                  Ingredients (one per line)
                </Label>
                <Textarea
                  id="ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Pasta&#10;Tomato sauce&#10;Ground beef&#10;Cheese"
                  rows={5}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="minutes" className="text-neutral-900">
                  Time to make (minutes)
                </Label>
                <Input
                  id="minutes"
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="30"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="recipe" className="text-neutral-900">
                  Recipe (text or URL)
                </Label>
                <Textarea
                  id="recipe"
                  value={recipe}
                  onChange={(e) => setRecipe(e.target.value)}
                  placeholder="https://example.com/recipe or write your own..."
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="image" className="text-neutral-900">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={imageUrl}
                  onChange={handleImageChange}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
                {imagePreview && (
                  <div className="mt-2 overflow-hidden rounded-lg">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={300}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <Button onClick={handleNext} className="w-full" size="lg">
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
        
        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-neutral-900">
                Ready to save?
              </h2>
              <p className="text-neutral-600">
                Your dish will be added to <BucketBadge bucket={bucket} />
              </p>
            </div>
            
            <Card className="overflow-hidden">
              {imagePreview && (
                <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={imagePreview}
                    alt={name}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">
                  {name}
                </h3>
                <div className="space-y-2 text-sm text-neutral-600">
                  {minutes && <p>⏱️ {minutes} minutes</p>}
                  {ingredients && (
                    <p>
                      🥘{' '}
                      {ingredients
                        .split('\n')
                        .filter(Boolean)
                        .slice(0, 3)
                        .join(', ')}
                      {ingredients.split('\n').filter(Boolean).length > 3 &&
                        '...'}
                    </p>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
              <p className="text-sm text-neutral-700">
                This dish will be added to your collection. You currently have{' '}
                <strong>{bucketDishes.length} dishes</strong> in this category.
              </p>
            </Card>
            
            <Button onClick={handleSave} className="w-full" size="lg">
              <Check className="mr-2 h-5 w-5" />
              Save Dish
            </Button>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  )
}
