"use client"

import { useState, useEffect } from "react"
import { FileUploader } from "@/components/file-uploader"
import { RouteOptimizer, type RouteOptimizationOptions } from "@/components/route-optimizer"
import { DeliveryList } from "@/components/delivery-list"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FileSpreadsheet, Upload, Loader2, CheckCircle2, List } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Delivery, OptimizationType } from "@/types/delivery"

type FileType = "csv" | "excel" | "sheets" | "url"

interface ImportPanelProps {
  onDataImported: (data: string) => void
  onRouteOptimized: (optimizationType: OptimizationType, options: RouteOptimizationOptions) => void
  onDeliveriesReordered?: (deliveries: Delivery[]) => void
  deliveries?: Delivery[]
  communeColors?: Record<string, string>
}

export function ImportPanel({
  onDataImported,
  onRouteOptimized,
  onDeliveriesReordered,
  deliveries = [],
  communeColors = {},
}: ImportPanelProps) {
  const [hasImportedData, setHasImportedData] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [googleSheetUrl, setGoogleSheetUrl] = useState(
    "https://docs.google.com/spreadsheets/d/10rNFC3KiTftGCHE9lsJy9rZqcXb4KBUSHKXabj_3Gzo/edit?gid=0",
  )
  const [urlInput, setUrlInput] = useState("")
  const [importSuccess, setImportSuccess] = useState(false)
  const [sampleDeliveries, setSampleDeliveries] = useState<Delivery[]>([])
  const [activeTab, setActiveTab] = useState<string>("import")

  // Generar datos de muestra para la optimización
  useEffect(() => {
    if (hasImportedData && sampleDeliveries.length === 0 && deliveries.length === 0) {
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

      setSampleDeliveries(newDeliveries)
    }
  }, [hasImportedData, sampleDeliveries.length, deliveries.length])

  // Actualizar el estado cuando cambian las entregas externas
  useEffect(() => {
    if (deliveries.length > 0) {
      setHasImportedData(true)
    }
  }, [deliveries])

  const handleFileUploaded = (file: File | string, fileType: FileType) => {
    console.log("File uploaded:", typeof file === "string" ? file : file.name, "Type:", fileType)
    setHasImportedData(true)

    // Notificar al componente padre que se han importado datos
    onDataImported(typeof file === "string" ? file : file.name)
  }

  const handleImportData = () => {
    if (!googleSheetUrl) return

    setIsImporting(true)

    // Simulamos el procesamiento
    setTimeout(() => {
      setIsImporting(false)
      setHasImportedData(true)
      setImportSuccess(true)

      // Notificar al componente padre que se han importado datos
      onDataImported(googleSheetUrl)

      // Limpiamos el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setImportSuccess(false)
      }, 3000)
    }, 1500)
  }

  const handleOptimizeRoute = (optimizationType: OptimizationType, options: RouteOptimizationOptions) => {
    if (!hasImportedData) {
      alert("Primero debes importar datos para optimizar la ruta")
      return
    }

    setIsOptimizing(true)

    // Simulamos el procesamiento
    setTimeout(() => {
      setIsOptimizing(false)

      // Notificar al componente padre que se ha optimizado la ruta
      onRouteOptimized(optimizationType, options)

      setImportSuccess(true)
      // Limpiamos el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setImportSuccess(false)
      }, 3000)
    }, 2000)
  }

  const handleUrlImport = () => {
    if (!urlInput) return

    setIsImporting(true)

    // Simulamos el procesamiento
    setTimeout(() => {
      setIsImporting(false)
      setHasImportedData(true)
      setImportSuccess(true)

      // Notificar al componente padre que se han importado datos
      onDataImported(urlInput)

      // Limpiamos el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setImportSuccess(false)
      }, 3000)
    }, 1500)
  }

  const handleDeliveriesReordered = (reorderedDeliveries: Delivery[]) => {
    if (onDeliveriesReordered) {
      onDeliveriesReordered(reorderedDeliveries)
    }
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-white">
      <div className="mb-4">
        <h2 className="mb-2 text-lg font-semibold sm:text-xl text-gray-800">Importar Direcciones</h2>

        {importSuccess && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-700">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <AlertDescription>
              {isOptimizing ? "Ruta optimizada correctamente" : "Datos importados correctamente"}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="import" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100">
            <TabsTrigger
              value="import"
              className="flex items-center justify-center text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <FileSpreadsheet className="mr-1 h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Importar</span>
              <span className="sm:hidden">Importar</span>
            </TabsTrigger>
            <TabsTrigger
              value="optimize"
              className="flex items-center justify-center text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600"
              disabled={!hasImportedData}
            >
              <Upload className="mr-1 h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Optimizar</span>
              <span className="sm:hidden">Optimizar</span>
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="flex items-center justify-center text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600"
              disabled={!hasImportedData}
            >
              <List className="mr-1 h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Reordenar</span>
              <span className="sm:hidden">Reordenar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import">
            <Accordion type="single" collapsible defaultValue="sheets" className="w-full">
              <AccordionItem value="sheets" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  Google Sheets
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-3 sm:p-4 border-gray-200 bg-gray-50">
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-xs font-medium sm:text-sm text-gray-700">URL de Google Sheet</h3>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="https://docs.google.com/spreadsheets/d/..."
                          className="w-full text-xs sm:text-sm bg-white border-gray-300 focus-visible:ring-blue-500"
                          value={googleSheetUrl}
                          onChange={(e) => setGoogleSheetUrl(e.target.value)}
                          disabled={isImporting}
                        />
                        <Button
                          size="sm"
                          onClick={handleImportData}
                          disabled={!googleSheetUrl || isImporting}
                          className="whitespace-nowrap text-xs bg-blue-600 hover:bg-blue-700"
                        >
                          {isImporting ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : "Importar"}
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p>El Google Sheet debe tener los siguientes encabezados:</p>
                        <ul className="list-disc pl-5 mt-1 text-[10px] sm:text-xs">
                          <li>Dirección</li>
                          <li>Comuna</li>
                          <li>Nombre Cliente</li>
                          <li>Teléfono</li>
                          <li>Hora de Entrega (opcional)</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="file" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  Subir Archivo
                </AccordionTrigger>
                <AccordionContent>
                  <FileUploader onFileUploaded={handleFileUploaded} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="url" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  URL
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-3 sm:p-4 border-gray-200 bg-gray-50">
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-xs font-medium sm:text-sm text-gray-700">URL de Google Sheet</h3>
                      <div className="flex gap-2">
                        <Input
                          type="url"
                          placeholder="https://docs.google.com/spreadsheets/d/..."
                          className="w-full text-xs sm:text-sm bg-white border-gray-300 focus-visible:ring-blue-500"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          disabled={isImporting}
                        />
                        <Button
                          size="sm"
                          onClick={handleUrlImport}
                          disabled={!urlInput || isImporting}
                          className="whitespace-nowrap text-xs bg-blue-600 hover:bg-blue-700"
                        >
                          {isImporting ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : "Importar"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="optimize">
            {hasImportedData ? (
              <RouteOptimizer
                deliveries={deliveries.length > 0 ? deliveries : sampleDeliveries}
                onOptimizeRoute={handleOptimizeRoute}
                isOptimizing={isOptimizing}
              />
            ) : (
              <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-500">Primero debes importar datos para optimizar la ruta</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            {hasImportedData ? (
              <DeliveryList
                deliveries={deliveries.length > 0 ? deliveries : sampleDeliveries}
                communeColors={communeColors}
                onReorder={handleDeliveriesReordered}
              />
            ) : (
              <div className="text-center p-6 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-500">Primero debes importar datos para reordenar las entregas</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

