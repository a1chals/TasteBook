'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  value: File | null
  onChange: (file: File | null) => void
  previewUrl?: string
}

export function ImageUploader({ value, onChange, previewUrl }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl || null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    onChange(null)
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Dish Photo (optional)</label>
      <div className="flex flex-col gap-4">
        {preview ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden border">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className="w-full h-64 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <p className="text-sm">Click to upload image</p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

