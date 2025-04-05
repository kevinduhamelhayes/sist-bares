import { Link, useNavigate } from "react-router-dom"
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
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-50 transition-all duration-300">
      <div className="flex items-center justify-between px-8 py-3 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <img className="h-10 w-auto" src="/logo.png" alt="Logo Sistema Bares" />
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 m-0">SisBar</h1>
        </div>
        
        <button 
          className="hidden md:flex items-center justify-center text-gray-700 dark:text-gray-300 cursor-pointer"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
        
        <div className={`
          flex items-center gap-8
          md:fixed md:top-0 md:right-0 md:h-screen md:w-[70%] md:max-w-[300px] md:flex-col md:justify-start 
          md:p-8 md:pt-20 md:bg-white md:dark:bg-gray-800 md:shadow-lg md:transition-transform md:duration-300
          ${isMenuOpen ? 'md:translate-x-0' : 'md:translate-x-full'}
        `}>
          <ul className="flex items-center gap-6 md:flex-col md:w-full md:gap-4">
            {currentUser && (
              <>
                <li>
                  <Link 
                    className="text-gray-700 dark:text-gray-300 font-medium relative py-2 hover:text-blue-700 dark:hover:text-blue-400
                      after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
                      after:bg-blue-700 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
                    to="/" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mesas
                  </Link>
                </li>
                <li>
                  <Link 
                    className="text-gray-700 dark:text-gray-300 font-medium relative py-2 hover:text-blue-700 dark:hover:text-blue-400
                      after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
                      after:bg-blue-700 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
                    to="/menu" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Gestión de Menú
                  </Link>
                </li>
                <li>
                  <Link 
                    className="text-gray-700 dark:text-gray-300 font-medium relative py-2 hover:text-blue-700 dark:hover:text-blue-400
                      after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
                      after:bg-blue-700 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
                    to="/add-products" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Añadir Productos
                  </Link>
                </li>
                <li>
                  <Link 
                    className="text-gray-700 dark:text-gray-300 font-medium relative py-2 hover:text-blue-700 dark:hover:text-blue-400
                      after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
                      after:bg-blue-700 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
                    to="/add-special-table" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mesas Especiales
                  </Link>
                </li>
                <li>
                  <Link 
                    className="text-gray-700 dark:text-gray-300 font-medium relative py-2 hover:text-blue-700 dark:hover:text-blue-400
                      after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 
                      after:bg-blue-700 dark:after:bg-blue-400 after:transition-all hover:after:w-full"
                    to="/reports" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Reportes y Caja
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="flex items-center gap-4 md:mt-auto">
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDarkMode ? (
                <MdDarkMode className="text-gray-700 dark:text-gray-300" size={24} />
              ) : (
                <MdOutlineDarkMode className="text-gray-700 dark:text-gray-300" size={24} />
              )}
            </button>
            
            {currentUser ? (
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 border border-blue-700 dark:border-blue-400 
                  text-blue-700 dark:text-blue-400 rounded-full font-medium hover:bg-blue-700 dark:hover:bg-blue-400 
                  hover:text-white transition-colors"
                onClick={handleLogout} 
                aria-label="Cerrar sesión"
              >
                <MdLogout size={24} />
                <span>Salir</span>
              </button>
            ) : (
              <button 
                className="inline-flex items-center gap-2 px-4 py-2 border border-blue-700 dark:border-blue-400 
                  text-blue-700 dark:text-blue-400 rounded-full font-medium hover:bg-blue-700 dark:hover:bg-blue-400 
                  hover:text-white transition-colors"
                onClick={handleLoginClick} 
                aria-label="Iniciar sesión"
              >
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
