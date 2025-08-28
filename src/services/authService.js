import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Función para obtener los headers de autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const authService = {
  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log('API login response:', response); // Depuración
      
      // Verificar si la respuesta tiene el formato esperado
      if (!response.data || (!response.data.token && !response.data.data?.token)) {
        console.error('Formato de respuesta inesperado:', response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      throw error;
    }
  },

  // Registrar nuevo usuario (solo para administradores)
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener información del usuario actual
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error.response?.data || error.message);
      localStorage.removeItem('token'); // Eliminar token si es inválido
      return null;
    }
  },
};

export default authService;