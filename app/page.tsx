'use client'

import { useEffect, useState } from 'react'
import { useDishStore } from '@/lib/store'
import { BottomNav3D } from '@/components/bottom-nav-3d'
import DisplayCards from '@/components/ui/display-cards'
import { Plus, List, LogIn, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

export default function Home() {
  const router = useRouter()
  const dishes = useDishStore((state) => state.dishes)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  
  const totalDishes = dishes.length

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleCardClick = (index: number) => {
    if (index === 0) {
      router.push('/rate')
    } else if (index === 1) {
      router.push('/dishes')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - show sign in page
  if (!user) {
    return (
      <div className="relative min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-medium text-foreground">
              TasteBook
            </h1>
            <Button onClick={() => router.push('/auth/signin')} variant="outline" size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-8">
          <div className="w-full max-w-3xl text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-600 via-slate-500 to-emerald-400 bg-clip-text text-transparent">
                Your Personal Dish Rating System
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Rate, rank, and track your homemade dishes
              </p>
              <Button onClick={() => router.push('/auth/signin')} size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated - show main app
  const cards = [
    {
      icon: <Plus className="size-6 text-slate-400" />,
      title: "Rate a New Dish",
      description: "Add and rank your latest creation",
      date: "Start cooking",
      iconClassName: "text-slate-600",
      titleClassName: "text-slate-600",
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
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-medium text-foreground">
            TasteBook
          </h1>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
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

          <BottomNav3D />
    </div>
  )
}
