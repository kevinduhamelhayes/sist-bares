import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    // Muestra un indicador de carga mientras se verifica el estado de auth
    // Puedes personalizar este indicador
    return <div>Verificando autenticación...</div>; 
  }

  // Si no hay usuario, redirige a la página de login
  // Outlet renderiza el componente hijo de la ruta si el usuario está autenticado
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 