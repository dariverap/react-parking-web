import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Páginas públicas
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Páginas de administrador
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ParkingsPage from './pages/admin/ParkingsPage';
import ParkingDetail from './pages/admin/ParkingDetail';
import ParkingForm from './pages/admin/ParkingForm';
import UsuariosPage from './pages/admin/UsuariosPage';
import ReportesPage from './pages/admin/ReportesPage';
import TarifasPage from './pages/admin/TarifasPage';

// Páginas de empleado
import DashboardEmployee from './pages/employee/DashboardEmployee';
import EspaciosPage from './pages/employee/EspaciosPage';
import ReservasPage from './pages/employee/ReservasPage';
import PagosPage from './pages/employee/PagosPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Redirigir la ruta raíz a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rutas protegidas para administradores */}
          <Route element={<ProtectedRoute allowedRoles={['admin_general', 'admin_parking']} />}>
            <Route element={<Layout />}>
              <Route path="/admin/dashboard" element={<DashboardAdmin />} />
              <Route path="/admin/parkings" element={<ParkingsPage />} />
              <Route path="/admin/parkings/:id" element={<ParkingDetail />} />
              <Route path="/admin/parkings/new" element={<ParkingForm />} />
              <Route path="/admin/parkings/edit/:id" element={<ParkingForm />} />
              {/* Solo admin_general puede gestionar usuarios */}
              <Route element={<ProtectedRoute allowedRoles={['admin_general']} />}>
                <Route path="/admin/usuarios" element={<UsuariosPage />} />
              </Route>
              <Route path="/admin/reportes" element={<ReportesPage />} />
              <Route path="/admin/tarifas" element={<TarifasPage />} />
            </Route>
          </Route>
          
          {/* Rutas protegidas para empleados */}
          <Route element={<ProtectedRoute allowedRoles={['empleado']} />}>
            <Route element={<Layout />}>
              <Route path="/employee/dashboard" element={<DashboardEmployee />} />
              <Route path="/employee/espacios" element={<EspaciosPage />} />
              <Route path="/employee/reservas" element={<ReservasPage />} />
              <Route path="/employee/pagos" element={<PagosPage />} />
            </Route>
          </Route>
          
          {/* Ruta para manejar rutas no encontradas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
