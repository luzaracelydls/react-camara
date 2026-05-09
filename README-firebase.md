# Autenticación con Firebase — react-camara

Esta guía explica cómo configurar Firebase Authentication en el proyecto `react-camara` para habilitar el flujo de login con correo y contraseña.

---

## Requisitos previos

- Node.js 20 LTS o superior
- Una cuenta de Google para acceder a [Firebase Console](https://console.firebase.google.com/)
- La app **Expo GO** instalada en tu dispositivo

---

## Paso 1 — Crear un proyecto en Firebase

1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** y sigue los pasos del asistente.
3. Una vez creado el proyecto, haz clic en el ícono **web** (`</>`) para registrar tu app.
4. Asigna un nombre a la app (por ejemplo `react-camara`) y haz clic en **"Registrar app"**.
5. Firebase te mostrará un objeto `firebaseConfig` con los valores de configuración. Guárdalos; los necesitarás en el Paso 3.

---

## Paso 2 — Habilitar el proveedor de autenticación

1. En la consola de Firebase, navega a **Authentication → Sign-in method**.
2. Haz clic en **"Correo electrónico/Contraseña"** y actívalo.
3. Guarda los cambios.

Para crear un usuario de prueba:

1. Ve a **Authentication → Users**.
2. Haz clic en **"Agregar usuario"**.
3. Ingresa un correo y contraseña y haz clic en **"Agregar usuario"**.

---

## Paso 3 — Configurar las variables de entorno

1. En la raíz del proyecto, crea un archivo `.env` copiando el ejemplo:

   ```bash
   cp .env.example .env
   ```

2. Abre `.env` y reemplaza los valores con los datos del objeto `firebaseConfig` que obtuviste en el Paso 1:

   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=mi-proyecto.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=mi-proyecto
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=mi-proyecto.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123
   ```

> **Importante:** el archivo `.env` está en `.gitignore` y **nunca debe subirse al repositorio**. Las variables con prefijo `EXPO_PUBLIC_` son expuestas al cliente en tiempo de compilación — no almacenes secretos de servidor en ellas.

---

## Paso 4 — Instalar dependencias

```bash
npm install
```

---

## Paso 5 — Ejecutar la aplicación

```bash
npx expo start
```

Escanea el QR con **Expo GO** en tu dispositivo.

---

## Flujo de autenticación

```
Inicio de la app
      │
      ▼
onAuthStateChanged (Firebase escucha el estado)
      │
      ├── Usuario autenticado ──► CameraScreen (cámara + botón "Cerrar sesión")
      │
      └── Sin sesión activa ────► LoginScreen  (formulario de correo y contraseña)
```

| Estado | Pantalla mostrada |
|--------|-------------------|
| Cargando sesión | Indicador de carga (`ActivityIndicator`) |
| Sin sesión | `LoginScreen` — formulario de login |
| Sesión activa | `CameraScreen` — cámara con botón de logout |

---

## Estructura del proyecto

```
react-camara/
├── App.js                       ← Raíz: gestiona el estado de autenticación
├── app.json                     ← Configuración Expo (permisos, etc.)
├── package.json
├── babel.config.js
├── .env                         ← Variables de entorno (NO subir al repo)
├── .env.example                 ← Plantilla de variables de entorno
├── .gitignore
└── src/
    ├── firebase/
    │   └── config.js            ← Inicialización de Firebase
    └── screens/
        ├── LoginScreen.js       ← Pantalla de inicio de sesión
        └── CameraScreen.js      ← Pantalla de cámara (requiere sesión)
```

---

## Solución de problemas

| Problema | Solución |
|---|---|
| `Firebase: Error (auth/invalid-credential)` | Verifica que el correo y contraseña sean correctos y que el usuario exista en Firebase Console. |
| `Firebase: Error (auth/network-request-failed)` | Comprueba tu conexión a internet. |
| Las variables de entorno no se leen | Asegúrate de que las variables tengan el prefijo `EXPO_PUBLIC_` y de reiniciar el servidor con `npx expo start --clear`. |
| La app no carga tras configurar Firebase | Verifica que todos los valores en `.env` sean correctos y que el proyecto de Firebase exista. |

---

## Referencias

- [Firebase Authentication — Documentación oficial](https://firebase.google.com/docs/auth)
- [Firebase SDK para JavaScript](https://firebase.google.com/docs/web/setup)
- [Variables de entorno en Expo](https://docs.expo.dev/guides/environment-variables/)
- [Documentación de expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/)
