import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const reservaService = {
  // Obtener todas las reservas
  getAllReservas: async () => {
    const response = await axios.get(`${API_URL}/reserva`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Obtener reservas por ID de parking
  getReservasByParkingId: async (parkingId) => {
    const response = await axios.get(`${API_URL}/reserva/parking/${parkingId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Obtener una reserva por ID
  getReservaById: async (id) => {
    const response = await axios.get(`${API_URL}/reserva/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Confirmar llegada de cliente
  confirmarLlegada: async (id) => {
    const response = await axios.patch(`${API_URL}/reserva/${id}/confirmar-llegada`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Obtener historial de reservas
  getHistorialReservas: async () => {
    const response = await axios.get(`${API_URL}/reserva/historial`, {
      headers: getAuthHeader()
    });
    return response.data;
  },
};

export default reservaService;