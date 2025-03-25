import { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Recuperar preferencia del usuario desde localStorage o usar modo claro por defecto
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Actualizar localStorage cuando cambia el modo
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Actualizar variables CSS para el modo oscuro/claro
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Función para cambiar entre modo oscuro y claro
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}; 