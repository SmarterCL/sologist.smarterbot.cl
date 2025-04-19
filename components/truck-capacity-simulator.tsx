"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TruckIcon, Package, RefreshCw, Info, Refrigerator, Tv, Wind, Sofa, Bed } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Definir tipos para los productos
interface Product {
  id: number
  name: string
  width: number // cm
  height: number // cm
  depth: number // cm
  weight: number // kg
  type: ProductType
  color: string
  stackable: boolean
  fragile: boolean
  quantity: number
}

type ProductType =
  | "refrigerador"
  | "lavadora"
  | "cocina"
  | "microondas"
  | "televisor"
  | "sofa"
  | "aire_acondicionado"
  | "colchon"
  | "cama"
  | "respaldo"
  | "otro"

// Definir tipo para el camión
interface Truck {
  model: string
  width: number // cm
  height: number // cm
  length: number // cm
  maxWeight: number // kg
  palletCapacity: number
  volumeCapacity: number // m3
}

// Iconos para tipos de productos
const productIcons: Record<ProductType, React.ReactNode> = {
  refrigerador: <Refrigerator className="h-4 w-4" />,
  lavadora: <Package className="h-4 w-4" />,
  cocina: <Package className="h-4 w-4" />,
  microondas: <Package className="h-4 w-4" />,
  televisor: <Tv className="h-4 w-4" />,
  sofa: <Sofa className="h-4 w-4" />,
  aire_acondicionado: <Wind className="h-4 w-4" />,
  colchon: <Bed className="h-4 w-4" />,
  cama: <Bed className="h-4 w-4" />,
  respaldo: <Bed className="h-4 w-4" />,
  otro: <Package className="h-4 w-4" />,
}

// Colores para tipos de productos
const productColors: Record<ProductType, string> = {
  refrigerador: "#60a5fa", // Azul
  lavadora: "#34d399", // Verde
  cocina: "#f87171", // Rojo
  microondas: "#fbbf24", // Amarillo
  televisor: "#a78bfa", // Púrpura
  sofa: "#f472b6", // Rosa
  aire_acondicionado: "#22d3ee", // Cian
  colchon: "#fb923c", // Naranja
  cama: "#94a3b8", // Gris
  respaldo: "#c084fc", // Violeta
  otro: "#9ca3af", // Gris oscuro
}

