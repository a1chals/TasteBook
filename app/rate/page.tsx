'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDishStore } from '@/lib/store'
import { BucketKey, BUCKETS } from '@/lib/types'
import { BottomNav3D } from '@/components/bottom-nav-3d'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Upload, Clock, FileText, Save } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

export default function RatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const addDish = useDishStore((state) => state.addDish)
  const getDishesByBucket = useDishStore((state) => state.getDishesByBucket)
  
  const [bucket, setBucket] = useState<BucketKey>('AVERAGE')
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [minutes, setMinutes] = useState('')
  const [recipe, setRecipe] = useState('')
  const [notes, setNotes] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a local preview URL
      const localUrl = URL.createObjectURL(file)
      setImagePreview(localUrl)
      
      // For now, we'll use a placeholder URL since we're using mock data
      // In production, you'd upload to Supabase storage here
      setImageUrl(localUrl)
      
      toast({
        title: 'Image selected',
        description: 'Image preview loaded successfully.',
      })
    }
  }
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setImageUrl(value)
    if (value.startsWith('http')) {
      setImagePreview(value)
    } else {
      setImagePreview(null)
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
      recipe: recipe.trim() || notes.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
    })
    
    toast({
      title: 'Dish added!',
      description: `${name} has been added to ${bucketConfig!.label}.`,
    })
    
    router.push('/dishes')
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <div className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-8 py-5 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-neutral-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-sm font-medium uppercase tracking-wider text-neutral-600">Rate a Dish</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-81px-80px)] overflow-hidden">
        <div className="h-full mx-auto max-w-7xl px-8 py-8">
          <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 h-full">
            {/* Left - Image Upload */}
            <div className="flex flex-col gap-6 h-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex-1 bg-white rounded-3xl overflow-hidden relative shadow-2xl border border-neutral-200/50 cursor-pointer hover:border-slate-400 transition-colors group"
              >
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Dish preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <Upload className="h-12 w-12 mb-2 mx-auto stroke-[1.5]" />
                        <p className="text-sm font-light tracking-wide">Click to change image</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 group-hover:text-slate-600 transition-colors">
                    <Upload className="h-16 w-16 mb-4 stroke-[1.5]" />
                    <p className="text-sm font-light tracking-wide">Click to upload image</p>
                    <p className="text-xs text-neutral-400 mt-2">or paste URL below</p>
                  </div>
                )}
              </label>

              <Input
                id="image"
                value={imageUrl.startsWith('blob:') ? '' : imageUrl}
                onChange={handleImageUrlChange}
                placeholder="Or paste image URL"
                className="bg-white border-neutral-200 h-11 text-sm shadow-sm"
              />

              {/* Bucket Selector */}
              <div className="flex gap-3">
                {BUCKETS.map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setBucket(b.key)}
                    className={cn(
                      'flex-1 px-4 py-3 rounded-2xl border-2 transition-all font-medium text-sm tracking-wide',
                      bucket === b.key
                        ? 'border-slate-500 bg-slate-600 text-white shadow-lg shadow-slate-200'
                        : 'border-neutral-200 bg-white hover:border-slate-400 hover:shadow-md text-neutral-700'
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Details */}
            <div className="flex flex-col gap-5 h-full">
              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Time */}
                <div className="bg-white rounded-2xl p-5 border border-neutral-200/50 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-slate-50 rounded-full p-2">
                      <Clock className="h-4 w-4 text-slate-600 stroke-[1.5]" />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">Time</span>
                  </div>
                  <Input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="30"
                    className="bg-neutral-50/50 border-neutral-200 h-10 text-base"
                  />
                  <p className="text-xs text-neutral-400 mt-2 tracking-wide">minutes</p>
                </div>

                {/* Recipe Link */}
                <div className="bg-white rounded-2xl p-5 border border-neutral-200/50 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-emerald-50 rounded-full p-2">
                      <FileText className="h-4 w-4 text-emerald-500 stroke-[1.5]" />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-medium">Recipe</span>
                  </div>
                  <Input
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                    placeholder="URL"
                    className="bg-neutral-50/50 border-neutral-200 h-10 text-base"
                  />
                  <p className="text-xs text-neutral-400 mt-2 tracking-wide">link</p>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-200/50 shadow-md">
                <Label className="text-neutral-500 mb-3 block text-xs uppercase tracking-wider font-medium">Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special tips or observations..."
                  rows={2}
                  className="bg-neutral-50/50 border-neutral-200 resize-none text-sm"
                />
              </div>

              {/* Ingredients */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-200/50 shadow-md flex-1 overflow-hidden flex flex-col">
                <Label className="text-neutral-500 mb-3 block text-xs uppercase tracking-wider font-medium">Ingredients</Label>
                <Textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Pasta&#10;Tomatoes&#10;Garlic"
                  className="bg-neutral-50/50 border-neutral-200 resize-none font-mono text-sm flex-1"
                />
              </div>

              {/* Dish Name */}
              <div className="pt-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="dish name"
                  className="bg-transparent border-none text-5xl font-extralight placeholder:text-neutral-300 h-auto p-0 focus-visible:ring-0 tracking-tight"
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSave}
                className="w-full h-14 bg-gradient-to-r from-slate-600 via-slate-500 to-emerald-400 text-white hover:opacity-90 font-medium rounded-2xl shadow-lg shadow-slate-200 text-base tracking-wide"
              >
                <Save className="mr-2 h-5 w-5" />
                Save Dish
              </Button>
            </div>
          </div>
          </div>
        </div>

          <BottomNav3D />
      </div>
    )
  }
