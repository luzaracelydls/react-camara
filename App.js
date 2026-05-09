import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase/config';
import LoginScreen from './src/screens/LoginScreen';
import CameraScreen from './src/screens/CameraScreen';

export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    // Escucha los cambios de estado de autenticación de Firebase.
    // Cuando el usuario inicia o cierra sesión, el estado se actualiza automáticamente.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Limpia el listener cuando el componente se desmonta
    return unsubscribe;
  }, []);

  // Mientras se resuelve el estado de autenticación, mostramos un indicador de carga
  if (user === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Si hay un usuario autenticado → mostrar la cámara; si no → mostrar el login
  return user ? <CameraScreen /> : <LoginScreen />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
