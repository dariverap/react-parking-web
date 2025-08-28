import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import parkingService from '../../services/parkingService';
import reservaService from '../../services/reservaService';

const ReportesPage = () => {
  const { currentUser } = useAuth();
  const [reporteData, setReporteData] = useState({
    reservas: [],
    ingresos: [],
    ocupacion: []
  });
  const [filtro, setFiltro] = useState({
    tipoReporte: 'reservas',
    periodo: 'mensual',
    parkingId: 'todos',
    fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0]
  });
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const data = await parkingService.getAllParkings();
        setParkings(data);
      } catch (err) {
        console.error('Error al cargar parkings:', err);
        setError('Error al cargar los parkings. Por favor, intenta de nuevo.');
      }
    };

    fetchParkings();
  }, []);

  useEffect(() => {
    const fetchReporteData = async () => {
      try {
        setLoading(true);
        
        // Dependiendo del tipo de reporte, cargamos los datos correspondientes
        if (filtro.tipoReporte === 'reservas') {
          const reservasData = await reservaService.getHistorialReservas();
          
          // Filtrar por fecha y parking si es necesario
          const reservasFiltradas = reservasData.filter(reserva => {
            const fechaReserva = new Date(reserva.fecha_inicio);
            const fechaInicio = new Date(filtro.fechaInicio);
            const fechaFin = new Date(filtro.fechaFin);
            
            const cumpleFecha = fechaReserva >= fechaInicio && fechaReserva <= fechaFin;
            const cumpleParking = filtro.parkingId === 'todos' || reserva.id_parking === parseInt(filtro.parkingId);
            
            return cumpleFecha && cumpleParking;
          });
          
          setReporteData(prev => ({ ...prev, reservas: reservasFiltradas }));
        } else if (filtro.tipoReporte === 'ingresos') {
          // Aquí iría la lógica para obtener datos de ingresos
          // Por ahora usamos datos de ejemplo
          const ingresosData = generarDatosIngresos();
          setReporteData(prev => ({ ...prev, ingresos: ingresosData }));
        } else if (filtro.tipoReporte === 'ocupacion') {
          // Aquí iría la lógica para obtener datos de ocupación
          // Por ahora usamos datos de ejemplo
          const ocupacionData = generarDatosOcupacion();
          setReporteData(prev => ({ ...prev, ocupacion: ocupacionData }));
        }
      } catch (err) {
        console.error('Error al cargar datos del reporte:', err);
        setError('Error al cargar los datos del reporte. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchReporteData();
  }, [filtro]);

  // Función para generar datos de ejemplo para ingresos
  const generarDatosIngresos = () => {
    const ingresos = [];
    const fechaInicio = new Date(filtro.fechaInicio);
    const fechaFin = new Date(filtro.fechaFin);
    
    // Generar datos para cada día en el rango
    for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
      ingresos.push({
        fecha: new Date(d).toISOString().split('T')[0],
        monto: Math.floor(Math.random() * 1000) + 500,
        parking_id: filtro.parkingId === 'todos' ? null : parseInt(filtro.parkingId)
      });
    }
    
    return ingresos;
  };

  // Función para generar datos de ejemplo para ocupación
  const generarDatosOcupacion = () => {
    const ocupacion = [];
    const fechaInicio = new Date(filtro.fechaInicio);
    const fechaFin = new Date(filtro.fechaFin);
    
    // Generar datos para cada día en el rango
    for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
      ocupacion.push({
        fecha: new Date(d).toISOString().split('T')[0],
        porcentaje: Math.floor(Math.random() * 100),
        parking_id: filtro.parkingId === 'todos' ? null : parseInt(filtro.parkingId)
      });
    }
    
    return ocupacion;
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro(prev => ({ ...prev, [name]: value }));
  };

  const renderReporteContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      );
    }

    switch (filtro.tipoReporte) {
      case 'reservas':
        return renderReporteReservas();
      case 'ingresos':
        return renderReporteIngresos();
      case 'ocupacion':
        return renderReporteOcupacion();
      default:
        return null;
    }
  };

  const renderReporteReservas = () => {
    const { reservas } = reporteData;
    
    if (reservas.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No hay reservas para el período seleccionado.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Parking</th>
              <th className="py-3 px-6 text-left">Usuario</th>
              <th className="py-3 px-6 text-left">Fecha Inicio</th>
              <th className="py-3 px-6 text-left">Fecha Fin</th>
              <th className="py-3 px-6 text-left">Estado</th>
              <th className="py-3 px-6 text-left">Monto</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {reservas.map(reserva => (
              <tr key={reserva.id_reserva} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6">{reserva.id_reserva}</td>
                <td className="py-3 px-6">{reserva.nombre_parking || 'N/A'}</td>
                <td className="py-3 px-6">{`${reserva.nombre_usuario || ''} ${reserva.apellido_usuario || ''}`}</td>
                <td className="py-3 px-6">{new Date(reserva.fecha_inicio).toLocaleString()}</td>
                <td className="py-3 px-6">{new Date(reserva.fecha_fin).toLocaleString()}</td>
                <td className="py-3 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    reserva.estado === 'completada' ? 'bg-green-100 text-green-800' :
                    reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    reserva.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {reserva.estado}
                  </span>
                </td>
                <td className="py-3 px-6">${reserva.monto_total || '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderReporteIngresos = () => {
    const { ingresos } = reporteData;
    
    if (ingresos.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No hay datos de ingresos para el período seleccionado.
        </div>
      );
    }

    // Calcular total de ingresos
    const totalIngresos = ingresos.reduce((sum, item) => sum + item.monto, 0);

    return (
      <div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Resumen de Ingresos</h3>
          <p className="text-3xl font-bold text-green-600">${totalIngresos.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">
            Período: {filtro.fechaInicio} al {filtro.fechaFin}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Fecha</th>
                <th className="py-3 px-6 text-left">Parking</th>
                <th className="py-3 px-6 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {ingresos.map((ingreso, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{ingreso.fecha}</td>
                  <td className="py-3 px-6">
                    {ingreso.parking_id ? 
                      parkings.find(p => p.id_parking === ingreso.parking_id)?.nombre || 'N/A' : 
                      'Todos los parkings'}
                  </td>
                  <td className="py-3 px-6 text-right">${ingreso.monto.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td className="py-3 px-6 font-semibold" colSpan="2">Total</td>
                <td className="py-3 px-6 text-right font-semibold">${totalIngresos.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderReporteOcupacion = () => {
    const { ocupacion } = reporteData;
    
    if (ocupacion.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No hay datos de ocupación para el período seleccionado.
        </div>
      );
    }

    // Calcular ocupación promedio
    const ocupacionPromedio = Math.round(
      ocupacion.reduce((sum, item) => sum + item.porcentaje, 0) / ocupacion.length
    );

    return (
      <div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Ocupación Promedio</h3>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full" 
                style={{ width: `${ocupacionPromedio}%` }}
              ></div>
            </div>
            <span className="ml-4 text-xl font-semibold">{ocupacionPromedio}%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Período: {filtro.fechaInicio} al {filtro.fechaFin}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Fecha</th>
                <th className="py-3 px-6 text-left">Parking</th>
                <th className="py-3 px-6 text-left">Ocupación</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {ocupacion.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{item.fecha}</td>
                  <td className="py-3 px-6">
                    {item.parking_id ? 
                      parkings.find(p => p.id_parking === item.parking_id)?.nombre || 'N/A' : 
                      'Todos los parkings'}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            item.porcentaje > 80 ? 'bg-red-500' :
                            item.porcentaje > 60 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} 
                          style={{ width: `${item.porcentaje}%` }}
                        ></div>
                      </div>
                      <span>{item.porcentaje}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Reportes y Estadísticas</h1>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
            <select
              name="tipoReporte"
              value={filtro.tipoReporte}
              onChange={handleFiltroChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="reservas">Reservas</option>
              <option value="ingresos">Ingresos</option>
              <option value="ocupacion">Ocupación</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parking</label>
            <select
              name="parkingId"
              value={filtro.parkingId}
              onChange={handleFiltroChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos los parkings</option>
              {parkings.map(parking => (
                <option key={parking.id_parking} value={parking.id_parking}>
                  {parking.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={filtro.fechaInicio}
              onChange={handleFiltroChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={filtro.fechaFin}
              onChange={handleFiltroChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFiltro(prev => ({ ...prev }))}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
      
      {/* Contenido del reporte */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {filtro.tipoReporte === 'reservas' ? 'Reporte de Reservas' :
           filtro.tipoReporte === 'ingresos' ? 'Reporte de Ingresos' :
           'Reporte de Ocupación'}
        </h2>
        
        {renderReporteContent()}
      </div>
    </div>
  );
};

export default ReportesPage;