//import{ initializeApp } from "firebase/app"
//import { getFirestore } from "firebase/firestore"
//import { getAuth } from "firebase/auth"
//import { getStorage } from "firebase/storage"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { BrowserRouter } from "react-router-dom"

//const firebaseApp = initializeApp({
//    apiKey: "AIzaSyAjB-I4L-84t2xtRPws1Bdq1K66fh3LWRU",
//  authDomain: "sist-bares.firebaseapp.com",
//projectId: "sist-bares",
//    storageBucket: "sist-bares.appspot.com",
// messagingSenderId: "183530730329",
//appId: "1:183530730329:web:3575afcf72b57fbf495248"
//});
//const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
