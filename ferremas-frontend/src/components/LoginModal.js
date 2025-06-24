import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { authService } from '../services/api';

const LoginModal = () => {
  const { state, actions } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });

      actions.setUser(response.user);
      localStorage.setItem('token', response.token);
      setFormData({ email: '', password: '' });
    } catch (err) {
      console.error('Error en autenticación:', err);
      setError('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  // Usuarios de prueba
  const testUsers = [
    { email: 'admin@ferremas.cl', password: 'admin123', type: 'Administrador' },
    { email: 'vendedor@ferremas.cl', password: 'vend123', type: 'Vendedor' },
    { email: 'cliente@test.cl', password: 'cliente123', type: 'Cliente' }
  ];

  if (!state.showLogin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Iniciar Sesión</h2>
          <button onClick={actions.toggleLogin}>
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center space-x-2">
            ⚠️ <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Ingresar'}
          </button>
        </div>

        {/* Usuarios de prueba */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Usuarios de Prueba:</h3>
          <div className="space-y-2">
            {testUsers.map((user, index) => (
              <div key={index} className="text-xs text-gray-600">
                <div className="font-semibold">{user.type}:</div>
                <div>Email: {user.email}</div>
                <div>Contraseña: {user.password}</div>
                <button
                  onClick={() => setFormData({
                    email: user.email,
                    password: user.password
                  })}
                  className="text-blue-600 hover:underline text-xs"
                >
                  Usar credenciales
                </button>
                <hr className="my-1"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;