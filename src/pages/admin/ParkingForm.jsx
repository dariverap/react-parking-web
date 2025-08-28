import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import parkingService from '../../services/parkingService';
import usuarioService from '../../services/usuarioService';

const ParkingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    capacidad: '',
    horario_apertura: '',
    horario_cierre: '',
    tarifa_hora: '',
    tarifa_dia: '',
    activo: true,
    id_admin: ''
  });
  
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar empleados disponibles
        const empleadosData = await usuarioService.getEmpleadosDisponibles();
        setEmpleados(empleadosData);
        
        // Si estamos editando, cargar datos del parking
        if (isEditing) {
          const parkingData = await parkingService.getParkingById(id);
          setFormData({
            nombre: parkingData.nombre || '',
            direccion: parkingData.direccion || '',
            capacidad: parkingData.capacidad || '',
            horario_apertura: parkingData.horario_apertura || '',
            horario_cierre: parkingData.horario_cierre || '',
            tarifa_hora: parkingData.tarifa_hora || '',
            tarifa_dia: parkingData.tarifa_dia || '',
            activo: parkingData.activo !== undefined ? parkingData.activo : true,
            id_admin: parkingData.id_admin || ''
          });
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Convertir valores numéricos
      const dataToSend = {
        ...formData,
        capacidad: formData.capacidad ? parseInt(formData.capacidad, 10) : null,
        tarifa_hora: formData.tarifa_hora ? parseFloat(formData.tarifa_hora) : null,
        tarifa_dia: formData.tarifa_dia ? parseFloat(formData.tarifa_dia) : null
      };
      
      if (isEditing) {
        await parkingService.updateParking(id, dataToSend);
      } else {
        await parkingService.createParking(dataToSend);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/parkings');
      }, 2000);
    } catch (err) {
      console.error('Error al guardar parking:', err);
      setError(err.response?.data?.message || 'Error al guardar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.nombre) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? 'Editar Parking' : 'Nuevo Parking'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">Parking guardado correctamente. Redirigiendo...</span>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Parking</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700 mb-1">Capacidad (espacios)</label>
              <input
                type="number"
                id="capacidad"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="horario_apertura" className="block text-sm font-medium text-gray-700 mb-1">Horario de Apertura</label>
              <input
                type="time"
                id="horario_apertura"
                name="horario_apertura"
                value={formData.horario_apertura}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="horario_cierre" className="block text-sm font-medium text-gray-700 mb-1">Horario de Cierre</label>
              <input
                type="time"
                id="horario_cierre"
                name="horario_cierre"
                value={formData.horario_cierre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="tarifa_hora" className="block text-sm font-medium text-gray-700 mb-1">Tarifa por Hora</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="tarifa_hora"
                  name="tarifa_hora"
                  value={formData.tarifa_hora}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="tarifa_dia" className="block text-sm font-medium text-gray-700 mb-1">Tarifa por Día</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="tarifa_dia"
                  name="tarifa_dia"
                  value={formData.tarifa_dia}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="id_admin" className="block text-sm font-medium text-gray-700 mb-1">Empleado Asignado</label>
            <select
              id="id_admin"
              name="id_admin"
              value={formData.id_admin}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar empleado</option>
              {empleados.map(empleado => (
                <option key={empleado.id_usuario} value={empleado.id_usuario}>
                  {empleado.nombre} {empleado.apellido} - {empleado.email}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
              Parking activo
            </label>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/parkings')}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParkingForm;