# react-camara

Guía paso a paso para crear una aplicación **React Native / Expo** con un botón de cámara que dispare la cámara del dispositivo al probarse en **Expo GO**.

> Basado en la documentación oficial: https://docs.expo.dev/versions/latest/sdk/camera/

---

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión 20 LTS o superior recomendada)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/) instalado
- La aplicación **Expo GO** instalada en tu dispositivo móvil ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Dispositivo y computadora en la **misma red Wi-Fi**

---

## Paso 1 — Crear un nuevo proyecto con el template en blanco

Abre una terminal y ejecuta el siguiente comando. Cuando se te pida elegir una plantilla, selecciona **"Blank"** (plantilla en blanco).

```bash
npx create-expo-app react-camara
cd react-camara
```

Si usas una versión reciente de Expo CLI puedes indicar el template directamente:

```bash
npx create-expo-app react-camara --template blank
cd react-camara
```

---

## Paso 2 — Instalar el paquete `expo-camera`

Dentro de la carpeta del proyecto instala el SDK de cámara con:

```bash
npx expo install expo-camera
```

> `npx expo install` elige automáticamente la versión del paquete que es compatible con tu versión de Expo SDK. **No uses `npm install` directamente para paquetes de Expo.**

---

## Paso 3 — Reemplazar el contenido de `App.js`

Abre el archivo `App.js` que está en la raíz del proyecto y reemplaza todo su contenido con el siguiente código:

```jsx
import { useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  // Mientras los permisos no se han resuelto, no mostramos nada
  if (!permission) {
    return <View />;
  }

  // Si el permiso fue denegado, mostramos un botón para solicitarlo
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos tu permiso para acceder a la cámara
        </Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  // Alterna entre cámara frontal y trasera
  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  // Captura una foto y guarda su URI en el estado
  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  }

  // Si ya se tomó una foto, la muestra con opción de volver a la cámara
  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <TouchableOpacity style={styles.retakeButton} onPress={() => setPhotoUri(null)}>
          <Text style={styles.text}>Tomar otra foto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Voltear cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  captureButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  preview: {
    flex: 1,
  },
  retakeButton: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
```

### ¿Qué hace este código?

| Parte | Descripción |
|---|---|
| `useCameraPermissions()` | Hook que solicita y gestiona el permiso de cámara del dispositivo. |
| `CameraView` | Componente que muestra el preview en vivo de la cámara. |
| `facing` | Estado que controla si se usa la cámara trasera (`'back'`) o frontal (`'front'`). |
| `toggleCameraFacing` | Función que alterna entre las dos cámaras al pulsar el botón. |
| `cameraRef` | Referencia a `CameraView` necesaria para llamar a `takePictureAsync()`. |
| `takePicture` | Función asíncrona que llama a `cameraRef.current.takePictureAsync()` y guarda la URI de la foto capturada. |
| `photoUri` | Estado que almacena la URI de la foto tomada. Cuando tiene valor, se muestra la imagen en lugar del preview. |
| Botón circular | Botón visual que llama a `takePicture` al pulsarlo, con un anillo blanco y relleno interior característicos de los botones de cámara. |

---

## Paso 4 — Agregar los permisos en `app.json` (solo Android)

Para que la app solicite el permiso de cámara en Android, asegúrate de que tu `app.json` incluya la sección de permisos. Abre `app.json` y verifica que tenga esto:

```json
{
  "expo": {
    "name": "react-camara",
    "slug": "react-camara",
    "android": {
      "permissions": ["android.permission.CAMERA"]
    }
  }
}
```

> En iOS, Expo gestiona los permisos automáticamente a través del `Info.plist`. No necesitas configuración adicional para pruebas con Expo GO.

---

## Paso 5 — Ejecutar la aplicación con Expo GO

Inicia el servidor de desarrollo:

```bash
npx expo start
```

Verás en la terminal un **código QR**. Sigue estos pasos según tu dispositivo:

- **Android**: Abre la app **Expo GO** y toca **"Scan QR code"** (Escanear código QR). Apunta la cámara al código QR que aparece en la terminal.
- **iOS**: Abre la app de **Cámara** nativa y apunta al código QR. Toca la notificación que aparece para abrir **Expo GO**.

La aplicación se cargará en tu dispositivo. Al iniciarse, te pedirá permiso para acceder a la cámara. Concédelo para ver el preview y el botón **"Voltear cámara"**.

---

## Estructura final del proyecto

```
react-camara/
├── App.js          ← Código principal con la cámara
├── app.json        ← Configuración de la app (nombre, permisos, etc.)
├── package.json
└── ...
```

---

## Solución de problemas comunes

| Problema | Solución |
|---|---|
| La cámara no abre / pantalla negra | Asegúrate de haber concedido el permiso de cámara en la configuración del dispositivo. |
| `expo-camera` no se reconoce | Ejecuta `npx expo install expo-camera` nuevamente y reinicia el servidor. |
| El QR no carga en Expo GO | Verifica que el dispositivo y la computadora estén en la misma red Wi-Fi. |
| Error "SDK version mismatch" | Actualiza Expo GO a la última versión desde la tienda de apps. |
| El botón de captura no hace nada | Verifica que la prop `ref={cameraRef}` esté en el componente `<CameraView>` y que `cameraRef` se haya creado con `useRef(null)`. |
| La foto no se muestra después de capturar | Comprueba que `photo.uri` tenga valor en la consola de Metro. Algunos emuladores requieren permisos adicionales de almacenamiento. |

---

## Referencias

- [Documentación oficial de expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Guía de permisos en Expo](https://docs.expo.dev/guides/permissions/)
- [Expo GO — descargar para Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [Expo GO — descargar para iOS](https://apps.apple.com/app/expo-go/id982107779)
