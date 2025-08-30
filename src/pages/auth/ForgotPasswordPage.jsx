import { useState } from 'react';
import authService from '../../services/authService';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await authService.forgotPassword(email);
      setMessage('Si el correo existe, se ha enviado un enlace para restablecer la contraseña.');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo enviar el correo de recuperación.');
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
          <h2 className="text-2xl font-extrabold text-gray-900">Recuperar contraseña</h2>
          <p className="text-sm text-gray-600 mt-1">Ingresa tu correo y te enviaremos un enlace</p>
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
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn w-full">
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>

          <div className="text-sm text-center mt-2">
            <Link to="/login" className="font-medium text-[#2563EB] hover:text-[#3B82F6]">Volver al inicio de sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
