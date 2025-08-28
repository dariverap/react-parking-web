import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import parkingService from '../../services/parkingService';
import espacioService from '../../services/espacioService';
import reservaService from '../../services/reservaService';

const DashboardEmployee = () => {
  const { currentUser } = useAuth();
  const [parkingData, setParkingData] = useState(null);
  const [espacios, setEspacios] = useState([]);
  const [reservasHoy, setReservasHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        
        // Obtener el parking asignado al empleado
        // Asumimos que el empleado tiene un campo id_parking en su información
        if (currentUser && currentUser.id_parking) {
          const parkingInfo = await parkingService.getParkingById(currentUser.id_parking);
          setParkingData(parkingInfo);
          
          // Obtener espacios del parking
          const espaciosData = await espacioService.getEspaciosByParkingId(currentUser.id_parking);
          setEspacios(espaciosData);
          
          // Obtener reservas del día para este parking
          const reservasData = await reservaService.getReservasByParkingId(currentUser.id_parking);
          // Filtrar solo las reservas de hoy
          const hoy = new Date().toISOString().split('T')[0];
          const reservasDeHoy = reservasData.filter(reserva => {
            const fechaReserva = new Date(reserva.fecha_inicio).toISOString().split('T')[0];
            return fechaReserva === hoy;
          });
          setReservasHoy(reservasDeHoy);
        }
      } catch (err) {
        console.error('Error al cargar datos del empleado:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // Si el empleado no tiene un parking asignado
  if (!parkingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">No tienes un parking asignado. Contacta al administrador.</span>
        </div>
      </div>
    );
  }

  // Calcular estadísticas
  const espaciosDisponibles = espacios.filter(espacio => espacio.estado === 'disponible').length;
  const espaciosOcupados = espacios.filter(espacio => espacio.estado === 'ocupado').length;
  const porcentajeOcupacion = espacios.length > 0 ? Math.round((espaciosOcupados / espacios.length) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard de Empleado</h1>
      
      {/* Información del parking */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{parkingData.nombre}</h2>
        <p className="text-gray-600 mb-2"><span className="font-medium">Dirección:</span> {parkingData.direccion}</p>
        <p className="text-gray-600 mb-2"><span className="font-medium">Horario:</span> {parkingData.horario_apertura} - {parkingData.horario_cierre}</p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Espacios Disponibles</h2>
          <p className="text-4xl font-bold text-green-600">{espaciosDisponibles}</p>
          <p className="text-gray-500 mt-2">de {espacios.length} totales</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Espacios Ocupados</h2>
          <p className="text-4xl font-bold text-red-600">{espaciosOcupados}</p>
          <p className="text-gray-500 mt-2">{porcentajeOcupacion}% de ocupación</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Reservas de Hoy</h2>
          <p className="text-4xl font-bold text-blue-600">{reservasHoy.length}</p>
          <Link to="/employee/reservas" className="text-blue-500 hover:underline mt-4 inline-block">Ver todas</Link>
        </div>
      </div>
      
      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link 
          to="/employee/espacios" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg text-center transition duration-300"
        >
          Gestionar Espacios
        </Link>
        <Link 
          to="/employee/reservas" 
          className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg text-center transition duration-300"
        >
          Ver Reservas
        </Link>
      </div>
      
      {/* Próximas reservas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Próximas Reservas</h2>
        
        {reservasHoy.length === 0 ? (
          <p className="text-gray-500">No hay reservas para hoy.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espacio</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservasHoy.map((reserva) => (
                  <tr key={reserva.id_reserva}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reserva.nombre_cliente}</div>
                      <div className="text-sm text-gray-500">{reserva.email_cliente}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(reserva.fecha_inicio).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{reserva.id_espacio}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' : reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {reserva.estado === 'pendiente' && (
                        <button 
                          onClick={() => reservaService.confirmarLlegada(reserva.id_reserva)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Confirmar llegada
                        </button>
                      )}
                      <Link to={`/employee/reservas/${reserva.id_reserva}`} className="text-blue-600 hover:text-blue-900 ml-4">Ver detalles</Link>
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

export default DashboardEmployee;