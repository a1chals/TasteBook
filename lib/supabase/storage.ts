import { createClient } from './client'

const BUCKET_NAME = 'dish-images'

export async function uploadDishImage(
  file: File,
  userId: string,
  dishId: string
): Promise<string> {
  const supabase = createClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/${dishId}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return publicUrl
}

export async function deleteDishImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return

  const supabase = createClient()

  // Extract file path from URL
  const urlParts = imageUrl.split(`${BUCKET_NAME}/`)
  if (urlParts.length < 2) return

  const filePath = urlParts[1]

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

  if (error) {
    console.error('Failed to delete image:', error)
  }
}

