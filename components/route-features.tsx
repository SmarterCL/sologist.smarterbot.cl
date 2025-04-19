import { Check } from "lucide-react"

export function RouteFeatures() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">
        Implementación de la fórmula haversine para calcular distancias reales entre puntos en Santiago
      </h2>
      <ul className="space-y-2">
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Consideración de la proximidad entre paradas para minimizar el tiempo total de viaje</span>
        </li>
        <li className="flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <span>Priorización de entregas con ventanas horarias específicas</span>
        </li>
      </ul>
    </div>
  )
}

