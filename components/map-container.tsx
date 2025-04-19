"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  MapPin,
  FileSpreadsheet,
  RefreshCw,
  Clock,
  Route,
  Info,
  X,
  Maximize,
  Minimize,
  ChevronLeft,
  Home,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import type { Delivery, CommuneColors, RouteStats, OptimizationType } from "@/types/delivery"
import type { RouteOptimizationOptions } from "@/components/route-optimizer"

interface MapContainerProps {
  importedData?: string | null
  optimizationConfig?: {
    type: OptimizationType
    options: RouteOptimizationOptions
  } | null
  onToggleFullscreen?: (isFullscreen: boolean) => void
  deliveries?: Delivery[] // Nueva prop para recibir entregas directamente
}

export function MapContainer({
  importedData = null,
  optimizationConfig = null,
  onToggleFullscreen,
  deliveries: externalDeliveries = [], // Recibir entregas externas
}: MapContainerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasDirections, setHasDirections] = useState(false)
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [isProcessingData, setIsProcessingData] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [routeStats, setRouteStats] = useState<RouteStats>({
    totalDistance: 0,
    totalTime: "0h 0min",
    totalPoints: 0,
    completedPoints: 0,
    pendingPoints: 0,
    optimizationType: "Sin optimizar",
  })

  // Colores para las diferentes comunas - Paleta más suave
  const communeColors: CommuneColors = {
    "PUENTE ALTO": "#f87171", // Rojo más suave
    "SAN RAMON": "#60a5fa", // Azul más suave
    "LA GRANJA": "#34d399", // Verde más suave
    "SAN JOAQUIN": "#fbbf24", // Amarillo más suave
    "LA FLORIDA": "#a78bfa", // Púrpura más suave
    MAIPÚ: "#f472b6", // Rosa más suave
    SANTIAGO: "#22d3ee", // Cian más suave
  }

  // Función para extraer la comuna desde la dirección
  const extractCommune = (address: string): string => {
    if (address.startsWith("PUENTE ALTO")) return "PUENTE ALTO"
    if (address.startsWith("SAN RAMON")) return "SAN RAMON"
    if (address.startsWith("LA GRANJA")) return "LA GRANJA"
    if (address.startsWith("SAN JOAQUIN")) return "SAN JOAQUIN"
    return "SANTIAGO" // Default
  }

  // Función para generar posiciones aleatorias pero consistentes para las direcciones
  const generatePosition = (
    index: number,
    total: number,
    commune: string,
    optimizationType: OptimizationType = "distance",
    returnToDepot = true,
    communeWeighting = 50,
  ): { top: string; left: string } => {
    // Valores base para el centro de cada comuna
    const communeCenters: { [key: string]: { top: number; left: number } } = {
      "PUENTE ALTO": { top: 35, left: 65 },
      "SAN RAMON": { top: 55, left: 45 },
      "LA GRANJA": { top: 65, left: 55 },
      "SAN JOAQUIN": { top: 45, left: 35 },
      SANTIAGO: { top: 40, left: 50 },
    }

    // Centro del depósito Mersan
    const depotTop = 40
    const depotLeft = 50

    // Diferentes estrategias de posicionamiento según el tipo de optimización
    if (optimizationType === "commune" || (optimizationType === "hybrid" && communeWeighting > 50)) {
      // Agrupar por comuna
      const center = communeCenters[commune] || { top: depotTop, left: depotLeft }

      // Para 'commune-radius', organizamos en círculo dentro de cada comuna
      if (optimizationType === "commune-radius") {
        const communeDeliveries = deliveries.filter((d) => d.commune === commune)
        const communeIndex = communeDeliveries.findIndex((d) => d.id === index + 1)
        const communeTotal = communeDeliveries.length

        const angle = (communeIndex / communeTotal) * 2 * Math.PI
        const radius = 10 // Radio dentro de la comuna

        return {
          top: `${center.top + radius * Math.sin(angle)}%`,
          left: `${center.left + radius * Math.cos(angle)}%`,
        }
      }

      // Para 'commune', distribuimos aleatoriamente dentro de la comuna
      return {
        top: `${center.top + (Math.random() * 20 - 10)}%`,
        left: `${center.left + (Math.random() * 20 - 10)}%`,
      }
    }

    // Para optimización por distancia o híbrido con peso en distancia
    if (
      optimizationType === "distance" ||
      optimizationType === "distance-reverse" ||
      (optimizationType === "hybrid" && communeWeighting <= 50)
    ) {
      // Crear un patrón en espiral desde el depósito
      let normalizedIndex = index

      // Para orden inverso, invertimos el índice
      if (optimizationType === "distance-reverse") {
        normalizedIndex = total - index - 1
      }

      const angle = (normalizedIndex / total) * 2 * Math.PI * 2 // Dos vueltas completas
      const radius = 10 + (normalizedIndex / total) * 30 // Radio creciente

      return {
        top: `${depotTop + radius * Math.sin(angle)}%`,
        left: `${depotLeft + radius * Math.cos(angle)}%`,
      }
    }

    // Fallback a distribución circular simple
    const angle = (index / total) * 2 * Math.PI
    const radius = 25 + (index % 3) * 10

    return {
      top: `${depotTop + radius * Math.sin(angle)}%`,
      left: `${depotLeft + radius * Math.cos(angle)}%`,
    }
  }

  // Procesar los datos importados
  useEffect(() => {
    if (importedData) {
      setIsProcessingData(true)

      // Simular procesamiento de datos
      setTimeout(() => {
        try {
          // Aquí procesaríamos los datos reales del Google Sheet
          // Para esta demo, generaremos datos basados en el ejemplo proporcionado

          // Simular datos del Google Sheet
          const addresses = [
            "PUENTE ALTO, CAMILO HENRIQUEZ 1234",
            "PUENTE ALTO, CERRO PLOMO 414 CASA",
            "PUENTE ALTO, COQUIMBO 346",
            "PUENTE ALTO, COQUIMBO 1951",
            "PUENTE ALTO, EL HUALLE 2393",
            "PUENTE ALTO, EL TIMBAL 01753 PU",
            "PUENTE ALTO, GENARO PRIETO 1035",
            "PUENTE ALTO, JARDIN ALTO 1881 1881 VILLA ARCO IRIS",
            "PUENTE ALTO, LEONARDO DA VINCI 992 CASA",
            "PUENTE ALTO, LOS SICOMOROS 2328",
            "PUENTE ALTO, NONATO COO 2466",
            "PUENTE ALTO, PJE. SARMIENTO 0549 VILLA LA PRIMAVERA",
            "PUENTE ALTO, TENIENTE BELLO 414 LUIS MATTE",
            "PUENTE ALTO, TOME 646 DPTO 23",
            "PUENTE ALTO, TOSCANINI 01461 DPTO 36",
            "PUENTE ALTO, TRENTO SUR 428 CASA",
            "PUENTE ALTO, VERDE 1843",
            "SAN JOAQUIN, SEBASTOPOL 324 CASA",
            "SAN RAMON, ELIAS FERNANDEZ ALBANO 8163 8163 8163",
            "SAN RAMON, EMILIANO FIGUEROA 8530",
            "SAN RAMON, LO CANAS 8522 CASA",
            "SAN RAMON, VOLCAN 8595 CASA",
            "LA GRANJA, AV. CARDENAL RAUL SILVA HENRIQUEZ 9251 9251 9251",
          ]

          const newDeliveries = addresses.map((address, index) => {
            const commune = extractCommune(address)
            return {
              id: index + 1,
              address,
              commune,
              status: index < 3 ? "completed" : "pending",
              position: generatePosition(index, addresses.length, commune),
              distance: Math.round((Math.random() * 5 + 1) * 10) / 10, // Distancia aleatoria entre 1 y 6 km
              estimatedTime: `${Math.floor(Math.random() * 15 + 5)}min`, // Tiempo aleatorio entre 5 y 20 min
            }
          })

          setDeliveries(newDeliveries)
          setHasDirections(true)

          // Calcular estadísticas de la ruta
          const totalDistance = newDeliveries.reduce((sum, delivery) => sum + (delivery.distance || 0), 0)
          const totalMinutes = newDeliveries.reduce((sum, delivery) => {
            const timeStr = delivery.estimatedTime || "0min"
            const minutes = Number.parseInt(timeStr.replace("min", ""))
            return sum + minutes
          }, 0)

          const hours = Math.floor(totalMinutes / 60)
          const minutes = totalMinutes % 60

          setRouteStats({
            totalDistance: Math.round(totalDistance * 10) / 10,
            totalTime: `${hours}h ${minutes}min`,
            totalPoints: newDeliveries.length,
            completedPoints: newDeliveries.filter((d) => d.status === "completed").length,
            pendingPoints: newDeliveries.filter((d) => d.status === "pending").length,
            optimizationType: "Sin optimizar",
          })

          setIsProcessingData(false)
        } catch (error) {
          console.error("Error processing data:", error)
          setIsProcessingData(false)
        }
      }, 2000)
    }
  }, [importedData])

  // Actualizar cuando cambian las entregas externas
  useEffect(() => {
    if (externalDeliveries.length > 0) {
      setDeliveries(externalDeliveries)
      setHasDirections(true)

      // Calcular estadísticas de la ruta
      const totalDistance = externalDeliveries.reduce((sum, delivery) => sum + (delivery.distance || 0), 0)
      const totalMinutes = externalDeliveries.reduce((sum, delivery) => {
        const timeStr = delivery.estimatedTime || "0min"
        const minutes = Number.parseInt(timeStr.replace("min", ""))
        return sum + minutes
      }, 0)

      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60

      setRouteStats({
        totalDistance: Math.round(totalDistance * 10) / 10,
        totalTime: `${hours}h ${minutes}min`,
        totalPoints: externalDeliveries.length,
        completedPoints: externalDeliveries.filter((d) => d.status === "completed").length,
        pendingPoints: externalDeliveries.filter((d) => d.status === "pending").length,
        optimizationType: optimizationConfig?.type === "manual" ? "Orden manual" : "Sin optimizar",
      })
    }
  }, [externalDeliveries])

  // Optimizar la ruta cuando cambia la configuración de optimización
  useEffect(() => {
    if (optimizationConfig && hasDirections) {
      setIsProcessingData(true)

      // Simular procesamiento de optimización
      setTimeout(() => {
        try {
          const { type, options } = optimizationConfig
          const { returnToDepot, communeWeighting } = options

          // Reordenar las entregas según el tipo de optimización
          let optimizedDeliveries = [...deliveries]

          if (type === "distance") {
            // Ordenar por distancia ascendente
            optimizedDeliveries.sort((a, b) => (a.distance || 0) - (b.distance || 0))
          } else if (type === "distance-reverse") {
            // Ordenar por distancia descendente
            optimizedDeliveries.sort((a, b) => (b.distance || 0) - (a.distance || 0))
          } else if (type === "commune") {
            // Agrupar por comuna
            optimizedDeliveries.sort((a, b) => a.commune.localeCompare(b.commune))

            // Dentro de cada comuna, ordenar por distancia
            const communeGroups: Record<string, Delivery[]> = {}
            optimizedDeliveries.forEach((delivery) => {
              if (!communeGroups[delivery.commune]) {
                communeGroups[delivery.commune] = []
              }
              communeGroups[delivery.commune].push(delivery)
            })

            // Ordenar cada grupo por distancia
            Object.keys(communeGroups).forEach((commune) => {
              communeGroups[commune].sort((a, b) => (a.distance || 0) - (b.distance || 0))
            })

            // Reconstruir el array ordenado
            optimizedDeliveries = Object.values(communeGroups).flat()
          } else if (type === "hybrid") {
            // Primero agrupar por comuna
            const communeGroups: Record<string, Delivery[]> = {}
            optimizedDeliveries.forEach((delivery) => {
              if (!communeGroups[delivery.commune]) {
                communeGroups[delivery.commune] = []
              }
              communeGroups[delivery.commune].push(delivery)
            })

            // Ordenar cada grupo por distancia
            Object.keys(communeGroups).forEach((commune) => {
              communeGroups[commune].sort((a, b) => (a.distance || 0) - (b.distance || 0))
            })

            // Ordenar las comunas por distancia promedio al depósito
            const communeAvgDistances = Object.keys(communeGroups).map((commune) => {
              const avgDistance =
                communeGroups[commune].reduce((sum, d) => sum + (d.distance || 0), 0) / communeGroups[commune].length
              return { commune, avgDistance }
            })

            communeAvgDistances.sort((a, b) => a.avgDistance - b.avgDistance)

            // Reconstruir el array ordenado según el peso de comuna vs distancia
            if (communeWeighting > 50) {
              // Priorizar agrupación por comuna
              optimizedDeliveries = communeAvgDistances.flatMap((c) => communeGroups[c.commune])
            } else {
              // Priorizar distancia global
              optimizedDeliveries.sort((a, b) => (a.distance || 0) - (b.distance || 0))
            }
          }

          // Reasignar IDs y posiciones
          optimizedDeliveries = optimizedDeliveries.map((delivery, index) => ({
            ...delivery,
            id: index + 1,
            position: generatePosition(
              index,
              optimizedDeliveries.length,
              delivery.commune,
              type,
              returnToDepot,
              communeWeighting,
            ),
          }))

          setDeliveries(optimizedDeliveries)

          // Calcular distancia total incluyendo retorno al depósito si está habilitado
          let totalDistance = optimizedDeliveries.reduce((sum, delivery) => sum + (delivery.distance || 0), 0)

          // Añadir distancia de retorno al depósito si está habilitado
          if (returnToDepot && optimizedDeliveries.length > 0) {
            // Simular distancia de retorno (en un caso real, calcularíamos la distancia real)
            const lastDelivery = optimizedDeliveries[optimizedDeliveries.length - 1]
            const returnDistance = Math.round((Math.random() * 3 + 2) * 10) / 10 // Entre 2 y 5 km
            totalDistance += returnDistance
          }

          // Actualizar estadísticas con el tipo de optimización
          setRouteStats({
            ...routeStats,
            totalDistance: Math.round(totalDistance * 10) / 10,
            optimizationType:
              type === "distance"
                ? "Por distancia (menor a mayor)"
                : type === "distance-reverse"
                  ? "Por distancia (mayor a menor)"
                  : type === "commune"
                    ? "Por comunas"
                    : type === "hybrid"
                      ? "Híbrido (comuna + distancia)"
                      : "Por radio dentro de comuna",
          })

          setIsProcessingData(false)
        } catch (error) {
          console.error("Error optimizing route:", error)
          setIsProcessingData(false)
        }
      }, 2000)
    }
  }, [optimizationConfig])

  // Auto-hide stats and legend on mobile
  useEffect(() => {
    if (isMobile) {
      setShowStats(false)
      setShowLegend(false)
    } else {
      setShowStats(true)
      setShowLegend(true)
    }
  }, [isMobile])

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Manejar el cambio de pantalla completa
  const toggleFullscreen = () => {
    const newState = !isFullscreen
    setIsFullscreen(newState)

    // Notificar al componente padre
    if (onToggleFullscreen) {
      onToggleFullscreen(newState)
    }

    // Si estamos entrando en modo pantalla completa, asegurarnos de que las estadísticas y la leyenda estén visibles
    if (newState) {
      setShowStats(true)
      setShowLegend(true)
    }
  }

  // Manejar clic en el mapa para alternar pantalla completa
  const handleMapClick = () => {
    if (!isProcessingData && hasDirections) {
      toggleFullscreen()
    }
  }

  // Verificar si la ruta debe volver al depósito
  const shouldReturnToDepot = optimizationConfig?.options?.returnToDepot !== false

  return (
    <div
      ref={mapContainerRef}
      className={cn(
        "relative w-full transition-all duration-300 ease-in-out",
        isFullscreen ? "fixed inset-0 z-50 h-screen" : "h-full",
      )}
    >
      <div
        className={cn(
          "flex justify-between items-center bg-white border-b",
          isFullscreen ? "p-2 sm:p-3" : "p-2 sm:p-4",
        )}
      >
        <div className="flex items-center">
          {isFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="mr-2 text-gray-600 hover:text-gray-900"
              aria-label="Volver a vista normal"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="text-xs sm:text-sm">Volver</span>
            </Button>
          )}
          <h2 className={cn("font-semibold", isFullscreen ? "text-sm sm:text-base" : "text-base sm:text-xl")}>
            Mapa de Ruta
          </h2>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {isMobile && hasDirections && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowStats(!showStats)}
              aria-label={showStats ? "Ocultar estadísticas" : "Mostrar estadísticas"}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}

          {isMobile && hasDirections && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowLegend(!showLegend)}
              aria-label={showLegend ? "Ocultar leyenda" : "Mostrar leyenda"}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          )}

          {hasDirections && !isFullscreen && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={toggleFullscreen}
              aria-label="Ver mapa en pantalla completa"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          )}

          {hasDirections && isFullscreen && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={toggleFullscreen}
              aria-label="Salir de pantalla completa"
            >
              <Minimize className="h-4 w-4" />
            </Button>
          )}

          {hasDirections && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHasDirections(false)}
              className="text-xs sm:text-sm h-8"
            >
              <RefreshCw className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Reiniciar</span>
            </Button>
          )}
        </div>
      </div>

      {isLoaded && !hasDirections ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-50">
          <div className="text-center p-4 max-w-md sm:p-6">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center sm:h-12 sm:w-12 sm:mb-4">
              <FileSpreadsheet className="h-5 w-5 text-gray-500 sm:h-6 sm:w-6" />
            </div>
            <h3 className="text-base font-medium mb-1 sm:text-lg sm:mb-2">No hay direcciones</h3>
            <p className="text-xs text-gray-500 mb-3 sm:text-sm sm:mb-4">
              Importe direcciones desde Google Sheet para comenzar.
            </p>
          </div>
        </div>
      ) : isLoaded && isProcessingData ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-50">
          <div className="text-center p-4 max-w-md sm:p-6">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin sm:h-12 sm:w-12 sm:mb-4">
              <RefreshCw className="h-10 w-10 text-blue-500 sm:h-12 sm:w-12" />
            </div>
            <h3 className="text-base font-medium mb-1 sm:text-lg sm:mb-2">Procesando direcciones</h3>
            <p className="text-xs text-gray-500 mb-3 sm:text-sm sm:mb-4">
              Optimizando ruta para {deliveries.length || 25} puntos de entrega...
            </p>
          </div>
        </div>
      ) : isLoaded && hasDirections ? (
        <div className="h-full w-full bg-gray-50" onClick={isMobile ? handleMapClick : undefined}>
          {/* Mapa con ruta */}
          <div className="h-full w-full relative bg-[#e8e6e1]">
            {/* Leyenda de comunas */}
            {showLegend && (
              <Card
                className={cn(
                  "absolute z-10 bg-white/95 shadow-md",
                  isFullscreen
                    ? "top-2 right-2 p-2 rounded-md max-w-[120px] sm:max-w-none sm:top-4 sm:right-4 sm:p-3"
                    : "top-2 right-2 p-2 rounded-md max-w-[120px] sm:max-w-none sm:top-4 sm:right-4",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[10px] font-semibold sm:text-xs">Comunas</h4>
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowLegend(false)
                      }}
                      aria-label="Cerrar leyenda"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {Object.entries(communeColors)
                    .filter(([commune]) => deliveries.some((d) => d.commune === commune))
                    .map(([commune, color]) => (
                      <div key={commune} className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full sm:h-3 sm:w-3" style={{ backgroundColor: color }}></div>
                        <span className="text-[8px] sm:text-xs">{commune}</span>
                      </div>
                    ))}
                </div>
              </Card>
            )}

            {/* Marcador del depósito Mersan */}
            <div className="absolute top-40% left-50% transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white sm:h-10 sm:w-10 shadow-md ring-2 ring-white">
                  <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="mt-1 bg-white/95 px-1 py-0.5 rounded text-[8px] shadow-md sm:text-xs sm:px-2 sm:py-1 font-medium">
                  Depósito Mersan
                </div>
              </div>
            </div>

            {/* Puntos de entrega */}
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ top: delivery.position.top, left: delivery.position.left }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-white sm:h-8 sm:w-8 shadow-md ${
                      delivery.status === "completed" ? "ring-1 ring-green-500 sm:ring-2" : ""
                    }`}
                    style={{ backgroundColor: communeColors[delivery.commune] || "#6b7280" }}
                  >
                    <span className="text-[8px] font-bold sm:text-xs">{delivery.id}</span>
                  </div>
                  <div className="mt-0.5 bg-white/95 px-1 py-0.5 rounded text-[6px] shadow-md max-w-[80px] truncate sm:text-xs sm:max-w-[120px] sm:mt-1 sm:px-2 sm:py-1">
                    {delivery.address.split(",")[1] || delivery.address}
                  </div>
                </div>
              </div>
            ))}

            {/* Ruta trazada - Conecta todos los puntos en orden */}
            <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 5 }}>
              {deliveries.length > 0 && (
                <>
                  {/* Línea desde el depósito al primer punto */}
                  <path
                    d={`M 50% 40% L ${deliveries[0].position.left} ${deliveries[0].position.top}`}
                    stroke="#4F46E5"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-sm"
                  />

                  {/* Líneas entre puntos */}
                  {deliveries.slice(0, -1).map((delivery, index) => (
                    <path
                      key={`path-${index}`}
                      d={`M ${delivery.position.left} ${delivery.position.top} L ${deliveries[index + 1].position.left} ${deliveries[index + 1].position.top}`}
                      stroke="#4F46E5"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray={delivery.status === "completed" ? "none" : "4,4"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-sm"
                    />
                  ))}

                  {/* Línea desde el último punto de vuelta al depósito si está habilitado */}
                  {shouldReturnToDepot && deliveries.length > 0 && (
                    <path
                      d={`M ${deliveries[deliveries.length - 1].position.left} ${deliveries[deliveries.length - 1].position.top} L 50% 40%`}
                      stroke="#4F46E5"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="4,4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-sm"
                    />
                  )}
                </>
              )}
            </svg>

            {/* Panel de información de ruta */}
            {showStats && (
              <Card
                className={cn(
                  "absolute z-10 bg-white/95 shadow-md",
                  isFullscreen
                    ? "bottom-4 left-4 p-3 rounded-md max-w-[200px] sm:max-w-xs"
                    : "bottom-2 left-2 p-2 rounded-md max-w-[180px] sm:max-w-xs sm:bottom-4 sm:left-4 sm:p-3",
                )}
              >
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <h4 className="text-[10px] font-semibold sm:text-sm">Información de Ruta</h4>
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowStats(false)
                      }}
                      aria-label="Cerrar estadísticas"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="space-y-1 text-[8px] sm:space-y-2 sm:text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Route className="h-2 w-2 mr-0.5 sm:h-3 sm:w-3 sm:mr-1" />
                      Distancia total:
                    </span>
                    <span className="font-medium">{routeStats.totalDistance} km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Clock className="h-2 w-2 mr-0.5 sm:h-3 sm:w-3 sm:mr-1" />
                      Tiempo estimado:
                    </span>
                    <span className="font-medium">{routeStats.totalTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Entregas:</span>
                    <span className="font-medium">{routeStats.totalPoints}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 text-[6px] px-1 py-0 h-3 sm:text-xs sm:px-2 sm:py-0 sm:h-5"
                    >
                      {routeStats.completedPoints} completadas
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 text-[6px] px-1 py-0 h-3 sm:text-xs sm:px-2 sm:py-0 sm:h-5"
                    >
                      {routeStats.pendingPoints} pendientes
                    </Badge>
                  </div>
                  <div className="pt-1 border-t border-gray-100 sm:pt-2">
                    <span className="text-[6px] text-gray-500 sm:text-xs">
                      Optimización: {routeStats.optimizationType}
                    </span>
                  </div>
                  {shouldReturnToDepot && (
                    <div className="flex items-center text-blue-600">
                      <Home className="h-2 w-2 mr-0.5 sm:h-3 sm:w-3 sm:mr-1" />
                      <span>Incluye retorno a Mersan</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Instrucción para pantalla completa en móvil */}
            {isMobile && hasDirections && !isFullscreen && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full animate-pulse">
                Toca el mapa para pantalla completa
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mb-3 h-6 w-6 animate-spin rounded-full border-3 border-gray-300 border-t-blue-600 mx-auto sm:h-8 sm:w-8 sm:mb-4"></div>
            <p className="text-xs sm:text-sm">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Overlay para salir de pantalla completa en móvil */}
      {isFullscreen && isMobile && (
        <div className="absolute bottom-4 right-4 z-20">
          <Button
            className="rounded-full shadow-lg bg-white/90 text-gray-800 hover:bg-white"
            size="sm"
            onClick={toggleFullscreen}
          >
            <Minimize className="h-4 w-4 mr-1" />
            <span className="text-xs">Salir</span>
          </Button>
        </div>
      )}
    </div>
  )
}

