import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const espacioService = {
  // Obtener todos los espacios
  getAllEspacios: async () => {
    const response = await axios.get(`${API_URL}/espacio`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Obtener espacios por ID de parking
  getEspaciosByParkingId: async (parkingId) => {
    const response = await axios.get(`${API_URL}/espacio/parking/${parkingId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Obtener espacios disponibles por ID de parking
  getEspaciosDisponiblesByParkingId: async (parkingId) => {
    const response = await axios.get(`${API_URL}/espacio/parking/${parkingId}/disponibles`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Crear un nuevo espacio
  createEspacio: async (espacioData) => {
    const response = await axios.post(`${API_URL}/espacio`, espacioData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Actualizar un espacio existente
  updateEspacio: async (id, espacioData) => {
    const response = await axios.put(`${API_URL}/espacio/${id}`, espacioData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Cambiar estado de un espacio (ocupado/libre)
  cambiarEstadoEspacio: async (id, estado) => {
    const response = await axios.patch(`${API_URL}/espacio/${id}/estado`, { estado }, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Eliminar un espacio
  deleteEspacio: async (id) => {
    const response = await axios.delete(`${API_URL}/espacio/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
};

export default espacioService;