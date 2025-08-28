import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import reservaService from '../../services/reservaService';
import parkingService from '../../services/parkingService';

const ReservasPage = () => {
  const { currentUser } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [parkingInfo, setParkingInfo] = useState(null);
  const [filtro, setFiltro] = useState({
    estado: 'todas',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener información del parking asignado al empleado
        if (currentUser && currentUser.id_parking) {
          const parkingData = await parkingService.getParkingById(currentUser.id_parking);
          setParkingInfo(parkingData);
          
          // Obtener reservas del parking
          const reservasData = await reservaService.getReservasByParkingId(currentUser.id_parking);
          setReservas(reservasData);
        } else {
          // Si no hay parking asignado, mostramos un mensaje de error
          setError('No tienes un parking asignado. Contacta al administrador.');
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmarLlegada = async (idReserva) => {
    try {
      // Actualizar el estado de la reserva a 'confirmada'
      await reservaService.updateReservaEstado(idReserva, 'confirmada');
      
      // Actualizar la lista de reservas
      setReservas(prev => 
        prev.map(reserva => 
          reserva.id_reserva === idReserva ? { ...reserva, estado: 'confirmada' } : reserva
        )
      );
      
      setSuccessMessage('Llegada confirmada correctamente.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error al confirmar llegada:', err);
      setError('Error al confirmar la llegada. Por favor, intenta de nuevo.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCompletarReserva = async (idReserva) => {
    try {
      // Actualizar el estado de la reserva a 'completada'
      await reservaService.updateReservaEstado(idReserva, 'completada');
      
      // Actualizar la lista de reservas
      setReservas(prev => 
        prev.map(reserva => 
          reserva.id_reserva === idReserva ? { ...reserva, estado: 'completada' } : reserva
        )
      );
      
      setSuccessMessage('Reserva completada correctamente.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error al completar reserva:', err);
      setError('Error al completar la reserva. Por favor, intenta de nuevo.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCancelarReserva = async (idReserva) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }
    
    try {
      // Actualizar el estado de la reserva a 'cancelada'
      await reservaService.updateReservaEstado(idReserva, 'cancelada');
      
      // Actualizar la lista de reservas
      setReservas(prev => 
        prev.map(reserva => 
          reserva.id_reserva === idReserva ? { ...reserva, estado: 'cancelada' } : reserva
        )
      );
      
      setSuccessMessage('Reserva cancelada correctamente.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error al cancelar reserva:', err);
      setError('Error al cancelar la reserva. Por favor, intenta de nuevo.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const filtrarReservas = () => {
    return reservas.filter(reserva => {
      // Filtrar por estado
      const cumpleEstado = filtro.estado === 'todas' || reserva.estado === filtro.estado;
      
      // Filtrar por fecha
      const fechaReserva = new Date(reserva.fecha_inicio).toISOString().split('T')[0];
      const cumpleFecha = filtro.fecha === '' || fechaReserva === filtro.fecha;
      
      return cumpleEstado && cumpleFecha;
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestión de Reservas</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error && !parkingInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestión de Reservas</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  const reservasFiltradas = filtrarReservas();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Reservas</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      
      {/* Información del Parking */}
      {parkingInfo && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Información del Parking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Nombre:</p>
              <p className="font-semibold">{parkingInfo.nombre}</p>
            </div>
            <div>
              <p className="text-gray-600">Dirección:</p>
              <p className="font-semibold">{parkingInfo.direccion}</p>
            </div>
            <div>
              <p className="text-gray-600">Horario:</p>
              <p className="font-semibold">{parkingInfo.horario_apertura} - {parkingInfo.horario_cierre}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="estado"
              value={filtro.estado}
              onChange={handleFiltroChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={filtro.fecha}
              onChange={handleFiltroChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFiltro({ estado: 'todas', fecha: new Date().toISOString().split('T')[0] })}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition duration-300"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>
      
      {/* Resumen de Reservas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Resumen de Reservas</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {reservas.filter(r => r.estado === 'pendiente').length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Confirmadas</p>
            <p className="text-2xl font-bold text-blue-600">
              {reservas.filter(r => r.estado === 'confirmada').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Completadas</p>
            <p className="text-2xl font-bold text-green-600">
              {reservas.filter(r => r.estado === 'completada').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Canceladas</p>
            <p className="text-2xl font-bold text-red-600">
              {reservas.filter(r => r.estado === 'cancelada').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Lista de Reservas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Reservas</h2>
        
        {reservasFiltradas.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay reservas que coincidan con los filtros seleccionados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Usuario</th>
                  <th className="py-3 px-6 text-left">Fecha Inicio</th>
                  <th className="py-3 px-6 text-left">Fecha Fin</th>
                  <th className="py-3 px-6 text-left">Estado</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {reservasFiltradas.map(reserva => (
                  <tr key={reserva.id_reserva} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6">{reserva.id_reserva}</td>
                    <td className="py-3 px-6">{`${reserva.nombre_usuario || ''} ${reserva.apellido_usuario || ''}`}</td>
                    <td className="py-3 px-6">{new Date(reserva.fecha_inicio).toLocaleString()}</td>
                    <td className="py-3 px-6">{new Date(reserva.fecha_fin).toLocaleString()}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(reserva.estado)}`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center space-x-2">
                        {reserva.estado === 'pendiente' && (
                          <button
                            onClick={() => handleConfirmarLlegada(reserva.id_reserva)}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-md text-xs transition duration-300"
                            title="Confirmar Llegada"
                          >
                            Confirmar
                          </button>
                        )}
                        
                        {reserva.estado === 'confirmada' && (
                          <button
                            onClick={() => handleCompletarReserva(reserva.id_reserva)}
                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-md text-xs transition duration-300"
                            title="Completar Reserva"
                          >
                            Completar
                          </button>
                        )}
                        
                        {(reserva.estado === 'pendiente' || reserva.estado === 'confirmada') && (
                          <button
                            onClick={() => handleCancelarReserva(reserva.id_reserva)}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md text-xs transition duration-300"
                            title="Cancelar Reserva"
                          >
                            Cancelar
                          </button>
                        )}
                        
                        {(reserva.estado === 'completada' || reserva.estado === 'cancelada') && (
                          <span className="text-gray-400 text-xs">No hay acciones disponibles</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservasPage;