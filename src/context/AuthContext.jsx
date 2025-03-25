import { createContext, useState, useEffect } from 'react';
import { auth } from '../components/firebaseConfig';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';

// Crear el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message);
      return false;
    }
  };

  // Registrar usuario
  const signup = async (email, password) => {
    try {
      setError('');
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setError('Error al registrarse: ' + err.message);
      return false;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (err) {
      setError('Error al cerrar sesión: ' + err.message);
      return false;
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 