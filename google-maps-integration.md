# Integración con Google Maps

Para integrar Google Maps en la aplicación Mersan Delivery, necesitarás configurar una cuenta de Google Cloud Platform y obtener las credenciales API necesarias. A continuación se detallan los pasos:

## 1. Crear una cuenta de Google Cloud Platform

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea una cuenta si no tienes una
3. Crea un nuevo proyecto para Mersan Delivery

## 2. Habilitar las APIs necesarias

Para una aplicación de rutas de entrega, necesitarás habilitar:

- Maps JavaScript API
- Directions API
- Distance Matrix API
- Geocoding API
- Places API

## 3. Crear credenciales API

1. En la consola de Google Cloud, ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "API Key"
3. Restringe la clave API para mayor seguridad:
   - Restricción por HTTP referrers (dominio de tu aplicación)
   - Restricción por APIs (solo las que necesitas)

## 4. Configurar OAuth 2.0 (si es necesario)

Si necesitas acceder a datos del usuario o a sus hojas de cálculo de Google, deberás configurar OAuth 2.0:

1. En "Credentials", haz clic en "Create Credentials" > "OAuth client ID"
2. Configura la pantalla de consentimiento
3. Selecciona el tipo de aplicación (Web application)
4. Agrega los URIs de redirección autorizados
5. Obtén el Client ID y Client Secret

## 5. Configurar Google Sheets API (para importación directa)

1. Habilita la Google Sheets API en tu proyecto
2. Configura el alcance (scope) adecuado en tu configuración OAuth:
   - `https://www.googleapis.com/auth/spreadsheets.readonly` (para solo lectura)

## 6. Implementación en la aplicación

Para la implementación en Next.js, necesitarás:

1. Almacenar las claves API como variables de entorno:

