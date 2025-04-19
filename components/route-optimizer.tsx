"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowDownAZ, Map, BarChart3, Truck, Home, RotateCcw, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Delivery, OptimizationType } from "@/types/delivery"

interface RouteOptimizerProps {
  deliveries: Delivery[]
  onOptimizeRoute: (optimizationType: OptimizationType, options: RouteOptimizationOptions) => void
  isOptimizing?: boolean
}

export interface RouteOptimizationOptions {
  startTime: string
  returnToDepot: boolean
  prioritizeTimeWindows: boolean
  maxDistancePerDay: number
  balanceLoad: boolean
  communeWeighting: number // 0-100: Importancia de agrupar por comuna vs distancia
}

export function RouteOptimizer({ deliveries, onOptimizeRoute, isOptimizing = false }: RouteOptimizerProps) {
  const [optimizationType, setOptimizationType] = useState<OptimizationType>("distance")
  const [options, setOptions] = useState<RouteOptimizationOptions>({
    startTime: "09:00 AM",
    returnToDepot: true,
    prioritizeTimeWindows: true,
    maxDistancePerDay: 100, // km
    balanceLoad: false,
    communeWeighting: 50, // 50% importancia a comunas, 50% a distancia
  })

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  // Agrupar entregas por comuna para mostrar estadísticas
  const communeStats = deliveries.reduce(
    (stats, delivery) => {
      if (!stats[delivery.commune]) {
        stats[delivery.commune] = 0
      }
      stats[delivery.commune]++
      return stats
    },
    {} as Record<string, number>,
  )

  const handleOptimize = () => {
    onOptimizeRoute(optimizationType, options)
  }

  const updateOption = <K extends keyof RouteOptimizationOptions>(key: K, value: RouteOptimizationOptions[K]) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Card className="p-4 border-blue-100 bg-blue-50/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-blue-800">Optimización de Ruta</h3>

          {deliveries.length > 0 && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              {deliveries.length} entregas
            </Badge>
          )}
        </div>

        {/* Resumen de comunas */}
        {Object.keys(communeStats).length > 0 && (
          <div className="bg-white p-2 rounded-md border border-blue-100 text-xs">
            <div className="flex items-center gap-1 mb-1">
              <Map className="h-3 w-3 text-blue-600" />
              <span className="font-medium text-blue-800">Distribución por comunas:</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(communeStats).map(([commune, count]) => (
                <Badge key={commune} variant="outline" className="text-[10px] bg-blue-50 border-blue-200 text-blue-700">
                  {commune}: {count}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Estrategias de optimización */}
        <div>
          <h4 className="text-xs font-medium mb-2 text-blue-800">Estrategia de Optimización</h4>
          <RadioGroup
            defaultValue="distance"
            value={optimizationType}
            onValueChange={(value) => setOptimizationType(value as OptimizationType)}
            className="grid grid-cols-1 gap-2"
          >
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100/50 bg-white border border-blue-100">
              <RadioGroupItem value="distance" id="distance" className="text-blue-600" />
              <Label htmlFor="distance" className="flex items-center text-xs text-blue-800 cursor-pointer">
                <ArrowDownAZ className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2 text-blue-600" />
                <div>
                  <span className="font-medium">Por distancia (menor a mayor)</span>
                  <p className="text-[10px] text-blue-600">Minimiza la distancia total recorrida</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100/50 bg-white border border-blue-100">
              <RadioGroupItem value="commune" id="commune" className="text-blue-600" />
              <Label htmlFor="commune" className="flex items-center text-xs text-blue-800 cursor-pointer">
                <Map className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2 text-blue-600" />
                <div>
                  <span className="font-medium">Por comunas</span>
                  <p className="text-[10px] text-blue-600">Agrupa entregas por comuna</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100/50 bg-white border border-blue-100">
              <RadioGroupItem value="hybrid" id="hybrid" className="text-blue-600" />
              <Label htmlFor="hybrid" className="flex items-center text-xs text-blue-800 cursor-pointer">
                <BarChart3 className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2 text-blue-600" />
                <div>
                  <span className="font-medium">Híbrido (comuna + distancia)</span>
                  <p className="text-[10px] text-blue-600">Balance entre agrupación y distancia</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Opciones básicas */}
        <div className="space-y-3 bg-white p-3 rounded-md border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">Retorno a Mersan</span>
            </div>
            <Switch
              checked={options.returnToDepot}
              onCheckedChange={(checked) => updateOption("returnToDepot", checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {optimizationType === "hybrid" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-800">Prioridad Comuna vs Distancia</span>
                <span className="text-xs text-blue-600">{options.communeWeighting}%</span>
              </div>
              <Slider
                value={[options.communeWeighting]}
                min={0}
                max={100}
                step={10}
                onValueChange={(value) => updateOption("communeWeighting", value[0])}
                className="[&>span]:bg-blue-600"
              />
              <div className="flex justify-between text-[10px] text-blue-600">
                <span>Distancia</span>
                <span>Comuna</span>
              </div>
            </div>
          )}
        </div>

        {/* Opciones avanzadas (colapsables) */}
        <div>
          <button
            className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 mb-2"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            {showAdvancedOptions ? "▼" : "►"} Opciones avanzadas
          </button>

          {showAdvancedOptions && (
            <div className="space-y-3 bg-white p-3 rounded-md border border-blue-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-800">Priorizar ventanas horarias</span>
                <Switch
                  checked={options.prioritizeTimeWindows}
                  onCheckedChange={(checked) => updateOption("prioritizeTimeWindows", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-800">Balancear carga</span>
                <Switch
                  checked={options.balanceLoad}
                  onCheckedChange={(checked) => updateOption("balanceLoad", checked)}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-800">Distancia máxima: {options.maxDistancePerDay} km</span>
                </div>
                <Slider
                  value={[options.maxDistancePerDay]}
                  min={50}
                  max={200}
                  step={10}
                  onValueChange={(value) => updateOption("maxDistancePerDay", value[0])}
                  className="[&>span]:bg-blue-600"
                />
                <div className="flex justify-between text-[10px] text-blue-600">
                  <span>50 km</span>
                  <span>200 km</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            onClick={() => {
              setOptimizationType("distance")
              setOptions({
                startTime: "09:00 AM",
                returnToDepot: true,
                prioritizeTimeWindows: true,
                maxDistancePerDay: 100,
                balanceLoad: false,
                communeWeighting: 50,
              })
            }}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Restablecer
          </Button>

          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Optimizando...
              </>
            ) : (
              <>
                <Truck className="h-3 w-3 mr-1" />
                Optimizar Ruta
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