export function TruckCapacitySimulator() {
  const [products, setProducts] = useState<Product[]>([])
  const [truck, setTruck] = useState<Truck>({
    model: "HINO 300 (Serie 816)",
    width: 220, // cm
    height: 220, // cm
    length: 520, // cm
    maxWeight: 5500, // kg
    palletCapacity: 3,
    volumeCapacity: 25.2, // m3
  })
  const [loadedProducts, setLoadedProducts] = useState<Product[]>([])
  const [currentWeight, setCurrentWeight] = useState(0)
  const [currentVolume, setCurrentVolume] = useState(0)
  const [volumePercentage, setVolumePercentage] = useState(0)
  const [weightPercentage, setWeightPercentage] = useState(0)
  const [showInfo, setShowInfo] = useState(false)
  const [selectedProductType, setSelectedProductType] = useState<ProductType | "all">("all")

  // Generar productos de ejemplo
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Refrigerador Samsung 2 puertas",
        width: 70,
        height: 180,
        depth: 70,
        weight: 85,
        type: "refrigerador",
        color: productColors.refrigerador,
        stackable: false,
        fragile: true,
        quantity: 2,
      },
      {
        id: 2,
        name: "Lavadora LG 12kg",
        width: 60,
        height: 85,
        depth: 60,
        weight: 65,
        type: "lavadora",
        color: productColors.lavadora,
        stackable: false,
        fragile: true,
        quantity: 3,
      },
      {
        id: 3,
        name: "Cocina a gas 6 quemadores",
        width: 60,
        height: 90,
        depth: 60,
        weight: 45,
        type: "cocina",
        color: productColors.cocina,
        stackable: false,
        fragile: true,
        quantity: 2,
      },
      {
        id: 4,
        name: "Microondas Samsung",
        width: 50,
        height: 30,
        depth: 40,
        weight: 12,
        type: "microondas",
        color: productColors.microondas,
        stackable: true,
        fragile: true,
        quantity: 5,
      },
      {
        id: 5,
        name: "Televisor LG 55 pulgadas",
        width: 125,
        height: 80,
        depth: 15,
        weight: 18,
        type: "televisor",
        color: productColors.televisor,
        stackable: false,
        fragile: true,
        quantity: 4,
      },
      {
        id: 6,
        name: "Sofá 3 cuerpos",
        width: 220,
        height: 90,
        depth: 90,
        weight: 65,
        type: "sofa",
        color: productColors.sofa,
        stackable: false,
        fragile: false,
        quantity: 2,
      },
      {
        id: 7,
        name: "Aire acondicionado Split",
        width: 90,
        height: 30,
        depth: 20,
        weight: 35,
        type: "aire_acondicionado",
        color: productColors.aire_acondicionado,
        stackable: true,
        fragile: true,
        quantity: 3,
      },
      {
        id: 8,
        name: "Colchón King",
        width: 200,
        height: 25,
        depth: 180,
        weight: 40,
        type: "colchon",
        color: productColors.colchon,
        stackable: true,
        fragile: false,
        quantity: 2,
      },
      {
        id: 9,
        name: "Cama 2 plazas",
        width: 160,
        height: 40,
        depth: 200,
        weight: 70,
        type: "cama",
        color: productColors.cama,
        stackable: false,
        fragile: false,
        quantity: 1,
      },
      {
        id: 10,
        name: "Respaldo cama King",
        width: 200,
        height: 120,
        depth: 10,
        weight: 25,
        type: "respaldo",
        color: productColors.respaldo,
        stackable: true,
        fragile: false,
        quantity: 2,
      },
    ]

    setProducts(sampleProducts)
  }, [])

  // Calcular volumen de un producto en m3
  const calculateVolume = (product: Product): number => {
    return (product.width * product.height * product.depth) / 1000000 // Convertir cm3 a m3
  }

  // Calcular peso total de los productos cargados
  useEffect(() => {
    const weight = loadedProducts.reduce((sum, product) => sum + product.weight, 0)
    setCurrentWeight(weight)
    setWeightPercentage((weight / truck.maxWeight) * 100)

    const volume = loadedProducts.reduce((sum, product) => sum + calculateVolume(product), 0)
    setCurrentVolume(volume)
    setVolumePercentage((volume / truck.volumeCapacity) * 100)
  }, [loadedProducts, truck])

  // Cargar un producto al camión
  const loadProduct = (product: Product) => {
    // Verificar si hay capacidad
    const newWeight = currentWeight + product.weight
    const newVolume = currentVolume + calculateVolume(product)

    if (newWeight > truck.maxWeight) {
      alert("¡Excede el peso máximo del camión!")
      return
    }

    if (newVolume > truck.volumeCapacity) {
      alert("¡Excede el volumen máximo del camión!")
      return
    }

    setLoadedProducts([...loadedProducts, product])

    // Reducir la cantidad disponible
    setProducts(
      products.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p)).filter((p) => p.quantity > 0),
    )
  }

  // Descargar un producto del camión
  const unloadProduct = (index: number) => {
    const product = loadedProducts[index]

    // Devolver el producto al inventario
    const existingProduct = products.find((p) => p.id === product.id)

    if (existingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p)))
    } else {
      setProducts([...products, { ...product, quantity: 1 }])
    }

    // Quitar el producto de la carga
    setLoadedProducts(loadedProducts.filter((_, i) => i !== index))
  }

  // Reiniciar la simulación
  const resetSimulation = () => {
    // Restaurar todos los productos cargados al inventario
    const updatedProducts = [...products]

    loadedProducts.forEach((loadedProduct) => {
      const existingIndex = updatedProducts.findIndex((p) => p.id === loadedProduct.id)

      if (existingIndex >= 0) {
        updatedProducts[existingIndex].quantity += 1
      } else {
        updatedProducts.push({ ...loadedProduct, quantity: 1 })
      }
    })

    setProducts(updatedProducts)
    setLoadedProducts([])
  }

  // Filtrar productos por tipo
  const filteredProducts =
    selectedProductType === "all" ? products : products.filter((p) => p.type === selectedProductType)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Simulador de Capacidad - {truck.model}</h2>
        <Button variant="outline" size="sm" onClick={() => setShowInfo(!showInfo)}>
          <Info className="h-4 w-4 mr-2" />
          Info
        </Button>
      </div>

      {showInfo && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-medium mb-2">Especificaciones del Camión HINO 300 (Serie 816)</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p>
                <span className="font-medium">Dimensiones:</span> {truck.width}cm × {truck.height}cm × {truck.length}cm
              </p>
              <p>
                <span className="font-medium">Capacidad de pallets:</span> {truck.palletCapacity}
              </p>
            </div>
            <div>
              <p>
                <span className="font-medium">Peso máximo:</span> {truck.maxWeight}kg
              </p>
              <p>
                <span className="font-medium">Volumen:</span> {truck.volumeCapacity}m³
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel izquierdo - Productos disponibles */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Productos Disponibles</h3>
            <Select
              value={selectedProductType}
              onValueChange={(value) => setSelectedProductType(value as ProductType | "all")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los productos</SelectItem>
                <SelectItem value="refrigerador">Refrigeradores</SelectItem>
                <SelectItem value="lavadora">Lavadoras</SelectItem>
                <SelectItem value="cocina">Cocinas</SelectItem>
                <SelectItem value="microondas">Microondas</SelectItem>
                <SelectItem value="televisor">Televisores</SelectItem>
                <SelectItem value="sofa">Sofás</SelectItem>
                <SelectItem value="aire_acondicionado">Aires acondicionados</SelectItem>
                <SelectItem value="colchon">Colchones</SelectItem>
                <SelectItem value="cama">Camas</SelectItem>
                <SelectItem value="respaldo">Respaldos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No hay productos disponibles</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Card key={product.id} className="p-3 border-l-4" style={{ borderLeftColor: product.color }}>
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{productIcons[product.type]}</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <p>
                          Dimensiones: {product.width}×{product.height}×{product.depth}cm
                        </p>
                        <p>
                          Peso: {product.weight}kg | Volumen: {calculateVolume(product).toFixed(2)}m³
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Badge variant="outline" className="mb-2">
                        {product.quantity} disponibles
                      </Badge>
                      <Button size="sm" onClick={() => loadProduct(product)} className="text-xs">
                        Cargar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Panel derecho - Camión y productos cargados */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Productos Cargados</h3>
            <Button variant="outline" size="sm" onClick={resetSimulation} disabled={loadedProducts.length === 0}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          </div>

          {/* Visualización del camión */}
          <div className="border-2 border-gray-800 rounded-md h-40 mb-4 relative bg-gray-100">
            {/* Cabina */}
            <div className="absolute top-0 left-0 w-1/6 h-full bg-gray-700 rounded-l-sm flex items-center justify-center">
              <span className="text-white text-xs font-medium rotate-90">Cabina</span>
            </div>

            {/* Caja de carga */}
            <div className="absolute top-0 left-1/6 right-0 h-full bg-gray-200 flex items-center justify-center">
              {loadedProducts.length === 0 ? (
                <span className="text-gray-400 text-sm">Camión vacío</span>
              ) : (
                <div className="flex flex-wrap gap-1 p-2 w-full h-full overflow-hidden">
                  {loadedProducts.map((product, index) => {
                    // Calcular tamaño relativo para visualización
                    const volume = calculateVolume(product)
                    const relativeSize = Math.max(20, Math.min(60, volume * 100))

                    return (
                      <div
                        key={index}
                        className="rounded flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-80"
                        style={{
                          backgroundColor: product.color,
                          width: `${relativeSize}px`,
                          height: `${relativeSize}px`,
                        }}
                        onClick={() => unloadProduct(index)}
                        title={`${product.name} - Click para descargar`}
                      >
                        {productIcons[product.type]}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Indicadores de capacidad */}
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>
                  Volumen: {currentVolume.toFixed(2)}m³ / {truck.volumeCapacity}m³
                </span>
                <span>{volumePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={cn(
                    "h-2.5 rounded-full",
                    volumePercentage > 90 ? "bg-red-600" : volumePercentage > 70 ? "bg-yellow-500" : "bg-green-600",
                  )}
                  style={{ width: `${Math.min(100, volumePercentage)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>
                  Peso: {currentWeight}kg / {truck.maxWeight}kg
                </span>
                <span>{weightPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={cn(
                    "h-2.5 rounded-full",
                    weightPercentage > 90 ? "bg-red-600" : weightPercentage > 70 ? "bg-yellow-500" : "bg-green-600",
                  )}
                  style={{ width: `${Math.min(100, weightPercentage)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Lista de productos cargados */}
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {loadedProducts.length === 0 ? (
              <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md">
                <TruckIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No hay productos cargados</p>
              </div>
            ) : (
              loadedProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-50"
                  onClick={() => unloadProduct(index)}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: product.color }}></div>
                    <span>{product.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {calculateVolume(product).toFixed(2)}m³ | {product.weight}kg
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tabla de productos con medidas estándar */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Tabla de Productos con Medidas Estándar</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border text-left">Producto</th>
                <th className="py-2 px-4 border text-left">Tipo</th>
                <th className="py-2 px-4 border text-left">Dimensiones (cm)</th>
                <th className="py-2 px-4 border text-left">Peso (kg)</th>
                <th className="py-2 px-4 border text-left">Volumen (m³)</th>
                <th className="py-2 px-4 border text-left">Apilable</th>
                <th className="py-2 px-4 border text-left">Frágil</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{product.name}</td>
                  <td className="py-2 px-4 border">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: product.color }}></div>
                      {product.type.charAt(0).toUpperCase() + product.type.slice(1).replace("_", " ")}
                    </div>
                  </td>
                  <td className="py-2 px-4 border">
                    {product.width} × {product.height} × {product.depth}
                  </td>
                  <td className="py-2 px-4 border">{product.weight}</td>
                  <td className="py-2 px-4 border">{calculateVolume(product).toFixed(2)}</td>
                  <td className="py-2 px-4 border">{product.stackable ? "Sí" : "No"}</td>
                  <td className="py-2 px-4 border">{product.fragile ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-gray-50 border rounded-md">
        <h3 className="text-lg font-semibold mb-3">Información Adicional sobre Capacidad de Carga</h3>
        <p className="mb-3">El camión HINO 300 (Serie 816) tiene las siguientes características:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Capacidad de carga: hasta 5,500 kg</li>
          <li>Volumen de carga: 25.2 m³</li>
          <li>Dimensiones internas de la caja: 220cm × 220cm × 520cm</li>
          <li>Capacidad para 3 pallets estándar (120cm × 100cm)</li>
          <li>Puertas traseras de apertura completa</li>
          <li>Altura interior que permite carga de electrodomésticos grandes</li>
        </ul>

        <div className="mt-4">
          <h4 className="font-medium mb-2">Recomendaciones para la carga:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Distribuir el peso uniformemente para mantener la estabilidad del vehículo</li>
            <li>Colocar los artículos más pesados en la parte inferior</li>
            <li>Asegurar los artículos frágiles con material de protección</li>
            <li>Utilizar correas y sujetadores para evitar el movimiento durante el transporte</li>
            <li>Considerar el orden de entrega al cargar (último en entrar, primero en salir)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

