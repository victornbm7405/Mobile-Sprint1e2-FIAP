import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyByhxFhGfeu_aV40oOuwKzIAPwCnPe9Tfg",
  authDomain: "projetovictor-817ad.firebaseapp.com",
  projectId: "projetovictor-817ad",
  storageBucket: "projetovictor-817ad.firebasestorage.app",
  messagingSenderId: "777243568227",
  appId: "1:777243568227:web:e19b9011be5ec79fe2b056"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
