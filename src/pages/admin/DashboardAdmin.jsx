import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import parkingService from '../../services/parkingService';
import usuarioService from '../../services/usuarioService';
import reservaService from '../../services/reservaService';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalParkings: 0,
    totalUsuarios: 0,
    totalReservas: 0,
    parkings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de parkings
        const parkingsData = await parkingService.getAllParkings();
        
        // Obtener datos de usuarios
        const usuariosData = await usuarioService.getAllUsuarios();
        
        // Obtener datos de reservas
        const reservasData = await reservaService.getAllReservas();
        
        setStats({
          totalParkings: parkingsData.length,
          totalUsuarios: usuariosData.length,
          totalReservas: reservasData.length,
          parkings: parkingsData
        });
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-[#EF4444] text-[#DC2626] px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard de Administrador</h1>
        <div className="flex items-center space-x-2">
          <span className="badge bg-[#86EFAC] text-[#10B981] px-3 py-1">Administrador</span>
        </div>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card border-l-[#2563EB] hover:border-l-[#1E40AF] hover-lift">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total de Parkings</p>
              <p className="text-4xl font-bold text-[#2563EB]">{stats.totalParkings}</p>
            </div>
            <div className="bg-[#60A5FA]/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <Link to="/admin/parkings" className="text-[#2563EB] hover:text-[#1E40AF] font-medium mt-4 inline-flex items-center hover-lift">
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="stat-card border-l-[#10B981] hover:border-l-[#22C55E] hover-lift">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total de Usuarios</p>
              <p className="text-4xl font-bold text-[#10B981]">{stats.totalUsuarios}</p>
            </div>
            <div className="bg-[#86EFAC]/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <Link to="/admin/usuarios" className="text-[#10B981] hover:text-[#22C55E] font-medium mt-4 inline-flex items-center hover-lift">
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="stat-card border-l-[#F97316] hover:border-l-[#EA580C] hover-lift">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total de Reservas</p>
              <p className="text-4xl font-bold text-[#F97316]">{stats.totalReservas}</p>
            </div>
            <div className="bg-[#FDBA74]/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <Link to="/admin/reportes" className="text-[#F97316] hover:text-[#EA580C] font-medium mt-4 inline-flex items-center hover-lift">
            Ver reportes
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Lista de parkings */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Parkings Registrados</h2>
          <Link 
            to="/admin/parkings/new" 
            className="btn inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Parking
          </Link>
        </div>
        
        {stats.parkings.length === 0 ? (
          <p className="text-gray-500">No hay parkings registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espacios</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.parkings.map((parking) => (
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${parking.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {parking.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/admin/parkings/${parking.id_parking}`} className="text-blue-600 hover:text-blue-900 mr-4">Ver</Link>
                      <Link to={`/admin/parkings/${parking.id_parking}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</Link>
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

export default DashboardAdmin;