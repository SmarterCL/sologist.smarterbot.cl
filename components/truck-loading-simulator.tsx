"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, RefreshCw, Info, ArrowRight, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// Tipos para los datos
interface DeliveryItem {
  id: number
  address: string
  commune: string
  status: "pending" | "completed"
  packageSize: "small" | "medium" | "large" | "extra-large"
  packageType: "refrigerador" | "lavadora" | "cocina" | "microondas" | "televisor" | "otro"
}

interface CommuneColors {
  [key: string]: string
}

interface TruckLoadingSimulatorProps {
  deliveries?: DeliveryItem[]
  communeColors?: CommuneColors
  isLoading?: boolean
}

// Tamaños de paquetes en unidades relativas
const packageSizes = {
  small: { width: 1, height: 1 },
  medium: { width: 1, height: 2 },
  large: { width: 2, height: 2 },
  "extra-large": { width: 2, height: 3 },
}

// Iconos para tipos de paquetes
const packageIcons = {
  refrigerador: "❄️",
  lavadora: "🧺",
  cocina: "🍳",
  microondas: "📱",
  televisor: "📺",
  otro: "📦",
}

export function TruckLoadingSimulator({
  deliveries = [],
  communeColors = {},
  isLoading = false,
}: TruckLoadingSimulatorProps) {
  const [loadingOrder, setLoadingOrder] = useState<DeliveryItem[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"loading" | "unloading">("loading")

  // Generar datos de ejemplo si no se proporcionan
  useEffect(() => {
    if (deliveries.length === 0 && !isLoading) {
      const sampleDeliveries: DeliveryItem[] = Array.from({ length: 15 }, (_, i) => {
        const communes = ["PUENTE ALTO", "SAN RAMON", "LA GRANJA", "SAN JOAQUIN", "SANTIAGO"]
        const packageTypes = ["refrigerador", "lavadora", "cocina", "microondas", "televisor", "otro"] as const
        const packageSizeTypes = ["small", "medium", "large", "extra-large"] as const

        return {
          id: i + 1,
          address: `Dirección de ejemplo ${i + 1}`,
          commune: communes[Math.floor(Math.random() * communes.length)],
          status: Math.random() > 0.2 ? "pending" : "completed",
          packageSize: packageSizeTypes[Math.floor(Math.random() * packageSizeTypes.length)],
          packageType: packageTypes[Math.floor(Math.random() * packageTypes.length)],
        }
      })

      optimizeLoadingOrder(sampleDeliveries)
    } else if (deliveries.length > 0) {
      optimizeLoadingOrder(deliveries)
    }
  }, [deliveries, isLoading])

  // Optimizar el orden de carga (inverso al orden de entrega)
  const optimizeLoadingOrder = (items: DeliveryItem[]) => {
    // En un caso real, aquí implementaríamos un algoritmo más complejo
    // Para este ejemplo, simplemente invertimos el orden de entrega
    // La última entrega debe ser la primera en cargar (LIFO - Last In, First Out)
    const optimizedOrder = viewMode === "loading" ? [...items].reverse() : [...items]

    setLoadingOrder(optimizedOrder)
  }

  // Cambiar entre modos de visualización (carga/descarga)
  const toggleViewMode = () => {
    const newMode = viewMode === "loading" ? "unloading" : "loading"
    setViewMode(newMode)
    optimizeLoadingOrder(loadingOrder)
  }

  // Colores por defecto si no se proporcionan
  const defaultColors: CommuneColors = {
    "PUENTE ALTO": "#f87171",
    "SAN RAMON": "#60a5fa",
    "LA GRANJA": "#34d399",
    "SAN JOAQUIN": "#fbbf24",
    SANTIAGO: "#a78bfa",
  }

  const colors = Object.keys(communeColors).length > 0 ? communeColors : defaultColors

  // Algoritmo simple para posicionar las cajas en el camión
  const positionPackages = () => {
    const truckWidth = 10 // Unidades de ancho del camión
    const truckLength = 20 // Unidades de largo del camión

    // Matriz para representar el espacio del camión
    const truckSpace = Array(truckLength)
      .fill(0)
      .map(() => Array(truckWidth).fill(null))

    // Posicionar cada paquete
    const positionedPackages = []

    for (const item of loadingOrder) {
      const { width, height } = packageSizes[item.packageSize]
      let placed = false

      // Intentar colocar el paquete desde la parte trasera del camión
      for (let y = truckLength - 1; y >= 0 && !placed; y--) {
        for (let x = 0; x < truckWidth - width + 1 && !placed; x++) {
          // Verificar si el espacio está disponible
          let canPlace = true
          for (let dy = 0; dy < height && canPlace; dy++) {
            for (let dx = 0; dx < width && canPlace; dx++) {
              if (y - dy < 0 || truckSpace[y - dy][x + dx] !== null) {
                canPlace = false
              }
            }
          }

          // Si podemos colocar el paquete, lo hacemos
          if (canPlace) {
            for (let dy = 0; dy < height; dy++) {
              for (let dx = 0; dx < width; dx++) {
                if (y - dy >= 0) {
                  truckSpace[y - dy][x + dx] = item.id
                }
              }
            }

            positionedPackages.push({
              ...item,
              position: {
                x,
                y: y - height + 1,
                width,
                height,
              },
            })

            placed = true
          }
        }
      }

      // Si no pudimos colocar el paquete, lo colocamos en algún lugar disponible
      if (!placed) {
        for (let y = 0; y < truckLength; y++) {
          for (let x = 0; x < truckWidth - width + 1; x++) {
            let canPlace = true
            for (let dy = 0; dy < height && canPlace; dy++) {
              for (let dx = 0; dx < width && canPlace; dx++) {
                if (y + dy >= truckLength || truckSpace[y + dy][x + dx] !== null) {
                  canPlace = false
                }
              }
            }

            if (canPlace) {
              for (let dy = 0; dy < height; dy++) {
                for (let dx = 0; dx < width; dx++) {
                  if (y + dy < truckLength) {
                    truckSpace[y + dy][x + dx] = item.id
                  }
                }
              }

              positionedPackages.push({
                ...item,
                position: {
                  x,
                  y,
                  width,
                  height,
                },
              })

              placed = true
              break
            }
          }
          if (placed) break
        }
      }
    }

    return positionedPackages
  }

  const positionedPackages = positionPackages()

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Simulación de Carga</h2>
          <p className="text-xs text-gray-500 sm:text-sm">
            {viewMode === "loading"
              ? "Orden de carga del camión (último en entregarse, primero en cargarse)"
              : "Orden de descarga (ruta de entrega)"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
            className="h-8 w-8"
            aria-label={showHelp ? "Ocultar ayuda" : "Mostrar ayuda"}
          >
            <Info className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={toggleViewMode} className="h-8">
            {viewMode === "loading" ? (
              <>
                <Package className="h-4 w-4 mr-1" />
                <span className="text-xs">Ver descarga</span>
              </>
            ) : (
              <>
                <Truck className="h-4 w-4 mr-1" />
                <span className="text-xs">Ver carga</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {showHelp && (
        <Card className="p-3 mb-4 bg-blue-50 border-blue-200 text-blue-800">
          <div className="text-xs space-y-2">
            <p className="font-medium">¿Cómo funciona la simulación de carga?</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Las cajas se cargan en orden inverso a la entrega (LIFO)</li>
              <li>El color de cada caja corresponde a la comuna de destino</li>
              <li>El número en cada caja indica el orden de entrega</li>
              <li>Los símbolos indican el tipo de electrodoméstico</li>
              <li>Pase el cursor sobre una caja para ver más detalles</li>
            </ul>
          </div>
        </Card>
      )}

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Calculando orden óptimo de carga...</p>
            </div>
          </div>
        ) : loadingOrder.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No hay entregas para simular</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Vista del camión desde arriba */}
            <div className="relative border-2 border-gray-800 rounded-md h-64 sm:h-96 mb-4 mx-auto w-full max-w-3xl bg-gray-100">
              {/* Cabina del camión */}
              <div className="absolute top-0 left-0 right-0 h-10 sm:h-16 bg-gray-700 rounded-t-sm flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-medium">Cabina</span>
              </div>

              {/* Área de carga */}
              <div className="absolute top-10 sm:top-16 left-0 right-0 bottom-0 bg-gray-200 p-1 sm:p-2">
                {/* Paquetes posicionados */}
                {positionedPackages.map((item) => {
                  const { x, y, width, height } = item.position!
                  const scaleX = 100 / 10 // 10 unidades de ancho
                  const scaleY = 100 / 20 // 20 unidades de largo

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "absolute border-2 flex items-center justify-center transition-all duration-200",
                        highlightedItem === item.id ? "ring-2 ring-offset-2 ring-blue-500 z-10" : "",
                        item.status === "completed" ? "opacity-50" : "",
                      )}
                      style={{
                        left: `${x * scaleX}%`,
                        top: `${y * scaleY}%`,
                        width: `${width * scaleX}%`,
                        height: `${height * scaleY}%`,
                        backgroundColor: colors[item.commune] || "#9ca3af",
                        borderColor: highlightedItem === item.id ? "#3b82f6" : "#4b5563",
                      }}
                      onMouseEnter={() => setHighlightedItem(item.id)}
                      onMouseLeave={() => setHighlightedItem(null)}
                    >
                      <div className="flex flex-col items-center justify-center p-1 text-white">
                        <span className="text-xs sm:text-sm font-bold">
                          {viewMode === "loading"
                            ? loadingOrder.length - loadingOrder.findIndex((d) => d.id === item.id)
                            : item.id}
                        </span>
                        <span className="text-lg sm:text-2xl">{packageIcons[item.packageType]}</span>
                      </div>
                    </div>
                  )
                })}

                {/* Indicador de dirección de carga/descarga */}
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-white/80 rounded-full p-1 shadow-sm">
                  {viewMode === "loading" ? (
                    <ArrowLeft className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </div>
            </div>

            {/* Lista de paquetes */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Lista de Electrodomésticos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {loadingOrder.map((item, index) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "p-2 text-xs border-l-4 transition-all",
                      highlightedItem === item.id ? "ring-2 ring-blue-500" : "",
                      item.status === "completed" ? "opacity-60" : "",
                    )}
                    style={{ borderLeftColor: colors[item.commune] || "#9ca3af" }}
                    onMouseEnter={() => setHighlightedItem(item.id)}
                    onMouseLeave={() => setHighlightedItem(null)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{packageIcons[item.packageType]}</span>
                          <span className="font-medium">
                            {viewMode === "loading"
                              ? `Posición ${loadingOrder.length - index} de ${loadingOrder.length}`
                              : `Entrega ${index + 1} de ${loadingOrder.length}`}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1 truncate">{item.address}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] whitespace-nowrap"
                        style={{
                          backgroundColor: `${colors[item.commune]}20`,
                          color: colors[item.commune] || "#4b5563",
                          borderColor: `${colors[item.commune]}40`,
                        }}
                      >
                        {item.commune}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

