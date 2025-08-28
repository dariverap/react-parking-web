import axios from 'axios';
import { getAuthHeaders } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

const tarifaService = {
  // Obtener todas las tarifas
  getAllTarifas: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/tarifas`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener tarifas:', error);
      throw error;
    }
  },

  // Obtener tarifas por ID de parking
  getTarifasByParkingId: async (parkingId) => {
    try {
      const response = await axios.get(
        `${API_URL}/tarifas/parking/${parkingId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tarifas del parking ${parkingId}:`, error);
      throw error;
    }
  },

  // Obtener tarifa por ID
  getTarifaById: async (tarifaId) => {
    try {
      const response = await axios.get(
        `${API_URL}/tarifas/${tarifaId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tarifa ${tarifaId}:`, error);
      throw error;
    }
  },

  // Crear una nueva tarifa
  createTarifa: async (tarifaData) => {
    try {
      const response = await axios.post(
        `${API_URL}/tarifas`,
        tarifaData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear tarifa:', error);
      throw error;
    }
  },

  // Actualizar una tarifa existente
  updateTarifa: async (tarifaId, tarifaData) => {
    try {
      const response = await axios.put(
        `${API_URL}/tarifas/${tarifaId}`,
        tarifaData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar tarifa ${tarifaId}:`, error);
      throw error;
    }
  },

  // Eliminar una tarifa
  deleteTarifa: async (tarifaId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/tarifas/${tarifaId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar tarifa ${tarifaId}:`, error);
      throw error;
    }
  },

  // Obtener tarifas por tipo de vehículo
  getTarifasByTipoVehiculo: async (tipoVehiculo) => {
    try {
      const response = await axios.get(
        `${API_URL}/tarifas/tipo/${tipoVehiculo}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tarifas para tipo de vehículo ${tipoVehiculo}:`, error);
      throw error;
    }
  }
};

export default tarifaService;