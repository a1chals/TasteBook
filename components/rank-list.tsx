'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import Image from 'next/image'
import { previewScore } from '@/lib/score'
import { getBucketBounds, type BucketKey } from '@/lib/constants'

export interface RankItem {
  id: string
  name: string
  imageUrl?: string | null
  score10?: number
}

interface RankListProps {
  items: RankItem[]
  bucket: BucketKey
  onChange: (items: RankItem[]) => void
  newDishId?: string
}

function SortableItem({
  item,
  position,
  totalItems,
  bucket,
  isNew,
}: {
  item: RankItem
  position: number
  totalItems: number
  bucket: BucketKey
  isNew: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const bounds = getBucketBounds(bucket)
  const projectedScore = previewScore(position, totalItems, bounds)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 border rounded-lg bg-card ${
        isNew ? 'border-primary border-2' : ''
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      {item.imageUrl && (
        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{item.name}</p>
        {isNew && <span className="text-xs text-primary font-medium">New dish</span>}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">#{position + 1}</span>
        <span className="font-semibold text-primary">{projectedScore.toFixed(1)}</span>
      </div>
    </div>
  )
}

export function RankList({ items, bucket, onChange, newDishId }: RankListProps) {
  const [activeItems, setActiveItems] = useState(items)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = activeItems.findIndex((item) => item.id === active.id)
      const newIndex = activeItems.findIndex((item) => item.id === over.id)

      const newItems = arrayMove(activeItems, oldIndex, newIndex)
      setActiveItems(newItems)
      onChange(newItems)
    }
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={activeItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {activeItems.map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              position={index}
              totalItems={activeItems.length}
              bucket={bucket}
              isNew={item.id === newDishId}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

