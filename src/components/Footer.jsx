import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-300 py-6 px-4 mt-auto shadow-[0_-2px_5px_rgba(0,0,0,0.1)]">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-4 md:flex-col">
        <p className="text-sm text-center flex-grow md:order-1">
          &copy; {currentYear} Sistema Bares - Todos los derechos reservados.
        </p>
        
        <div className="flex gap-4 justify-center md:order-3">
          <a 
            href="#" 
            className="text-sm text-gray-100 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400 hover:underline transition-colors duration-300"
          >
            Política de Privacidad
          </a>
          <a 
            href="#" 
            className="text-sm text-gray-100 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400 hover:underline transition-colors duration-300"
          >
            Términos de Servicio
          </a>
        </div>
        
        <div className="flex gap-4 justify-center md:order-2">
          <a 
            href="https://github.com/tu-usuario" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xl text-gray-100 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400 hover:scale-110 transition-all duration-300"
          >
            <FaGithub />
          </a>
          <a 
            href="https://linkedin.com/in/tu-usuario" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xl text-gray-100 dark:text-gray-300 hover:text-blue-400 dark:hover:text-blue-400 hover:scale-110 transition-all duration-300"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
