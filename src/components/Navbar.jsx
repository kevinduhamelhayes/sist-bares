import { Link } from "react-router-dom"
import "./styles/navbar.css"
import { MdDarkMode, MdOutlineDarkMode, MdMenu, MdClose } from "react-icons/md"
import { useState } from "react"

const Navbar = ({ setDarkMode, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img className="logo" src="/logo.png" alt="Logo Sistema Bares" />
          <h1 className="site-title">SisBar</h1>
        </div>
        
        <div className="navbar-mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                Mesas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/menu" onClick={() => setIsMenuOpen(false)}>
                Gestión de Menú
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/addproducts" onClick={() => setIsMenuOpen(false)}>
                Añadir Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/addspecialtable" onClick={() => setIsMenuOpen(false)}>
                Mesas Especiales
              </Link>
            </li>
          </ul>
          
          <div className="navbar-actions">
            <button
              className="btn-darkmode"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {darkMode ? (
                <MdDarkMode color="var(--text-color)" size={24} />
              ) : (
                <MdOutlineDarkMode color="var(--text-color)" size={24} />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
