# Continuación del ejercicio: guardar la foto en el carrete y soportar web

En esta segunda parte del ejercicio, vas a extender la app `react-camara` para que, además de tomar una foto, pueda:

- guardar la imagen en la galería o carrete en **Android/iOS**
- funcionar también en **web**
- validar la plataforma antes de guardar

## Objetivo

Modificar la aplicación para que, después de tomar una foto:

- en dispositivos móviles use `expo-media-library` para guardar la imagen
- en web descargue la imagen automáticamente

---

## Paso 1 — Instalar `expo-media-library`

Desde la terminal, dentro del proyecto, ejecuta:

```bash
npx expo install expo-media-library
```

> Usa siempre `npx expo install` para paquetes de Expo, ya que instala la versión compatible con tu SDK.

---

## Paso 2 — Actualizar los imports en `App.js`

Abre `App.js` y agrega `Platform`, `Alert` y `expo-media-library`.

```jsx
import { useRef, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
```

---

## Paso 3 — Agregar permisos para la galería

Dentro del componente principal, crea el hook para permisos de la librería multimedia:

```jsx
const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
```

Este permiso se usará solo en **Android/iOS** para guardar la foto en la galería.

---

## Paso 4 — Crear una función para guardar la foto según la plataforma

Agrega una nueva función llamada `savePhoto`.

```jsx
async function savePhoto(uri) {
  try {
    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = uri;
      link.download = `foto-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (!mediaPermission?.granted) {
      const permissionResponse = await requestMediaPermission();
      if (!permissionResponse.granted) {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos permiso para guardar la foto en la galería.'
        );
        return;
      }
    }

    await MediaLibrary.saveToLibraryAsync(uri);
    Alert.alert('Éxito', 'La foto se guardó en la galería.');
  } catch (error) {
    Alert.alert('Error', 'No se pudo guardar la foto.');
    console.error(error);
  }
}
```

### ¿Qué hace esta función?

| Caso | Acción |
|---|---|
| `Platform.OS === 'web'` | Descarga la imagen automáticamente |
| `Platform.OS !== 'web'` | Solicita permiso y guarda en la galería |

---

## Paso 5 — Llamar a `savePhoto` después de capturar la imagen

Modifica la función `takePicture` para guardar la foto después de tomarla:

```jsx
async function takePicture() {
  try {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    setPhotoUri(photo.uri);

    await savePhoto(photo.uri);
  } catch (error) {
    Alert.alert('Error', 'No se pudo tomar la foto.');
    console.error(error);
  }
}
```

---

## Paso 6 — Código completo sugerido para `App.js`

```jsx
import { useRef, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

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

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function savePhoto(uri) {
    try {
      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = `foto-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      if (!mediaPermission?.granted) {
        const permissionResponse = await requestMediaPermission();
        if (!permissionResponse.granted) {
          Alert.alert(
            'Permiso requerido',
            'Necesitamos permiso para guardar la foto en la galería.'
          );
          return;
        }
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Éxito', 'La foto se guardó en la galería.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la foto.');
      console.error(error);
    }
  }

  async function takePicture() {
    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);

      await savePhoto(photo.uri);
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto.');
      console.error(error);
    }
  }

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => setPhotoUri(null)}
        >
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

---

## Paso 7 — Revisar permisos en `app.json`

Verifica que `app.json` tenga al menos el permiso de cámara en Android:

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

> Dependiendo de la versión de Android y Expo, `expo-media-library` solicitará permisos adicionales cuando sea necesario.

---

## Resultado esperado

Al finalizar este ejercicio:

- podrás tomar una foto desde la app
- en **Android/iOS** se guardará en la galería
- en **web** se descargará automáticamente
- el código validará la plataforma antes de ejecutar la lógica de guardado

---

## Reto opcional

Si quieres extender aún más la práctica, intenta agregar:

1. un botón separado para **guardar** la foto en lugar de hacerlo automáticamente
2. un mensaje visual cuando la imagen se guarde correctamente
3. un nombre personalizado para el archivo descargado en web
4. una pantalla previa de confirmación antes de guardar

---

## Conceptos reforzados

En esta parte del ejercicio practicarás:

- uso de `Platform` en React Native
- diferencias entre **web** y **mobile**
- permisos en Expo
- uso de `expo-media-library`
- separación de responsabilidades entre `takePicture()` y `savePhoto()`

---

## Referencias

- [Documentación oficial de expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Documentación oficial de expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/)
- [Guía de permisos en Expo](https://docs.expo.dev/guides/permissions/)
