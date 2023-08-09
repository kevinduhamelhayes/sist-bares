// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjB-I4L-84t2xtRPws1Bdq1K66fh3LWRU",
  authDomain: "sist-bares.firebaseapp.com",
  projectId: "sist-bares",
  storageBucket: "sist-bares.appspot.com",
  messagingSenderId: "183530730329",
  appId: "1:183530730329:web:3575afcf72b57fbf495248",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
