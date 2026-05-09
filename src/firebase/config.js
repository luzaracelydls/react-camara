import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Lee la configuración desde variables de entorno (EXPO_PUBLIC_*)
// Crea un archivo .env en la raíz del proyecto con los valores de tu proyecto Firebase.
// Consulta .env.example para ver qué variables son necesarias.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const requiredKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
if (missingKeys.length > 0) {
  throw new Error(
    `Configuración de Firebase incompleta. Faltan las siguientes variables de entorno: ${missingKeys
      .map((k) => `EXPO_PUBLIC_FIREBASE_${k.replace(/([A-Z])/g, '_$1').toUpperCase()}`)
      .join(', ')}. Consulta .env.example para más información.`
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
