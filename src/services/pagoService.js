import axios from 'axios';
import { getAuthHeaders } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

const pagoService = {
  // Registrar un nuevo pago
  createPago: async (pagoData) => {
    try {
      const response = await axios.post(
        `${API_URL}/pagos`,
        pagoData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear pago:', error);
      throw error;
    }
  },

  // Obtener todos los pagos (para administradores)
  getAllPagos: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/pagos`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      throw error;
    }
  },

  // Obtener pagos por ID de parking
  getPagosByParkingId: async (parkingId) => {
    try {
      const response = await axios.get(
        `${API_URL}/pagos/parking/${parkingId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener pagos del parking ${parkingId}:`, error);
      throw error;
    }
  },

  // Obtener pagos por ID de usuario
  getPagosByUserId: async (userId) => {
    try {
      const response = await axios.get(
        `${API_URL}/pagos/usuario/${userId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener pagos del usuario ${userId}:`, error);
      throw error;
    }
  },

  // Obtener pago por ID
  getPagoById: async (pagoId) => {
    try {
      const response = await axios.get(
        `${API_URL}/pagos/${pagoId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener pago ${pagoId}:`, error);
      throw error;
    }
  },

  // Obtener estadísticas de pagos por parking
  getPagosStatsByParkingId: async (parkingId, fechaInicio, fechaFin) => {
    try {
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;

      const response = await axios.get(
        `${API_URL}/pagos/stats/parking/${parkingId}`,
        { 
          headers: getAuthHeaders(),
          params
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener estadísticas de pagos del parking ${parkingId}:`, error);
      throw error;
    }
  },

  // Obtener estadísticas generales de pagos (para administradores)
  getPagosStats: async (fechaInicio, fechaFin) => {
    try {
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;

      const response = await axios.get(
        `${API_URL}/pagos/stats`,
        { 
          headers: getAuthHeaders(),
          params
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de pagos:', error);
      throw error;
    }
  }
};

export default pagoService;