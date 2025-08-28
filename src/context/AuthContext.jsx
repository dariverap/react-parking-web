import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verificar si el token es válido
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expirado
            localStorage.removeItem('token');
            setCurrentUser(null);
          } else {
            // Token válido, obtener información del usuario
            const userInfo = await authService.getCurrentUser();
            setCurrentUser(userInfo);
          }
        }
      } catch (err) {
        console.error('Error al verificar autenticación:', err);
        localStorage.removeItem('token');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      console.log('Login response:', response); // Depuración
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.usuario);
      } else if (response.token) {
        localStorage.setItem('token', response.token);
        setCurrentUser(response.usuario || response.user);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
      
      // Redirigir según el rol del usuario
      const user = response.data?.usuario || response.usuario || response.user;
      console.log('Usuario para redirección:', user); // Depuración
      
      if (user && user.rol === 'admin') {
        navigate('/admin/dashboard');
      } else if (user && user.rol === 'empleado') {
        navigate('/employee/dashboard');
      } else {
        console.error('Rol de usuario no reconocido:', user);
      }
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};