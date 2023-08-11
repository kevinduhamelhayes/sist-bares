import { useState } from "react"
import Body from "./components/Body"
import AddSpecialTable from "./components/AddSpecialTable"
//import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import { Route, Routes } from "react-router-dom"
import AddProducts from "./components/AddProducts"

function App() {
  const [darkMode, setDarkMode] = useState(false)
  return (
    <div className={`App ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Navbar setDarkMode={setDarkMode} darkMode={darkMode} />
      <Routes>
        <Route exact path="/" element={<Body />} />
        <Route exact path="/addspecialtable" element={<AddSpecialTable />} />
        <Route exact path="/addproducts" element={<AddProducts />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
