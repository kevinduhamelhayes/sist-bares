import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
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
      navigate('/');
    }
  };

  if (!loading && currentUser) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-gray-600 dark:text-gray-300">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 
                focus:border-blue-500 dark:focus:border-blue-400
                outline-none transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contraseña
            </label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 
                focus:border-blue-500 dark:focus:border-blue-400
                outline-none transition-colors duration-200"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirmar Contraseña
              </label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 
                  focus:border-blue-500 dark:focus:border-blue-400
                  outline-none transition-colors duration-200"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
              rounded-md shadow-sm hover:shadow transition-all duration-200
              dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isLogin ? 'Entrar' : 'Registrar'}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="w-full mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 
            dark:hover:text-blue-300 transition-colors duration-200"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage; 