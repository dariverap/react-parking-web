import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import reservaService from '../../services/reservaService';
import parkingService from '../../services/parkingService';

const PagosPage = () => {
  const { currentUser } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [parkingInfo, setParkingInfo] = useState(null);
  const [tarifas, setTarifas] = useState([]);
  const [pagoActual, setPagoActual] = useState(null);
  const [metodoPago, setMetodoPago] = useState('efectivo');
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
          
          // Obtener reservas confirmadas del parking (pendientes de pago)
          const reservasData = await reservaService.getReservasByParkingId(currentUser.id_parking);
          const reservasPendientesPago = reservasData.filter(r => 
            r.estado === 'confirmada' && !r.pagado
          );
          setReservas(reservasPendientesPago);
          
          // Obtener tarifas del parking
          // Aquí deberíamos tener un endpoint para obtener las tarifas
          // Por ahora, usaremos datos de ejemplo
          const tarifasEjemplo = [
            {
              id_tarifa: 1,
              id_parking: currentUser.id_parking,
              tipo_vehiculo: 'automovil',
              tarifa_hora: 5.00,
              tarifa_dia: 40.00,
              descripcion: 'Tarifa estándar para automóviles'
            },
            {
              id_tarifa: 2,
              id_parking: currentUser.id_parking,
              tipo_vehiculo: 'motocicleta',
              tarifa_hora: 2.50,
              tarifa_dia: 20.00,
              descripcion: 'Tarifa para motocicletas'
            },
            {
              id_tarifa: 3,
              id_parking: currentUser.id_parking,
              tipo_vehiculo: 'camioneta',
              tarifa_hora: 7.50,
              tarifa_dia: 60.00,
              descripcion: 'Tarifa para camionetas y vehículos grandes'
            }
          ];
          
          setTarifas(tarifasEjemplo);
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

  const calcularMontoPago = (reserva) => {
    // Obtener la tarifa correspondiente al tipo de vehículo
    const tarifa = tarifas.find(t => t.tipo_vehiculo === reserva.tipo_vehiculo) || tarifas[0];
    
    // Calcular la duración en horas
    const fechaInicio = new Date(reserva.fecha_inicio);
    const fechaFin = new Date(reserva.fecha_fin);
    const duracionHoras = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60));
    
    // Calcular el monto
    let monto = 0;
    if (duracionHoras <= 24) {
      // Si es menos de un día, cobrar por hora
      monto = duracionHoras * tarifa.tarifa_hora;
    } else {
      // Si es más de un día, calcular días y horas restantes
      const dias = Math.floor(duracionHoras / 24);
      const horasRestantes = duracionHoras % 24;
      monto = (dias * tarifa.tarifa_dia) + (horasRestantes * tarifa.tarifa_hora);
    }
    
    return monto.toFixed(2);
  };

  const handleSeleccionarReserva = (reserva) => {
    const monto = calcularMontoPago(reserva);
    setPagoActual({
      ...reserva,
      monto
    });
  };

  const handleMetodoPagoChange = (e) => {
    setMetodoPago(e.target.value);
  };

  const handleRegistrarPago = async () => {
    if (!pagoActual) return;
    
    try {
      // Registrar el pago
      const dataPago = {
        id_reserva: pagoActual.id_reserva,
        monto: parseFloat(pagoActual.monto),
        metodo_pago: metodoPago,
        fecha_pago: new Date().toISOString()
      };
      
      // Aquí deberíamos tener un endpoint para registrar el pago
      // Por ahora, simularemos el registro
      console.log('Registrando pago:', dataPago);
      
      // Actualizar el estado de la reserva a 'completada' y marcarla como pagada
      await reservaService.updateReservaEstado(pagoActual.id_reserva, 'completada');
      
      // Actualizar la lista de reservas (eliminar la reserva pagada)
      setReservas(prev => prev.filter(r => r.id_reserva !== pagoActual.id_reserva));
      
      setSuccessMessage(`Pago de $${pagoActual.monto} registrado correctamente.`);
      setPagoActual(null);
      setMetodoPago('efectivo');
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error al registrar pago:', err);
      setError('Error al registrar el pago. Por favor, intenta de nuevo.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCancelarPago = () => {
    setPagoActual(null);
    setMetodoPago('efectivo');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestión de Pagos</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error && !parkingInfo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestión de Pagos</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Pagos</h1>
      
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
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lista de Reservas Pendientes de Pago */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Reservas Pendientes de Pago</h2>
          
          {reservas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay reservas pendientes de pago.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-6 text-left">Usuario</th>
                    <th className="py-3 px-6 text-left">Duración</th>
                    <th className="py-3 px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {reservas.map(reserva => {
                    const fechaInicio = new Date(reserva.fecha_inicio);
                    const fechaFin = new Date(reserva.fecha_fin);
                    const duracionHoras = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60));
                    
                    return (
                      <tr key={reserva.id_reserva} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6">{reserva.id_reserva}</td>
                        <td className="py-3 px-6">{`${reserva.nombre_usuario || ''} ${reserva.apellido_usuario || ''}`}</td>
                        <td className="py-3 px-6">
                          {duracionHoras} {duracionHoras === 1 ? 'hora' : 'horas'}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={() => handleSeleccionarReserva(reserva)}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-xs transition duration-300"
                          >
                            Registrar Pago
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Formulario de Pago */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Registrar Pago</h2>
          
          {!pagoActual ? (
            <p className="text-gray-500 text-center py-8">Selecciona una reserva para registrar su pago.</p>
          ) : (
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-2">Detalles de la Reserva</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">ID Reserva:</p>
                    <p className="font-semibold">{pagoActual.id_reserva}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Usuario:</p>
                    <p className="font-semibold">{`${pagoActual.nombre_usuario || ''} ${pagoActual.apellido_usuario || ''}`}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fecha Inicio:</p>
                    <p className="font-semibold">{new Date(pagoActual.fecha_inicio).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fecha Fin:</p>
                    <p className="font-semibold">{new Date(pagoActual.fecha_fin).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tipo Vehículo:</p>
                    <p className="font-semibold capitalize">{pagoActual.tipo_vehiculo || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Monto a Pagar:</p>
                    <p className="font-semibold text-xl text-green-600">${pagoActual.monto}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                <select
                  value={metodoPago}
                  onChange={handleMetodoPagoChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelarPago}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRegistrarPago}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300"
                >
                  Confirmar Pago
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Tarifas Actuales */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Tarifas Actuales</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Tipo de Vehículo</th>
                <th className="py-3 px-6 text-right">Tarifa por Hora</th>
                <th className="py-3 px-6 text-right">Tarifa por Día</th>
                <th className="py-3 px-6 text-left">Descripción</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {tarifas.map(tarifa => (
                <tr key={tarifa.id_tarifa} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 capitalize">{tarifa.tipo_vehiculo}</td>
                  <td className="py-3 px-6 text-right">${tarifa.tarifa_hora.toFixed(2)}</td>
                  <td className="py-3 px-6 text-right">${tarifa.tarifa_dia.toFixed(2)}</td>
                  <td className="py-3 px-6">{tarifa.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PagosPage;