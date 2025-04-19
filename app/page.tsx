"use client"

import { useState, useEffect } from "react"
import { MapContainer } from "@/components/map-container"
import { ImportPanel } from "@/components/import-panel"
import { TruckLoadingSimulator } from "@/components/truck-loading-simulator"
import { TruckCapacitySimulator } from "@/components/truck-capacity-simulator"
import { Truck3DView } from "@/components/truck-3d-view"
import { CompanyInfo } from "@/components/company-info"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Menu, X, Map, Truck, Package, Info } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import type { Delivery, OptimizationType } from "@/types/delivery"
import type { RouteOptimizationOptions } from "@/components/route-optimizer"

export default function HomePage() {
  const [importedData, setImportedData] = useState<string | null>(null)
  const [optimizationConfig, setOptimizationConfig] = useState<{
    type: OptimizationType
    options: RouteOptimizationOptions
  } | null>(null)
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("map")
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Auto-close sidebar on mobile when data is imported
  useEffect(() => {
    if (isMobile && importedData) {
      setSidebarOpen(false)
    }
  }, [importedData, isMobile])

  const handleDataImported = (data: string) => {
    setImportedData(data)

    // Simular la carga de datos
    setTimeout(() => {
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

      const extractCommune = (address: string): string => {
        if (address.startsWith("PUENTE ALTO")) return "PUENTE ALTO"
        if (address.startsWith("SAN RAMON")) return "SAN RAMON"
        if (address.startsWith("LA GRANJA")) return "LA GRANJA"
        if (address.startsWith("SAN JOAQUIN")) return "SAN JOAQUIN"
        return "SANTIAGO" // Default
      }

      const newDeliveries = addresses.map((address, index) => {
        const commune = extractCommune(address)
        return {
          id: index + 1,
          address,
          commune,
          status: index < 3 ? "completed" : "pending",
          position: { top: "0%", left: "0%" },
          distance: Math.round((Math.random() * 5 + 1) * 10) / 10, // Distancia aleatoria entre 1 y 6 km
          estimatedTime: `${Math.floor(Math.random() * 15 + 5)}min`, // Tiempo aleatorio entre 5 y 20 min
        }
      })

      setDeliveries(newDeliveries)
    }, 1000)
  }

  const handleRouteOptimized = (optimizationType: OptimizationType, options: RouteOptimizationOptions) => {
    setOptimizationConfig({ type: optimizationType, options })
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleToggleFullscreen = (isFullscreen: boolean) => {
    setIsMapFullscreen(isFullscreen)
    if (isFullscreen && isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleDeliveriesReordered = (reorderedDeliveries: Delivery[]) => {
    // Actualizar las entregas con el nuevo orden
    setDeliveries(reorderedDeliveries)

    // Crear una configuración de optimización manual
    setOptimizationConfig({
      type: "manual",
      options: {
        startTime: "09:00 AM",
        returnToDepot: true,
        prioritizeTimeWindows: false,
        maxDistancePerDay: 100,
        balanceLoad: false,
        communeWeighting: 50,
      },
    })

    // En móvil, cerrar el sidebar y mostrar el mapa
    if (isMobile) {
      setSidebarOpen(false)
      setActiveTab("map")
    }
  }

  // Colores para las diferentes comunas
  const communeColors = {
    "PUENTE ALTO": "#f87171",
    "SAN RAMON": "#60a5fa",
    "LA GRANJA": "#34d399",
    "SAN JOAQUIN": "#fbbf24",
    "LA FLORIDA": "#a78bfa",
    MAIPÚ: "#f472b6",
    SANTIAGO: "#22d3ee",
  }

  return (
    <div className={cn("flex min-h-screen flex-col bg-gray-50", isMapFullscreen && "overflow-hidden h-screen")}>
      {!isMapFullscreen && (
        <header className="sticky top-0 z-10 border-b bg-white py-3 shadow-sm">
          <div className="container px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">SOLOGIST</h1>
                <p className="text-xs text-gray-600 sm:text-sm">Logística y distribución de última milla</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden items-center text-xs text-gray-500 md:flex">
                  <span>Santiago, Chile</span>
                  <span className="mx-2">•</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label={sidebarOpen ? "Cerrar panel" : "Abrir panel"}
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={cn("flex flex-1 flex-col md:flex-row", isMapFullscreen && "h-screen")}>
        {/* Sidebar - Panel de importación */}
        {(!isMapFullscreen || !isMobile) && (
          <div
            className={cn(
              sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
              "fixed inset-0 z-20 w-full transform overflow-y-auto bg-white transition-transform duration-200 ease-in-out md:relative md:z-0 md:w-1/3 md:translate-x-0 md:border-r md:shadow-none",
              isMapFullscreen && "md:w-1/4 lg:w-1/5",
            )}
          >
            <ImportPanel
              onDataImported={handleDataImported}
              onRouteOptimized={handleRouteOptimized}
              onDeliveriesReordered={handleDeliveriesReordered}
              deliveries={deliveries}
              communeColors={communeColors}
            />
          </div>
        )}

        {/* Overlay para cerrar el sidebar en móvil */}
        {sidebarOpen && !isMapFullscreen && (
          <div
            className="fixed inset-0 z-10 bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Contenedor principal con pestañas */}
        <div
          className={cn(
            "flex-1",
            isMapFullscreen ? "w-full" : "md:w-2/3",
            isMapFullscreen && !isMobile && "md:w-3/4 lg:w-4/5",
          )}
        >
          {!isMapFullscreen && (
            <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b bg-white">
                <div className="container px-4">
                  <TabsList className="h-12 bg-transparent">
                    <TabsTrigger
                      value="map"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
                    >
                      <Map className="h-4 w-4 mr-2" />
                      Mapa de Ruta
                    </TabsTrigger>
                    <TabsTrigger
                      value="truck"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Carga del Camión
                    </TabsTrigger>
                    <TabsTrigger
                      value="capacity"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Capacidad
                    </TabsTrigger>
                    <TabsTrigger
                      value="company"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Empresa
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="map" className="m-0">
                <div className={cn("relative w-full", isMapFullscreen ? "h-screen" : "h-[calc(100vh-112px)]")}>
                  <MapContainer
                    importedData={importedData}
                    optimizationConfig={optimizationConfig}
                    onToggleFullscreen={handleToggleFullscreen}
                    deliveries={deliveries}
                  />
                </div>
              </TabsContent>

              <TabsContent value="truck" className="m-0 p-4">
                <div className="h-[calc(100vh-112px)] overflow-y-auto">
                  <TruckLoadingSimulator
                    isLoading={!importedData}
                    communeColors={communeColors}
                    deliveries={deliveries}
                  />
                </div>
              </TabsContent>

              <TabsContent value="capacity" className="m-0 p-4">
                <div className="h-[calc(100vh-112px)] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <TruckCapacitySimulator />
                    </div>
                    <div>
                      <Truck3DView />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="company" className="m-0 p-4">
                <div className="h-[calc(100vh-112px)] overflow-y-auto">
                  <CompanyInfo />
                </div>
              </TabsContent>
            </Tabs>
          )}

          {isMapFullscreen && (
            <div className="h-screen">
              <MapContainer
                importedData={importedData}
                optimizationConfig={optimizationConfig}
                onToggleFullscreen={handleToggleFullscreen}
                deliveries={deliveries}
              />
            </div>
          )}

          {/* Botón flotante para abrir el panel en móvil cuando está cerrado */}
          {!sidebarOpen && !isMapFullscreen && (
            <Button
              className="fixed bottom-4 right-4 z-10 rounded-full shadow-lg md:hidden"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir panel de opciones"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}

