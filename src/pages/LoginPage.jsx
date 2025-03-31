import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './styles/loginPage.css'; // Crearemos este archivo CSS

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Alternar entre login y signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login, signup, error, currentUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }
      success = await signup(email, password);
    }

    if (success) {
      navigate('/'); // Redirigir a Home después del éxito
    }
  };

  // Si ya está logueado y no está cargando, redirigir a Home
  if (!loading && currentUser) {
    return <Navigate to="/" replace />;
  }

  // Si todavía está cargando, mostrar un indicador
  if (loading) {
    return <div className="loading-indicator">Cargando...</div>; // Estilizar esto
  }

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-btn">
            {isLogin ? 'Entrar' : 'Registrar'}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage; 