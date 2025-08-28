import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos, verificar que el usuario tenga uno de esos roles
  if (allowedRoles && !allowedRoles.includes(currentUser.rol)) {
    // Redirigir según el rol del usuario
    if (currentUser.rol === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (currentUser.rol === 'empleado') {
      return <Navigate to="/employee/dashboard" replace />;
    } else {
      // Si el rol no es reconocido, redirigir al login
      return <Navigate to="/login" replace />;
    }
  }

  // Si el usuario está autenticado y tiene el rol adecuado, mostrar el contenido protegido
  return <Outlet />;
};

export default ProtectedRoute;