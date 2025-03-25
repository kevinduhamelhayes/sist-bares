//import{ initializeApp } from "firebase/app"
//import { getFirestore } from "firebase/firestore"
//import { getAuth } from "firebase/auth"
//import { getStorage } from "firebase/storage"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'

//const firebaseApp = initializeApp({
//    apiKey: "AIzaSyAjB-I4L-84t2xtRPws1Bdq1K66fh3LWRU",
//  authDomain: "sist-bares.firebaseapp.com",
//projectId: "sist-bares",
//    storageBucket: "sist-bares.appspot.com",
// messagingSenderId: "183530730329",
//appId: "1:183530730329:web:3575afcf72b57fbf495248"
//});
//const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
