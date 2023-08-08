import "./styles/navbar.css"
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md"

const Navbar = ({ setDarkMode, darkMode }) => {
  return (
    <nav className="navbar">
      <div className="right">
            <img className="logo" src="./public/logo.png" alt="" />
      </div>
      <div className="left">
        <ul className="ul-nav-right">
          <li className="ul-nav-right-li">Menu</li>
          <li className="ul-nav-right-li">Abrir Mesa</li>
          <li className="ul-nav-right-li">Cerrar Mesa</li>
          <li className="ul-nav-right-li">Abrir Caja</li>
          <li className="ul-nav-right-li">Cerar Caja</li>
          <li className="ul-nav-right-li">
            <button className="ingresar">Edicion masiva</button>
          </li>
          <li>
            <button
              className="btn-darkmode"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <MdDarkMode color="var(--dark-color)" size={25} />
              ) : (
                <MdOutlineDarkMode color="var(--dark-color)" size={25} />
              )}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
