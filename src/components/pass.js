import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  FieldValue, 
  Timestamp, 
  increment 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const provider = new GoogleAuthProvider();
export const analytics = getAnalytics(firebaseApp);
export const functions = getFunctions(firebaseApp);
export const messaging = getMessaging(firebaseApp);

// Firebase no exporta directamente estas funcionalidades en v9 como objetos
// Se recomienda importar las funciones específicas que necesites directamente de firebase/firestore
export const firestore = { collection };
export const fieldValue = FieldValue;
export const timestamp = Timestamp;
// Para incrementar, ahora se recomienda usar: increment(1) directamente donde se necesite
