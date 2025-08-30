import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const usuarioService = {
  // Obtener todos los usuarios
  getAllUsuarios: async () => {
    const response = await axios.get(`${API_URL}/usuarios`, {
      headers: getAuthHeader()
    });
    // Backend responde { success, data: [...] }
    return response.data?.data ?? [];
  },

  // Obtener un usuario por ID
  getUsuarioById: async (id) => {
    const response = await axios.get(`${API_URL}/usuarios/${id}`, {
      headers: getAuthHeader()
    });
    return response.data?.data;
  },

  // Actualizar un usuario
  updateUsuario: async (id, userData) => {
    const response = await axios.put(`${API_URL}/usuarios/${id}`, userData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Bloquear/desbloquear un usuario
  toggleBloqueoUsuario: async (id, bloqueado) => {
    const response = await axios.patch(`${API_URL}/usuarios/${id}/bloqueo`, { bloqueado }, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Obtener empleados disponibles para asignar a parkings
  getEmpleadosDisponibles: async () => {
    const response = await axios.get(`${API_URL}/usuarios/empleados-disponibles`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Eliminar (borrado lógico) un usuario
  deleteUsuario: async (id, motivo_baja) => {
    const response = await axios.delete(`${API_URL}/usuarios/${id}`, {
      headers: getAuthHeader(),
      data: { motivo_baja }
    });
    return response.data;
  },
};

export default usuarioService;