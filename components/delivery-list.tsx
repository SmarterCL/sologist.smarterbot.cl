"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Delivery, CommuneColors } from "@/types/delivery"
import { Check, GripVertical, MapPin, Navigation, RotateCcw, Save } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeliveryListProps {
  deliveries: Delivery[]
  communeColors: CommuneColors
  onReorder: (deliveries: Delivery[]) => void
  className?: string
}

// Componente para cada elemento arrastrable
function SortableDeliveryItem({
  delivery,
  communeColor,
  isActive = false,
}: {
  delivery: Delivery
  communeColor: string
  isActive?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: delivery.id.toString(),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? "relative" : "static",
    backgroundColor: isDragging ? "#f9fafb" : undefined,
  } as React.CSSProperties

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-3 border rounded-md mb-2 bg-white",
        isDragging ? "shadow-md" : "",
        delivery.status === "completed" ? "opacity-60" : "",
        isActive ? "ring-2 ring-blue-500" : "",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab touch-manipulation p-1 rounded hover:bg-gray-100 active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: communeColor || "#6b7280" }}
          >
            <span className="text-xs font-bold">{delivery.id}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{delivery.address.split(",")[1] || delivery.address}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{delivery.distance} km</span>
              <span>•</span>
              <span>{delivery.estimatedTime}</span>
            </div>
          </div>
        </div>
      </div>

      <Badge
        variant="outline"
        className="text-[10px] whitespace-nowrap"
        style={{
          backgroundColor: `${communeColor}20`,
          color: communeColor || "#4b5563",
          borderColor: `${communeColor}40`,
        }}
      >
        {delivery.commune}
      </Badge>

      {delivery.status === "completed" && (
        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-3 w-3 text-green-600" />
        </div>
      )}
    </div>
  )
}

export function DeliveryList({ deliveries, communeColors, onReorder, className }: DeliveryListProps) {
  const [items, setItems] = useState<Delivery[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Inicializar los items cuando cambian las entregas
  useEffect(() => {
    setItems(deliveries)
    setHasChanges(false)
  }, [deliveries])

  // Configurar los sensores para drag and drop
  const sensors = useSensors(
    // El PointerSensor funciona tanto en móvil como en escritorio
    useSensor(PointerSensor, {
      activationConstraint: {
        // Solo activar después de mover 8px para evitar conflictos con clics
        distance: 8,
      },
    }),
    // Soporte para teclado (accesibilidad)
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Manejar el final del arrastre
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id.toString() === active.id)
        const newIndex = items.findIndex((item) => item.id.toString() === over.id)

        // Reorganizar el array
        const newItems = arrayMove(items, oldIndex, newIndex)

        // Actualizar los IDs para mantener el orden visual
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          id: index + 1,
        }))

        setHasChanges(true)
        return updatedItems
      })
    }

    setActiveId(null)
  }

  // Guardar los cambios
  const handleSaveChanges = () => {
    onReorder(items)
    setHasChanges(false)
  }

  // Restablecer al orden original
  const handleReset = () => {
    setItems(deliveries)
    setHasChanges(false)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Lista de Entregas</h3>
        <div className="flex gap-2">
          {hasChanges && (
            <>
              <Button variant="outline" size="sm" onClick={handleReset} className="h-8 text-xs">
                <RotateCcw className="h-3 w-3 mr-1" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSaveChanges} className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                <Save className="h-3 w-3 mr-1" />
                Guardar
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="p-3 border-gray-200 bg-gray-50 max-h-[calc(100vh-220px)] overflow-y-auto">
        <div className="text-xs text-gray-500 mb-3 flex items-center">
          <GripVertical className="h-4 w-4 mr-1 text-gray-400" />
          <span>Arrastra para reordenar las entregas</span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={(event) => setActiveId(event.active.id.toString())}
        >
          <SortableContext items={items.map((d) => d.id.toString())} strategy={verticalListSortingStrategy}>
            {items.map((delivery) => (
              <SortableDeliveryItem
                key={delivery.id}
                delivery={delivery}
                communeColor={communeColors[delivery.commune] || "#6b7280"}
                isActive={activeId === delivery.id.toString()}
              />
            ))}
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No hay entregas para mostrar</p>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{items.length} entregas en total</span>
        <div className="flex items-center">
          <Navigation className="h-3 w-3 mr-1 text-blue-600" />
          <span>Arrastra para optimizar manualmente</span>
        </div>
      </div>
    </div>
  )
}

