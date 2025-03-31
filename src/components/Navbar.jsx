import { Link, useNavigate } from "react-router-dom"
import "./styles/navbar.css"
import { MdDarkMode, MdOutlineDarkMode, MdMenu, MdClose, MdLogout, MdLogin } from "react-icons/md"
import { useState, useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { AuthContext } from "../context/AuthContext"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/login');
  };
  
  const handleLoginClick = () => {
    setIsMenuOpen(false);
    navigate('/login');
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
            {currentUser && (
              <>
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
                  <Link className="nav-link" to="/add-products" onClick={() => setIsMenuOpen(false)}>
                    Añadir Productos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-special-table" onClick={() => setIsMenuOpen(false)}>
                    Mesas Especiales
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="navbar-actions">
            <button
              className="btn-darkmode"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDarkMode ? (
                <MdDarkMode color="var(--text-color)" size={24} />
              ) : (
                <MdOutlineDarkMode color="var(--text-color)" size={24} />
              )}
            </button>
            
            {currentUser ? (
              <button className="btn-auth" onClick={handleLogout} aria-label="Cerrar sesión">
                <MdLogout size={24} />
                <span>Salir</span>
              </button>
            ) : (
              <button className="btn-auth" onClick={handleLoginClick} aria-label="Iniciar sesión">
                <MdLogin size={24} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
