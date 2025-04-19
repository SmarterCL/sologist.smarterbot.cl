export interface Delivery {
  id: number
  address: string
  commune: string
  status: "pending" | "completed"
  position: { top: string; left: string }
  estimatedTime?: string
  distance?: number
  packageSize?: "small" | "medium" | "large" | "extra-large"
  packageType?: "refrigerador" | "lavadora" | "cocina" | "microondas" | "televisor" | "otro"
}

export interface CommuneColors {
  [key: string]: string
}

export interface RouteStats {
  totalDistance: number
  totalTime: string
  totalPoints: number
  completedPoints: number
  pendingPoints: number
  optimizationType: string
}

export type OptimizationType = "distance" | "distance-reverse" | "commune" | "commune-radius" | "hybrid" | "manual"

