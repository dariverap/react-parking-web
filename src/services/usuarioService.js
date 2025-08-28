import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const usuarioService = {
  // Obtener todos los usuarios
  getAllUsuarios: async () => {
    const response = await axios.get(`${API_URL}/usuario`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Obtener un usuario por ID
  getUsuarioById: async (id) => {
    const response = await axios.get(`${API_URL}/usuario/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Actualizar un usuario
  updateUsuario: async (id, userData) => {
    const response = await axios.put(`${API_URL}/usuario/${id}`, userData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Bloquear/desbloquear un usuario
  toggleBloqueoUsuario: async (id, bloqueado) => {
    const response = await axios.patch(`${API_URL}/usuario/${id}/bloqueo`, { bloqueado }, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Obtener empleados disponibles para asignar a parkings
  getEmpleadosDisponibles: async () => {
    const response = await axios.get(`${API_URL}/usuario/empleados-disponibles`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
};

export default usuarioService;