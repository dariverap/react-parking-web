import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import parkingService from '../../services/parkingService';

const ParkingsPage = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        setLoading(true);
        const data = await parkingService.getAllParkings();
        setParkings(data);
      } catch (err) {
        console.error('Error al cargar parkings:', err);
        setError('Error al cargar los parkings. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  const handleDeleteParking = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este parking? Esta acción no se puede deshacer.')) {
      try {
        await parkingService.deleteParking(id);
        setParkings(parkings.filter(parking => parking.id_parking !== id));
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Parkings</h1>
        <Link 
          to="/admin/parkings/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Nuevo Parking
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {parkings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No hay parkings registrados aún.</p>
          <Link 
            to="/admin/parkings/new" 
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            Registrar un nuevo parking
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parkings.map((parking) => (
                  <tr key={parking.id_parking}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{parking.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{parking.direccion}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{parking.capacidad || 'No definido'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {parking.horario_apertura} - {parking.horario_cierre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parking.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {parking.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/admin/parkings/${parking.id_parking}`} className="text-blue-600 hover:text-blue-900 mr-3">Ver</Link>
                      <Link to={`/admin/parkings/${parking.id_parking}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</Link>
                      <button 
                        onClick={() => handleDeleteParking(parking.id_parking)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingsPage;