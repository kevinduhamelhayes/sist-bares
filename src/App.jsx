import { useState } from "react"
import Body from "./components/Body"
import Cards from "./components/Cards"
//import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
//import Hero from "./components/Hero"

function App() {
  const [darkMode, setDarkMode] = useState(false)
  return (
    <div className={`App ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Navbar setDarkMode={setDarkMode} darkMode={darkMode} />
      <Body />
      <Cards />
      <Footer />
    </div>
  )
}

export default App