import { Check } from "lucide-react"

export function ImprovedVisualization() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">5. Visualización Mejorada</h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Marcadores de color para distinguir entre el depósito (azul) y las entregas (rojo/verde)</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Indicación visual del retorno al depósito en la lista de entregas</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Ruta completa trazada en el mapa</span>
        </li>
      </ul>
    </div>
  )
}

