import { useEffect, useMemo, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function extractTokenFromUrl(hash, search) {
  // Supabase usual callback uses URL fragment (#access_token=...)
  const paramsFromHash = new URLSearchParams(hash?.startsWith('#') ? hash.slice(1) : hash || '');
  const tokenFromHash = paramsFromHash.get('access_token');
  if (tokenFromHash) return tokenFromHash;
  // Fallback: sometimes sent via query string
  const paramsFromQuery = new URLSearchParams(search || '');
  return paramsFromQuery.get('access_token');
}

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useMemo(() => extractTokenFromUrl(location.hash, location.search), [location.hash, location.search]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken) {
      setError('No se encontró token de restablecimiento en el enlace. Vuelve a solicitar el correo.');
    }
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) return;
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');
    try {
      await authService.resetPassword({ access_token: accessToken, newPassword });
      setMessage('Tu contraseña fue restablecida correctamente. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-[#2563EB] text-white flex items-center justify-center rounded-full text-2xl font-bold shadow-md">P</div>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Restablecer contraseña</h2>
          <p className="text-sm text-gray-600 mt-1">Ingresa una nueva contraseña para tu cuenta</p>
        </div>

        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-[#EF4444] text-[#DC2626] p-4 rounded-md" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">Nueva contraseña</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="input"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading || !accessToken} className="btn w-full">
            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </button>

          <div className="text-sm text-center mt-2">
            <Link to="/login" className="font-medium text-[#2563EB] hover:text-[#3B82F6]">Volver al inicio de sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
