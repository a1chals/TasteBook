'use client'

import { create } from 'zustand'
import { Dish, BucketKey } from './types'

interface DishStore {
  dishes: Dish[]
  addDish: (dish: Omit<Dish, 'id' | 'createdAt'>) => void
  updateDish: (id: string, dish: Partial<Dish>) => void
  deleteDish: (id: string) => void
  getDishById: (id: string) => Dish | undefined
  getDishesByBucket: (bucket: BucketKey) => Dish[]
}

const sampleDishes: Dish[] = []

export const useDishStore = create<DishStore>((set, get) => ({
  dishes: sampleDishes,
  
  addDish: (dish) => {
    const newDish: Dish = {
      ...dish,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ dishes: [newDish, ...state.dishes] }))
  },
  
  updateDish: (id, updates) => {
    set((state) => ({
      dishes: state.dishes.map((dish) =>
        dish.id === id ? { ...dish, ...updates } : dish
      ),
    }))
  },
  
  deleteDish: (id) => {
    set((state) => ({
      dishes: state.dishes.filter((dish) => dish.id !== id),
    }))
  },
  
  getDishById: (id) => {
    return get().dishes.find((dish) => dish.id === id)
  },
  
  getDishesByBucket: (bucket) => {
    return get().dishes.filter((dish) => dish.bucket === bucket)
  },
}))

