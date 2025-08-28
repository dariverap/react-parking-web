import axios from 'axios';
import { getAuthHeaders } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

const estadisticaService = {
  // Obtener estadísticas generales (para administradores)
  getEstadisticasGenerales: async (fechaInicio, fechaFin) => {
    try {
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;

      const response = await axios.get(
        `${API_URL}/estadisticas/general`,
        { 
          headers: getAuthHeaders(),
          params
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas generales:', error);
      throw error;
    }
  },

  // Obtener estadísticas de un parking específico
  getEstadisticasByParkingId: async (parkingId, fechaInicio, fechaFin) => {
    try {
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;

      const response = await axios.get(
        `${API_URL}/estadisticas/parking/${parkingId}`,
        { 
          headers: getAuthHeaders(),
          params
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener estadísticas del parking ${parkingId}:`, error);
      throw error;
    }
  },

  // Obtener estadísticas de ocupación
  getEstadisticasOcupacion: async (parkingId, fechaInicio, fechaFin) => {
    try {
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;

      const url = parkingId 
        ? `${API_URL}/estadisticas/ocupacion/parking/${parkingId}`
        : `${API_URL}/estadisticas/ocupacion`;

      const response = await axios.get(
        url,
        { 
          headers: getAuthHeaders(),
          params
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de ocupación:', error);
      throw error;
    }
  },

  // Obtener estadísticas de reservas
  getEstadisticasReservas: async (parkingId, fechaInicio, fechaFin) => {
    try {
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;

      const url = parkingId 
        ? `${API_URL}/estadisticas/reservas/parking/${parkingId}`
        : `${API_URL}/estadisticas/reservas`;

      const response = await axios.get(
        url,
        { 
          headers: getAuthHeaders(),
          params
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de reservas:', error);
      throw error;
    }
  },

  // Obtener estadísticas de ingresos
  getEstadisticasIngresos: async (parkingId, fechaInicio, fechaFin) => {
    try {
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;

      const url = parkingId 
        ? `${API_URL}/estadisticas/ingresos/parking/${parkingId}`
        : `${API_URL}/estadisticas/ingresos`;

      const response = await axios.get(
        url,
        { 
          headers: getAuthHeaders(),
          params
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de ingresos:', error);
      throw error;
    }
  },

  // Obtener reporte personalizado
  getReportePersonalizado: async (filtros) => {
    try {
      const response = await axios.post(
        `${API_URL}/estadisticas/reporte`,
        filtros,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte personalizado:', error);
      throw error;
    }
  }
};

export default estadisticaService;