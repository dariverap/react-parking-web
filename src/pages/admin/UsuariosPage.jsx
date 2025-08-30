import { useState, useEffect } from 'react';
import usuarioService from '../../services/usuarioService';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos'); // todos, admin_general, admin_parking, empleado, cliente
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('cliente');
  const [saving, setSaving] = useState(false);
  const [formNombre, setFormNombre] = useState('');
  const [formApellido, setFormApellido] = useState('');
  const [formTelefono, setFormTelefono] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAllUsuarios();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar la lista de usuarios. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBloqueo = async (idUsuario, bloqueado) => {
    try {
      await usuarioService.toggleBloqueoUsuario(idUsuario);
      // Actualizar el estado local
      setUsuarios(usuarios.map(usuario => 
        usuario.id_usuario === idUsuario 
          ? { ...usuario, bloqueado: !bloqueado } 
          : usuario
      ));
    } catch (err) {
      console.error('Error al cambiar estado de bloqueo:', err);
      setError('Error al cambiar el estado de bloqueo del usuario. Por favor, intenta de nuevo.');
    }
  };

  const handleVerDetalles = async (idUsuario) => {
    try {
      setError(null);
      const data = await usuarioService.getUsuarioById(idUsuario);
      setSelectedUser(data);
      setSelectedRole(data?.rol || 'cliente');
      setFormNombre(data?.nombre || '');
      setFormApellido(data?.apellido || '');
      setFormTelefono(data?.telefono || '');
      setShowModal(true);
    } catch (err) {
      console.error('Error al cargar detalles del usuario:', err);
      setError('No se pudieron cargar los detalles del usuario.');
    }
  };

  const handleGuardarDetalles = async () => {
    if (!selectedUser) return;
    try {
      setSaving(true);
      const payload = { rol: selectedRole, nombre: formNombre, apellido: formApellido, telefono: formTelefono };
      const resp = await usuarioService.updateUsuario(selectedUser.id_usuario, payload);
      const updated = resp?.data || selectedUser;
      setUsuarios(prev => prev.map(u => 
        u.id_usuario === updated.id_usuario 
          ? { ...u, rol: updated.rol, nombre: updated.nombre, apellido: updated.apellido, telefono: updated.telefono }
          : u
      ));
      setShowModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error al guardar detalles del usuario:', err);
      const msg = err.response?.data?.message || 'No se pudo actualizar el usuario.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleEliminarUsuario = async () => {
    if (!selectedUser) return;
    const confirmar = confirm('¿Seguro que deseas eliminar (dar de baja) este usuario? Esta acción es reversible pero impedirá acceso del usuario.');
    if (!confirmar) return;
    const motivo = prompt('Motivo de la baja (opcional):', 'Baja administrativa');
    try {
      setSaving(true);
      await usuarioService.deleteUsuario(selectedUser.id_usuario, motivo || undefined);
      setUsuarios(prev => prev.filter(u => u.id_usuario !== selectedUser.id_usuario));
      setShowModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      const msg = err.response?.data?.message || 'No se pudo eliminar el usuario.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const filtrarUsuarios = () => {
    return usuarios.filter(usuario => {
      // Filtrar por tipo de usuario
      if (tipoFiltro !== 'todos' && usuario.rol !== tipoFiltro) {
        return false;
      }
      
      // Filtrar por texto
      if (filtro) {
        const terminoBusqueda = filtro.toLowerCase();
        return (
          usuario.nombre?.toLowerCase().includes(terminoBusqueda) ||
          usuario.apellido?.toLowerCase().includes(terminoBusqueda) ||
          usuario.email?.toLowerCase().includes(terminoBusqueda)
        );
      }
      
      return true;
    });
  };

  const usuariosFiltrados = filtrarUsuarios();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Usuarios</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold">Usuarios Registrados</h2>
            <p className="text-gray-500">Total: {usuarios.length} usuarios</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div>
              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="todos">Todos los roles</option>
                <option value="admin_general">Administradores Generales</option>
                <option value="admin_parking">Administradores de Parking</option>
                <option value="empleado">Empleados</option>
                <option value="cliente">Clientes</option>
              </select>
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : usuariosFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {usuario.nombre?.charAt(0)}{usuario.apellido?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.nombre} {usuario.apellido}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {usuario.id_usuario}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{usuario.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        usuario.rol === 'admin_general' || usuario.rol === 'admin_parking'
                          ? 'bg-purple-100 text-purple-800'
                          : usuario.rol === 'empleado'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {usuario.rol === 'admin_general'
                          ? 'Administrador General'
                          : usuario.rol === 'admin_parking'
                          ? 'Administrador de Parking'
                          : usuario.rol === 'empleado'
                          ? 'Empleado'
                          : 'Cliente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${usuario.bloqueado ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {usuario.bloqueado ? 'Bloqueado' : 'Activo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleBloqueo(usuario.id_usuario, usuario.bloqueado)}
                        className={`${usuario.bloqueado ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white py-1 px-3 rounded text-sm mr-2`}
                      >
                        {usuario.bloqueado ? 'Desbloquear' : 'Bloquear'}
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                        onClick={() => handleVerDetalles(usuario.id_usuario)}
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron usuarios que coincidan con los criterios de búsqueda.</p>
          </div>
        )}
      </div>
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalles del Usuario</h3>
              <button onClick={handleCerrarModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 text-gray-900">{selectedUser.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  type="text"
                  value={formApellido}
                  onChange={(e) => setFormApellido(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={formTelefono}
                  onChange={(e) => setFormTelefono(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={Boolean(selectedUser.bloqueado)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="admin_general">Administrador General</option>
                  <option value="admin_parking">Administrador de Parking</option>
                  <option value="empleado">Empleado</option>
                  <option value="cliente">Cliente</option>
                </select>
                {selectedUser.bloqueado && (
                  <p className="mt-1 text-xs text-gray-500">No se puede cambiar el rol de un usuario bloqueado.</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handleEliminarUsuario}
                className={`px-4 py-2 rounded border border-red-600 text-red-600 hover:bg-red-50 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={saving}
              >
                Eliminar (baja)
              </button>
              <div className="flex space-x-3">
              <button
                onClick={handleCerrarModal}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarDetalles}
                className={`px-4 py-2 rounded text-white ${saving ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;