import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import espacioService from '../../services/espacioService';
import parkingService from '../../services/parkingService';

const EspaciosPage = () => {
  const { currentUser } = useAuth();
  const [espacios, setEspacios] = useState([]);
  const [parkingInfo, setParkingInfo] = useState(null);
  const [nuevoEspacio, setNuevoEspacio] = useState({
    numero: '',
    tipo: 'automovil',
    estado: 'libre',
    descripcion: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener información del parking asignado al empleado
        // Asumimos que el empleado tiene un id_parking en su objeto de usuario
        if (currentUser && currentUser.id_parking) {
          const parkingData = await parkingService.getParkingById(currentUser.id_parking);
          setParkingInfo(parkingData);
          
          // Obtener espacios del parking
          const espaciosData = await espacioService.getEspaciosByParkingId(currentUser.id_parking);
          setEspacios(espaciosData);
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

  const handleNuevoEspacioChange = (e) => {
    const { name, value } = e.target;
    setNuevoEspacio(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitNuevoEspacio = async (e) => {
    e.preventDefault();
    
    if (!nuevoEspacio.numero || !nuevoEspacio.tipo) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    try {
      // Crear nuevo espacio
      const nuevoEspacioData = {
        ...nuevoEspacio,
        id_parking: currentUser.id_parking
      };
      
      const espacioCreado = await espacioService.createEspacio(nuevoEspacioData);
      
      // Actualizar la lista de espacios
      setEspacios(prev => [...prev, espacioCreado]);
      
      // Limpiar el formulario
      setNuevoEspacio({
        numero: '',
        tipo: 'automovil',
        estado: 'libre',
        descripcion: ''
      });
      
      // Cerrar el modal
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error al crear espacio:', err);
      setError('Error al crear el espacio. Por favor, intenta de nuevo.');
    }
  };

  const handleCambiarEstado = async (idEspacio, nuevoEstado) => {
    try {
      // Actualizar el estado del espacio
      await espacioService.updateEspacioEstado(idEspacio, nuevoEstado);
      
      // Actualizar la lista de espacios
      setEspacios(prev => 
        prev.map(espacio => 
          espacio.id_espacio === idEspacio ? { ...espacio, estado: nuevoEstado } : espacio
        )
      );
    } catch (err) {
      console.error('Error al cambiar estado del espacio:', err);
      setError('Error al cambiar el estado del espacio. Por favor, intenta de nuevo.');
    }
  };

  const handleEliminarEspacio = async (idEspacio) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este espacio?')) {
      return;
    }
    
    try {
      // Eliminar el espacio
      await espacioService.deleteEspacio(idEspacio);
      
      // Actualizar la lista de espacios
      setEspacios(prev => prev.filter(espacio => espacio.id_espacio !== idEspacio));
    } catch (err) {
      console.error('Error al eliminar espacio:', err);
      setError('Error al eliminar el espacio. Por favor, intenta de nuevo.');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'libre':
        return 'bg-green-100 text-green-800';
      case 'ocupado':
        return 'bg-red-100 text-red-800';
      case 'reservado':
        return 'bg-yellow-100 text-yellow-800';
      case 'mantenimiento':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTipoVehiculoIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'automovil':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8m-8 5h8m-4 5v-5m-4 5v-5m8-9H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V5a2 2 0 00-2-2z" />
          </svg>
        );
      case 'motocicleta':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'camioneta':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestión de Espacios</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error && !parkingInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestión de Espacios</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Espacios</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
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
            <div>
              <p className="text-gray-600">Capacidad Total:</p>
              <p className="font-semibold">{espacios.length} espacios</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Resumen de Espacios */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Resumen de Espacios</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Espacio
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Libres</p>
            <p className="text-2xl font-bold text-green-600">
              {espacios.filter(e => e.estado.toLowerCase() === 'libre').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Ocupados</p>
            <p className="text-2xl font-bold text-red-600">
              {espacios.filter(e => e.estado.toLowerCase() === 'ocupado').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Reservados</p>
            <p className="text-2xl font-bold text-yellow-600">
              {espacios.filter(e => e.estado.toLowerCase() === 'reservado').length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Mantenimiento</p>
            <p className="text-2xl font-bold text-gray-600">
              {espacios.filter(e => e.estado.toLowerCase() === 'mantenimiento').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Lista de Espacios */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Espacios</h2>
        
        {espacios.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay espacios registrados. Agrega un nuevo espacio para comenzar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Número</th>
                  <th className="py-3 px-6 text-left">Tipo</th>
                  <th className="py-3 px-6 text-left">Estado</th>
                  <th className="py-3 px-6 text-left">Descripción</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {espacios.map(espacio => (
                  <tr key={espacio.id_espacio} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6">{espacio.numero}</td>
                    <td className="py-3 px-6 flex items-center">
                      <span className="mr-2">{getTipoVehiculoIcon(espacio.tipo)}</span>
                      <span className="capitalize">{espacio.tipo}</span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(espacio.estado)}`}>
                        {espacio.estado}
                      </span>
                    </td>
                    <td className="py-3 px-6">{espacio.descripcion || '-'}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <div className="mr-4">
                          <select
                            value={espacio.estado}
                            onChange={(e) => handleCambiarEstado(espacio.id_espacio, e.target.value)}
                            className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="libre">Libre</option>
                            <option value="ocupado">Ocupado</option>
                            <option value="reservado">Reservado</option>
                            <option value="mantenimiento">Mantenimiento</option>
                          </select>
                        </div>
                        <button
                          onClick={() => handleEliminarEspacio(espacio.id_espacio)}
                          className="transform hover:text-red-500 hover:scale-110 transition duration-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal para Nuevo Espacio */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Nuevo Espacio</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitNuevoEspacio}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Espacio</label>
                <input
                  type="text"
                  name="numero"
                  value={nuevoEspacio.numero}
                  onChange={handleNuevoEspacioChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
                <select
                  name="tipo"
                  value={nuevoEspacio.tipo}
                  onChange={handleNuevoEspacioChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="automovil">Automóvil</option>
                  <option value="motocicleta">Motocicleta</option>
                  <option value="camioneta">Camioneta</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={nuevoEspacio.estado}
                  onChange={handleNuevoEspacioChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="libre">Libre</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="reservado">Reservado</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={nuevoEspacio.descripcion}
                  onChange={handleNuevoEspacioChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EspaciosPage;