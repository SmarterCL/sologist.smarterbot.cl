"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Truck3DViewProps {
  className?: string
}

export function Truck3DView({ className }: Truck3DViewProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [viewMode, setViewMode] = useState<"top" | "side" | "back">("top")

  useEffect(() => {
    // Simular carga del modelo 3D
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vista 3D del Camión HINO</h3>
        <div className="flex gap-2">
          <Button variant={viewMode === "top" ? "default" : "outline"} size="sm" onClick={() => setViewMode("top")}>
            Superior
          </Button>
          <Button variant={viewMode === "side" ? "default" : "outline"} size="sm" onClick={() => setViewMode("side")}>
            Lateral
          </Button>
          <Button variant={viewMode === "back" ? "default" : "outline"} size="sm" onClick={() => setViewMode("back")}>
            Posterior
          </Button>
        </div>
      </div>

      <Card className="aspect-video relative overflow-hidden">
        {!isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="mb-3 h-8 w-8 animate-spin rounded-full border-3 border-gray-300 border-t-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500">Cargando modelo 3D...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-100">
            {viewMode === "top" && (
              <div className="w-full h-full flex items-center justify-center">
                {/* Vista superior del camión */}
                <div className="relative w-4/5 h-3/5 border-2 border-gray-800 bg-white">
                  {/* Cabina */}
                  <div className="absolute top-0 left-0 w-1/5 h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Cabina</span>
                  </div>

                  {/* Área de carga */}
                  <div className="absolute top-0 left-1/5 right-0 h-full bg-gray-200 p-2">
                    {/* Pallets */}
                    <div className="absolute top-1/4 left-1/6 w-1/4 h-2/4 border border-gray-400 bg-yellow-100 flex items-center justify-center">
                      <span className="text-xs text-gray-600">Pallet 1</span>
                    </div>
                    <div className="absolute top-1/4 left-1/2 w-1/4 h-2/4 border border-gray-400 bg-yellow-100 flex items-center justify-center">
                      <span className="text-xs text-gray-600">Pallet 2</span>
                    </div>
                    <div className="absolute top-1/4 right-1/6 w-1/4 h-2/4 border border-gray-400 bg-yellow-100 flex items-center justify-center">
                      <span className="text-xs text-gray-600">Pallet 3</span>
                    </div>

                    {/* Dimensiones */}
                    <div className="absolute -top-6 left-0 right-0 flex justify-center">
                      <span className="text-xs bg-white px-1 border border-gray-400">220 cm</span>
                    </div>
                    <div className="absolute top-0 -right-6 bottom-0 flex items-center">
                      <span className="text-xs bg-white px-1 border border-gray-400 rotate-90">520 cm</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === "side" && (
              <div className="w-full h-full flex items-center justify-center">
                {/* Vista lateral del camión */}
                <div className="relative w-4/5 h-2/5 border-2 border-gray-800 bg-white">
                  {/* Cabina */}
                  <div className="absolute top-0 left-0 w-1/5 h-full bg-gray-700 rounded-l-sm flex items-center justify-center">
                    <span className="text-white text-xs font-medium">Cabina</span>
                  </div>

                  {/* Área de carga */}
                  <div className="absolute top-0 left-1/5 right-0 h-full bg-gray-200 p-2">
                    {/* Dimensiones */}
                    <div className="absolute -top-6 left-0 right-0 flex justify-center">
                      <span className="text-xs bg-white px-1 border border-gray-400">220 cm</span>
                    </div>
                    <div className="absolute top-0 -right-6 bottom-0 flex items-center">
                      <span className="text-xs bg-white px-1 border border-gray-400 rotate-90">520 cm</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === "back" && (
              <div className="w-full h-full flex items-center justify-center">
                {/* Vista posterior del camión */}
                <div className="relative w-2/5 h-3/5 border-2 border-gray-800 bg-gray-200">
                  {/* Puertas traseras */}
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full border-r border-gray-400 flex items-center justify-center">
                      <span className="text-xs text-gray-600 rotate-90">Puerta</span>
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center">
                      <span className="text-xs text-gray-600 rotate-90">Puerta</span>
                    </div>
                  </div>

                  {/* Dimensiones */}
                  <div className="absolute -top-6 left-0 right-0 flex justify-center">
                    <span className="text-xs bg-white px-1 border border-gray-400">220 cm</span>
                  </div>
                  <div className="absolute top-0 -right-6 bottom-0 flex items-center">
                    <span className="text-xs bg-white px-1 border border-gray-400 rotate-90">220 cm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="text-sm text-gray-600">
        <p>
          El camión HINO 300 (Serie 816) cuenta con una caja cerrada de 220cm × 220cm × 520cm, con capacidad para 3
          pallets estándar y puertas traseras de apertura completa para facilitar la carga y descarga de
          electrodomésticos y muebles de gran tamaño.
        </p>
      </div>
    </div>
  )
}

