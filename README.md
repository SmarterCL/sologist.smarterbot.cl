# Mersan Delivery - Optimizador de Rutas

Aplicación web para optimizar rutas de entrega en Santiago, Chile. Desarrollada con Next.js y Tailwind CSS.

## Características

- Importación de direcciones desde Google Sheets, CSV o Excel
- Múltiples métodos de optimización de rutas:
  - Por distancia (menor a mayor)
  - Por distancia (mayor a menor)
  - Por comunas
  - Por radio dentro de comuna
- Visualización de rutas en mapa interactivo
- Estadísticas completas de la ruta (distancia, tiempo, puntos)
- Marcadores numerados y codificados por color según comuna
- Interfaz responsive y amigable

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/SmarterCL/SmarterCL.git
cd SmarterCL

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

