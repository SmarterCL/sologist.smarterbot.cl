"use client"

import dynamic from "next/dynamic"
import type { Delivery } from "@/types/delivery"
import type { RouteOptimizationOptions } from "@/components/route-optimizer"
import type { OptimizationType } from "@/types/delivery"

interface MapContainerProps {
  importedData?: string | null
  optimizationConfig?: {
    type: OptimizationType
    options: RouteOptimizationOptions
  } | null
  onToggleFullscreen?: (isFullscreen: boolean) => void
  deliveries?: Delivery[]
}

const MapContent = dynamic(() => import("./map-content").then(mod => ({ default: mod.MapContent })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
})

export function MapContainer(props: MapContainerProps) {
  return <MapContent {...props} />
}
