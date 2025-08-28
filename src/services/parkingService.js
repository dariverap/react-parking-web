import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const parkingService = {
  // Obtener todos los parkings
  getAllParkings: async () => {
    const response = await axios.get(`${API_URL}/parking`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Obtener un parking por ID
  getParkingById: async (id) => {
    const response = await axios.get(`${API_URL}/parking/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Crear un nuevo parking
  createParking: async (parkingData) => {
    const response = await axios.post(`${API_URL}/parking`, parkingData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Actualizar un parking existente
  updateParking: async (id, parkingData) => {
    const response = await axios.put(`${API_URL}/parking/${id}`, parkingData, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Eliminar un parking
  deleteParking: async (id) => {
    const response = await axios.delete(`${API_URL}/parking/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Obtener estadísticas de un parking
  getParkingStats: async (id) => {
    const response = await axios.get(`${API_URL}/parking/${id}/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Asignar empleado a un parking
  assignEmployee: async (parkingId, employeeId) => {
    const response = await axios.post(`${API_URL}/parking/${parkingId}/assign-employee`, { employeeId }, {
      headers: getAuthHeader()
    });
    return response.data;
  },
};

export default parkingService;