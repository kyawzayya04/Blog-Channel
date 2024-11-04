import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH4cVK4IAAyE93CNzS7H_fU6caiKIhVjs",
  authDomain: "library-app-e8fce.firebaseapp.com",
  projectId: "library-app-e8fce",
  storageBucket: "library-app-e8fce.appspot.com",
  messagingSenderId: "526738610533",
  appId: "1:526738610533:web:b482fccdd1eb61c014a98c",
  measurementId: "G-XZ9HGB81H2",
};

const app = initializeApp(firebaseConfig);

let db = getFirestore(app);
let auth = getAuth(app);
let storage = getStorage(app);

export { db, auth, storage };
