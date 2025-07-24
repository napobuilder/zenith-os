import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyAC2fgQaPxHqjS_I7G06sSvRUZnWz8HdJg",
  authDomain: "zenith-57328.firebaseapp.com",
  projectId: "zenith-57328",
  storageBucket: "zenith-57328.appspot.com",
  messagingSenderId: "292417246834",
  appId: "1292417246834web2a52d365e3d37395c114eb",
  measurementId: "G-6PDXYHDYNX"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
