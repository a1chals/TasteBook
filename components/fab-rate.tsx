'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'

export function FABRate() {
  return (
    <Link
      href="/rate"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
    >
      <Plus className="h-6 w-6" />
    </Link>
  )
}

