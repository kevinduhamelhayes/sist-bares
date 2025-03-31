import React from 'react';
import './styles/footer.css'; // Asegúrate de crear e importar el CSS
import { FaGithub, FaLinkedin } from 'react-icons/fa'; // Ejemplo con iconos

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copyright">
          &copy; {currentYear} Sistema Bares - Todos los derechos reservados.
        </p>
        <div className="footer-links">
          {/* Ejemplo de enlaces */}
          <a href="#" className="footer-link">Política de Privacidad</a>
          <a href="#" className="footer-link">Términos de Servicio</a>
        </div>
        <div className="footer-social">
          {/* Ejemplo de iconos sociales */}
          <a href="https://github.com/tu-usuario" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/tu-usuario" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
