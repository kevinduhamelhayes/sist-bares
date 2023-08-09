// firebaseConfig.js
import * as firebase from "firebase/app"
import "firebase/firestore"

const firebaseConfig = {
  // Tus configuraciones de Firebase aquí (apiKey, authDomain, etc.)
}

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore()
