import { ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  description?: string
  showCta?: boolean
}

export function EmptyState({
  title = "No dishes yet",
  description = "Start rating your homemade dishes to build your personal ranking!",
  showCta = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <ChefHat className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {showCta && (
        <Button asChild>
          <Link href="/rate">Rate Your First Dish</Link>
        </Button>
      )}
    </div>
  )
}

