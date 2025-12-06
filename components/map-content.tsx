"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, RefreshCw, Clock, Route, X, Maximize, Minimize } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import type { Delivery, CommuneColors, RouteStats, OptimizationType } from "@/types/delivery"
import type { RouteOptimizationOptions } from "@/components/route-optimizer"
import "leaflet/dist/leaflet.css"

interface MapContentProps {
  importedData?: string | null
  optimizationConfig?: {
    type: OptimizationType
    options: RouteOptimizationOptions
  } | null
  onToggleFullscreen?: (isFullscreen: boolean) => void
  deliveries?: Delivery[]
}

export function MapContent({
  importedData = null,
  optimizationConfig = null,
  onToggleFullscreen,
  deliveries: externalDeliveries = [],
}: MapContentProps) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const mapRef = useRef(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [routeStats, setRouteStats] = useState<RouteStats>({
    totalDistance: 0,
    totalTime: "0h 0min",
    totalPoints: 0,
    completedPoints: 0,
    pendingPoints: 0,
    optimizationType: "Sin optimizar",
  })

  const santiagoCenterLat = -33.4489
  const santiagoCenterLng = -70.6693

  const communeCoordinates: { [key: string]: { lat: number; lng: number } } = {
    "PUENTE ALTO": { lat: -33.6143, lng: -70.5784 },
    "SAN RAMON": { lat: -33.5536, lng: -70.6428 },
    "LA GRANJA": { lat: -33.5942, lng: -70.7089 },
    "SAN JOAQUIN": { lat: -33.5089, lng: -70.5989 },
    SANTIAGO: { lat: -33.4489, lng: -70.6693 },
    PROVIDENCIA: { lat: -33.4306, lng: -70.6020 },
    "ÑUÑOA": { lat: -33.4297, lng: -70.5889 },
    "LA REINA": { lat: -33.4203, lng: -70.5670 },
    VITACURA: { lat: -33.3903, lng: -70.5953 },
    MAIPÚ: { lat: -33.5214, lng: -70.7517 },
    "ESTACIÓN CENTRAL": { lat: -33.4450, lng: -70.7000 },
  }

  const communeColors: CommuneColors = {
    "PUENTE ALTO": "#f87171",
    "SAN RAMON": "#60a5fa",
    "LA GRANJA": "#34d399",
    "SAN JOAQUIN": "#fbbf24",
    SANTIAGO: "#22d3ee",
    PROVIDENCIA: "#a78bfa",
    "ÑUÑOA": "#fb7185",
    "LA REINA": "#65a30d",
    VITACURA: "#0891b2",
    MAIPÚ: "#f472b6",
    "ESTACIÓN CENTRAL": "#eab308",
  }

  const extractCommune = (address: string): string => {
    const upperAddress = address.toUpperCase()
    for (const commune of Object.keys(communeCoordinates)) {
      if (upperAddress.includes(commune)) {
        return commune
      }
    }
    return "SANTIAGO"
  }

  const getCoordinatesForDelivery = (delivery: Delivery): [number, number] => {
    const commune = delivery.commune || extractCommune(delivery.address)
    const coords = communeCoordinates[commune] || communeCoordinates.SANTIAGO
    const randomOffset = 0.01
    const lat = coords.lat + (Math.random() - 0.5) * randomOffset
    const lng = coords.lng + (Math.random() - 0.5) * randomOffset
    return [lat, lng]
  }

  useEffect(() => {
    if (externalDeliveries && externalDeliveries.length > 0) {
      setDeliveries(externalDeliveries)
      const totalPoints = externalDeliveries.length
      const completedPoints = externalDeliveries.filter(d => d.status === "completed").length
      const pendingPoints = totalPoints - completedPoints
      let totalDistance = 0
      externalDeliveries.forEach(d => {
        totalDistance += d.distance || 0
      })
      setRouteStats({
        totalDistance: Math.round(totalDistance),
        totalTime: `${Math.ceil(totalPoints / 5)}h 0min`,
        totalPoints,
        completedPoints,
        pendingPoints,
        optimizationType: optimizationConfig?.type || "Sin optimizar",
      })
    }
  }, [externalDeliveries, optimizationConfig])

  const createCustomIcon = (commune: string, isCompleted: boolean) => {
    const color = communeColors[commune] || "#888888"
    const bgColor = isCompleted ? "#4ade80" : color
    return new L.Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${bgColor}" width="32" height="32"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="3" fill="white"/></svg>`)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })
  }

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    onToggleFullscreen?.(!isFullscreen)
  }

  return (
    <div className={cn("flex flex-col bg-background transition-all duration-300", isFullscreen ? "fixed inset-0 z-50" : "w-full h-full")}>
      <Card className={cn("flex-1 flex flex-col border-0 rounded-lg overflow-hidden", isFullscreen ? "m-0" : "m-4")}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">Mapa de Entregas en Vivo</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-blue-600" onClick={handleToggleFullscreen}>
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            {isFullscreen && (
              <Button size="sm" variant="ghost" className="text-white hover:bg-blue-600" onClick={() => setIsFullscreen(false)}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="flex-1 relative bg-slate-100 overflow-hidden">
          {deliveries.length > 0 ? (
            <LeafletMapContainer center={[santiagoCenterLat, santiagoCenterLng]} zoom={11} style={{ height: "100%", width: "100%" }} ref={mapRef}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
              {deliveries.map((delivery, idx) => {
                const [lat, lng] = getCoordinatesForDelivery(delivery)
                const commune = delivery.commune || extractCommune(delivery.address)
                const isCompleted = delivery.status === "completed"
                return (
                  <Marker key={`marker-${idx}`} position={[lat, lng]} icon={createCustomIcon(commune, isCompleted)}>
                    <Popup>
                      <div className="p-2 text-sm">
                        <p className="font-semibold text-gray-800">{delivery.address}</p>
                        <p className="text-gray-600">{commune}</p>
                        <p className="text-gray-500 text-xs mt-1">{isCompleted ? "✓ Completada" : "⏳ Pendiente"}</p>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </LeafletMapContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Cargue un archivo CSV o importar datos para ver entregas en el mapa</p>
              </div>
            </div>
          )}
        </div>
        {deliveries.length > 0 && (
          <div className="bg-slate-50 border-t p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <Badge variant="outline" className="bg-blue-50"><MapPin className="w-3 h-3 mr-1" />{routeStats.totalPoints} puntos</Badge>
              <Badge variant="outline" className="bg-green-50"><Route className="w-3 h-3 mr-1" />{routeStats.totalDistance} km</Badge>
              <Badge variant="outline" className="bg-yellow-50"><Clock className="w-3 h-3 mr-1" />{routeStats.totalTime}</Badge>
              <Badge variant="outline" className="bg-green-50">✓ {routeStats.completedPoints}</Badge>
              <Badge variant="outline" className="bg-gray-50">⏳ {routeStats.pendingPoints}</Badge>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
