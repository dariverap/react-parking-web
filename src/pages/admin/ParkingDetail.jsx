import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import parkingService from '../../services/parkingService';
import espacioService from '../../services/espacioService';
import reservaService from '../../services/reservaService';

const ParkingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [parking, setParking] = useState(null);
  const [espacios, setEspacios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar datos del parking
        const parkingData = await parkingService.getParkingById(id);
        setParking(parkingData);
        
        // Cargar espacios del parking
        const espaciosData = await espacioService.getEspaciosByParkingId(id);
        setEspacios(espaciosData);
        
        // Cargar reservas del parking
        const reservasData = await reservaService.getReservasByParkingId(id);
        setReservas(reservasData);
        
        // Cargar estadísticas del parking
        const estadisticasData = await parkingService.getParkingStats(id);
        setEstadisticas(estadisticasData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos del parking. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteParking = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este parking? Esta acción no se puede deshacer.')) {
      try {
        await parkingService.deleteParking(id);
        navigate('/admin/parkings');
      } catch (err) {
        console.error('Error al eliminar parking:', err);
        setError('Error al eliminar el parking. Por favor, intenta de nuevo.');
      }
    }
  };

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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => navigate('/admin/parkings')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  if (!parking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">No se encontró el parking solicitado.</span>
        </div>
        <button
          onClick={() => navigate('/admin/parkings')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{parking.nombre}</h1>
        <div className="flex space-x-2">
          <Link
            to={`/admin/parkings/edit/${id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Editar
          </Link>
          <button
            onClick={handleDeleteParking}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Eliminar
          </button>
          <Link
            to="/admin/parkings"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Volver
          </Link>
        </div>
      </div>

      {/* Pestañas de navegación */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${activeTab === 'info' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('info')}
          >
            Información General
          </button>
          <button
            className={`${activeTab === 'espacios' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('espacios')}
          >
            Espacios ({espacios.length})
          </button>
          <button
            className={`${activeTab === 'reservas' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('reservas')}
          >
            Reservas ({reservas.length})
          </button>
          <button
            className={`${activeTab === 'estadisticas' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('estadisticas')}
          >
            Estadísticas
          </button>
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      {activeTab === 'info' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Detalles del Parking</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Información completa del estacionamiento.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{parking.nombre}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{parking.direccion}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Capacidad</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{parking.capacidad} espacios</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Horario</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {parking.horario_apertura} - {parking.horario_cierre}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tarifas</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p>Por hora: ${parking.tarifa_hora}</p>
                  <p>Por día: ${parking.tarifa_dia}</p>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Estado</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parking.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {parking.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Empleado Asignado</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {parking.empleado ? `${parking.empleado.nombre} ${parking.empleado.apellido} (${parking.empleado.email})` : 'No asignado'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {activeTab === 'espacios' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Espacios del Parking</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Total: {espacios.length} espacios</p>
            </div>
            <Link
              to={`/admin/espacios/create/${id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Añadir Espacio
            </Link>
          </div>
          <div className="border-t border-gray-200">
            {espacios.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {espacios.map((espacio) => (
                      <tr key={espacio.id_espacio}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{espacio.id_espacio}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{espacio.numero}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{espacio.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${espacio.ocupado ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {espacio.ocupado ? 'Ocupado' : 'Disponible'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/admin/espacios/edit/${espacio.id_espacio}`} className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</Link>
                          <button className="text-red-600 hover:text-red-900">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-5 sm:px-6 text-center">
                <p className="text-gray-500">No hay espacios registrados para este parking.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'reservas' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Reservas del Parking</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Total: {reservas.length} reservas</p>
          </div>
          <div className="border-t border-gray-200">
            {reservas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservas.map((reserva) => (
                      <tr key={reserva.id_reserva}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reserva.id_reserva}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reserva.cliente ? `${reserva.cliente.nombre} ${reserva.cliente.apellido}` : 'Cliente no disponible'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(reserva.fecha_reserva).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reserva.hora_inicio} - {reserva.hora_fin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' : reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/admin/reservas/${reserva.id_reserva}`} className="text-indigo-600 hover:text-indigo-900">Ver detalles</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-4 py-5 sm:px-6 text-center">
                <p className="text-gray-500">No hay reservas registradas para este parking.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'estadisticas' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Estadísticas del Parking</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Resumen de actividad y rendimiento</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {estadisticas ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">Ocupación Actual</h4>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-blue-600">{estadisticas.ocupacion_actual}%</div>
                    <div className="ml-4 flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${estadisticas.ocupacion_actual}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{estadisticas.espacios_ocupados} de {estadisticas.total_espacios} espacios</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Ingresos</h4>
                  <div className="text-3xl font-bold text-green-600">${estadisticas.ingresos_totales}</div>
                  <p className="text-sm text-gray-500 mt-1">Últimos 30 días</p>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-purple-800 mb-2">Reservas</h4>
                  <div className="text-3xl font-bold text-purple-600">{estadisticas.total_reservas}</div>
                  <p className="text-sm text-gray-500 mt-1">Últimos 30 días</p>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-2">Tiempo Promedio</h4>
                  <div className="text-3xl font-bold text-yellow-600">{estadisticas.tiempo_promedio_estadia} hrs</div>
                  <p className="text-sm text-gray-500 mt-1">Estadía por vehículo</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No hay estadísticas disponibles para este parking.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingDetail;