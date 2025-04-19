import { Check, Truck, Package, Clock, Shield, Leaf, Warehouse, Globe, PenToolIcon as Tool } from "lucide-react"
import { Card } from "@/components/ui/card"

export function CompanyInfo() {
  return (
    <div className="space-y-8 py-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">SOLOGIST</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Puntualidad, tracking online y ecología en cada distribución que realizamos
        </p>
        <p className="mt-4 text-gray-600">
          Ofrecemos un servicio integral y personalizado de logística, retiro, transporte y envío de productos, según
          tus necesidades.
        </p>
      </div>

      {/* Servicios */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { icon: <Warehouse className="h-6 w-6 text-blue-600" />, name: "Almacenaje" },
          { icon: <Globe className="h-6 w-6 text-blue-600" />, name: "Eco Trade" },
          { icon: <Clock className="h-6 w-6 text-blue-600" />, name: "Tracking Online" },
          { icon: <Truck className="h-6 w-6 text-blue-600" />, name: "Same Day" },
          { icon: <Package className="h-6 w-6 text-blue-600" />, name: "Next Day" },
          { icon: <Shield className="h-6 w-6 text-blue-600" />, name: "Control Tower" },
          { icon: <Leaf className="h-6 w-6 text-blue-600" />, name: "Distribución ecológica" },
          { icon: <Shield className="h-6 w-6 text-blue-600" />, name: "Seguro de la carga" },
          { icon: <Package className="h-6 w-6 text-blue-600" />, name: "Control documental" },
          { icon: <Tool className="h-6 w-6 text-blue-600" />, name: "Instalación de productos electrodomésticos" },
        ].map((service, index) => (
          <Card key={index} className="p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="mb-2">{service.icon}</div>
            <h3 className="text-sm font-medium">{service.name}</h3>
          </Card>
        ))}
      </div>

      {/* Sobre Nosotros */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Sobre Nosotros</h2>
        <h3 className="text-xl font-semibold mb-3">¿Quiénes somos?</h3>
        <p className="text-gray-600 mb-4">
          En SOLOGIST ofrecemos un servicio de logística, transporte y distribución de carga con los más altos
          estándares de seguridad. La calidad y la orientación de servicio son el común denominador en nuestro trabajo
          diario con los clientes. Por eso, en base a las necesidades del cliente, les ofrecemos una solución
          personalizada y acorde a sus requerimientos.
        </p>
        <button className="text-blue-600 font-medium hover:underline">VER MÁS</button>
      </div>

      {/* Qué nos hace diferentes */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">¿Qué nos hace diferentes?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Atención personalizada en línea 24/7.",
            "Experiencia para realizar operaciones aeroportuarias y portuarias.",
            "Entregamos un servicio integral de logística y fulfillment.",
            "Personal altamente calificado y especializado.",
            "Protocolos de seguridad de primer nivel y estudios de rutas críticas.",
            "Seguros de carga ante eventuales siniestros.",
            "Realizamos servicios con flexibilidad horaria y agilidad operacional.",
            "Atención personalizada en línea 24/7.",
            "Experiencia para realizar operaciones aeroportuarias y portuarias.",
            "Entregamos un servicio integral de logística y fulfillment.",
            "Personal altamente calificado y especializado.",
            "Protocolos de seguridad de primer nivel y estudios de rutas críticas.",
          ].map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

