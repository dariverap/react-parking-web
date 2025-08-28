import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import parkingService from '../../services/parkingService';

const TarifasPage = () => {
  const { currentUser } = useAuth();
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const [tarifas, setTarifas] = useState([]);
  const [nuevaTarifa, setNuevaTarifa] = useState({
    tipo_vehiculo: 'automovil',
    tarifa_hora: '',
    tarifa_dia: '',
    descripcion: ''
  });
  const [editandoTarifa, setEditandoTarifa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const data = await parkingService.getAllParkings();
        setParkings(data);
        if (data.length > 0) {
          setSelectedParking(data[0].id_parking);
        }
      } catch (err) {
        console.error('Error al cargar parkings:', err);
        setError('Error al cargar los parkings. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  useEffect(() => {
    if (selectedParking) {
      fetchTarifas(selectedParking);
    }
  }, [selectedParking]);

  const fetchTarifas = async (parkingId) => {
    try {
      setLoading(true);
      // Aquí deberíamos tener un endpoint para obtener las tarifas de un parking específico
      // Por ahora, usaremos datos de ejemplo
      const tarifasEjemplo = [
        {
          id_tarifa: 1,
          id_parking: parkingId,
          tipo_vehiculo: 'automovil',
          tarifa_hora: 5.00,
          tarifa_dia: 40.00,
          descripcion: 'Tarifa estándar para automóviles'
        },
        {
          id_tarifa: 2,
          id_parking: parkingId,
          tipo_vehiculo: 'motocicleta',
          tarifa_hora: 2.50,
          tarifa_dia: 20.00,
          descripcion: 'Tarifa para motocicletas'
        },
        {
          id_tarifa: 3,
          id_parking: parkingId,
          tipo_vehiculo: 'camioneta',
          tarifa_hora: 7.50,
          tarifa_dia: 60.00,
          descripcion: 'Tarifa para camionetas y vehículos grandes'
        }
      ];
      
      setTarifas(tarifasEjemplo);
    } catch (err) {
      console.error('Error al cargar tarifas:', err);
      setError('Error al cargar las tarifas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleParkingChange = (e) => {
    setSelectedParking(parseInt(e.target.value));
  };

  const handleNuevaTarifaChange = (e) => {
    const { name, value } = e.target;
    setNuevaTarifa(prev => ({
      ...prev,
      [name]: name.includes('tarifa') ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmitNuevaTarifa = async (e) => {
    e.preventDefault();
    
    if (!nuevaTarifa.tipo_vehiculo || !nuevaTarifa.tarifa_hora || !nuevaTarifa.tarifa_dia) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    try {
      // Aquí deberíamos tener un endpoint para crear una nueva tarifa
      // Por ahora, simularemos la creación
      const nuevaTarifaCreada = {
        id_tarifa: Date.now(), // Simulamos un ID único
        id_parking: selectedParking,
        ...nuevaTarifa
      };
      
      setTarifas(prev => [...prev, nuevaTarifaCreada]);
      setNuevaTarifa({
        tipo_vehiculo: 'automovil',
        tarifa_hora: '',
        tarifa_dia: '',
        descripcion: ''
      });
      setError(null);
    } catch (err) {
      console.error('Error al crear tarifa:', err);
      setError('Error al crear la tarifa. Por favor, intenta de nuevo.');
    }
  };

  const handleEditarTarifa = (tarifa) => {
    setEditandoTarifa(tarifa);
  };

  const handleEditTarifaChange = (e) => {
    const { name, value } = e.target;
    setEditandoTarifa(prev => ({
      ...prev,
      [name]: name.includes('tarifa') ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmitEditarTarifa = async (e) => {
    e.preventDefault();
    
    if (!editandoTarifa.tipo_vehiculo || !editandoTarifa.tarifa_hora || !editandoTarifa.tarifa_dia) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    try {
      // Aquí deberíamos tener un endpoint para actualizar una tarifa
      // Por ahora, simularemos la actualización
      setTarifas(prev => 
        prev.map(t => 
          t.id_tarifa === editandoTarifa.id_tarifa ? editandoTarifa : t
        )
      );
      setEditandoTarifa(null);
      setError(null);
    } catch (err) {
      console.error('Error al actualizar tarifa:', err);
      setError('Error al actualizar la tarifa. Por favor, intenta de nuevo.');
    }
  };

  const handleEliminarTarifa = async (idTarifa) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarifa?')) {
      return;
    }
    
    try {
      // Aquí deberíamos tener un endpoint para eliminar una tarifa
      // Por ahora, simularemos la eliminación
      setTarifas(prev => prev.filter(t => t.id_tarifa !== idTarifa));
    } catch (err) {
      console.error('Error al eliminar tarifa:', err);
      setError('Error al eliminar la tarifa. Por favor, intenta de nuevo.');
    }
  };

  const cancelarEdicion = () => {
    setEditandoTarifa(null);
    setError(null);
  };

  if (loading && !tarifas.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gestión de Tarifas</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Tarifas</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Selector de Parking */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Seleccionar Parking</h2>
        <div className="max-w-md">
          <select
            value={selectedParking || ''}
            onChange={handleParkingChange}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {parkings.length === 0 && <option value="">No hay parkings disponibles</option>}
            {parkings.map(parking => (
              <option key={parking.id_parking} value={parking.id_parking}>
                {parking.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Lista de Tarifas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Tarifas Actuales</h2>
        
        {tarifas.length === 0 ? (
          <p className="text-gray-500">No hay tarifas configuradas para este parking.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Tipo de Vehículo</th>
                  <th className="py-3 px-6 text-right">Tarifa por Hora</th>
                  <th className="py-3 px-6 text-right">Tarifa por Día</th>
                  <th className="py-3 px-6 text-left">Descripción</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {tarifas.map(tarifa => (
                  <tr key={tarifa.id_tarifa} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 capitalize">{tarifa.tipo_vehiculo}</td>
                    <td className="py-3 px-6 text-right">${tarifa.tarifa_hora.toFixed(2)}</td>
                    <td className="py-3 px-6 text-right">${tarifa.tarifa_dia.toFixed(2)}</td>
                    <td className="py-3 px-6">{tarifa.descripcion}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button
                          onClick={() => handleEditarTarifa(tarifa)}
                          className="transform hover:text-blue-500 hover:scale-110 transition duration-300 mr-3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEliminarTarifa(tarifa.id_tarifa)}
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
      
      {/* Formulario para Editar Tarifa */}
      {editandoTarifa && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Editar Tarifa</h2>
          <form onSubmit={handleSubmitEditarTarifa}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
                <select
                  name="tipo_vehiculo"
                  value={editandoTarifa.tipo_vehiculo}
                  onChange={handleEditTarifaChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="automovil">Automóvil</option>
                  <option value="motocicleta">Motocicleta</option>
                  <option value="camioneta">Camioneta</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarifa por Hora ($)</label>
                <input
                  type="number"
                  name="tarifa_hora"
                  value={editandoTarifa.tarifa_hora}
                  onChange={handleEditTarifaChange}
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarifa por Día ($)</label>
                <input
                  type="number"
                  name="tarifa_dia"
                  value={editandoTarifa.tarifa_dia}
                  onChange={handleEditTarifaChange}
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={editandoTarifa.descripcion}
                  onChange={handleEditTarifaChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={cancelarEdicion}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition duration-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Formulario para Nueva Tarifa */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Nueva Tarifa</h2>
        <form onSubmit={handleSubmitNuevaTarifa}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
              <select
                name="tipo_vehiculo"
                value={nuevaTarifa.tipo_vehiculo}
                onChange={handleNuevaTarifaChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="automovil">Automóvil</option>
                <option value="motocicleta">Motocicleta</option>
                <option value="camioneta">Camioneta</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarifa por Hora ($)</label>
              <input
                type="number"
                name="tarifa_hora"
                value={nuevaTarifa.tarifa_hora}
                onChange={handleNuevaTarifaChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarifa por Día ($)</label>
              <input
                type="number"
                name="tarifa_dia"
                value={nuevaTarifa.tarifa_dia}
                onChange={handleNuevaTarifaChange}
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                name="descripcion"
                value={nuevaTarifa.descripcion}
                onChange={handleNuevaTarifaChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300"
            >
              Agregar Tarifa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TarifasPage;