import { Check } from "lucide-react"

export function ImprovedRouteSheet() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">4. Hoja de Ruta Mejorada</h2>
      <p className="mb-2">La función de impresión ahora incluye:</p>
      <ul className="space-y-2">
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Secuencia de carga del camión</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Lista completa de entregas en orden optimizado</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Indicación clara del retorno al depósito</span>
        </li>
      </ul>
    </div>
  )
}

