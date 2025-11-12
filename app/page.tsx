'use client'

import { useDishStore } from '@/lib/store'
import { BottomNav } from '@/components/bottom-nav'
import DisplayCards from '@/components/ui/display-cards'
import { Plus, List } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const dishes = useDishStore((state) => state.dishes)
  
  const totalDishes = dishes.length

  const handleCardClick = (index: number) => {
    if (index === 0) {
      router.push('/rate')
    } else if (index === 1) {
      router.push('/dishes')
    }
  }

  const cards = [
    {
      icon: <Plus className="size-6 text-violet-300" />,
      title: "Rate a New Dish",
      description: "Add and rank your latest creation",
      date: "Start cooking",
      iconClassName: "text-violet-500",
      titleClassName: "text-violet-500",
      className:
        "[grid-area:stack] hover:-translate-y-16 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 cursor-pointer",
      onClick: () => handleCardClick(0),
    },
    {
      icon: <List className="size-6 text-emerald-300" />,
      title: "View Your Dishes",
      description: `Browse and manage ${totalDishes} dishes`,
      date: "Your collection",
      iconClassName: "text-emerald-500",
      titleClassName: "text-emerald-500",
      className:
        "[grid-area:stack] translate-x-24 translate-y-16 hover:translate-y-2 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 cursor-pointer",
      onClick: () => handleCardClick(1),
    },
  ]

  return (
    <div className="relative min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-2xl font-medium text-foreground">
            TasteBook
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-xl font-medium text-foreground">What would you like to do?</h2>
          </div>
          
          <div 
            onClick={(e) => {
              const target = e.target as HTMLElement
              const cardElement = target.closest('[data-card-index]') as HTMLElement
              if (cardElement) {
                const index = parseInt(cardElement.getAttribute('data-card-index') || '0')
                handleCardClick(index)
              }
            }}
          >
            <DisplayCards cards={cards.map((card, i) => ({
              ...card,
              className: `${card.className} [&]:data-card-index-${i}`,
            }))} />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
