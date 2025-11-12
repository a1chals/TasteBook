'use client'

import { Home, List, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  
  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dishes', icon: List, label: 'Dishes' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center justify-around px-4 py-3">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl px-6 py-2 transition-colors',
                isActive
                  ? 'text-slate-600'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

