export function HowToUse() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Cómo Usar la Aplicación:</h2>
      <ol className="list-decimal pl-5 space-y-4">
        <li className="pl-2">
          <p className="font-medium">Importa tus direcciones</p>
          <p className="text-sm text-gray-600">desde Google Sheets o un archivo CSV/Excel</p>
        </li>
        <li className="pl-2">
          <p className="font-medium">Revisa la secuencia de carga</p>
          <p className="text-sm text-gray-600">para organizar los paquetes en el camión correctamente</p>
        </li>
        <li className="pl-2">
          <p className="font-medium">Sigue la ruta optimizada</p>
          <p className="text-sm text-gray-600">mostrada en el mapa</p>
        </li>
        <li className="pl-2">
          <p className="font-medium">Marca las entregas como completadas</p>
          <p className="text-sm text-gray-600">durante el recorrido</p>
        </li>
        <li className="pl-2">
          <p className="font-medium">Imprime la hoja de ruta</p>
          <p className="text-sm text-gray-600">para el conductor con toda la información necesaria</p>
        </li>
      </ol>
    </div>
  )
}

