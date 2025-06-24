import React from 'react';
import AdminPanel from '../components/AdminPanel';
import { useApp } from '../contexts/AppContext';

const AdminPage = () => {
  const { state, actions } = useApp();

  // Verificar que el usuario sea administrador
  if (!state.isLoggedIn || state.user?.type !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚫</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
            <p className="text-gray-600">
              {!state.isLoggedIn 
                ? 'Debes iniciar sesión como administrador para acceder a esta sección.'
                : 'No tienes permisos de administrador para acceder a esta sección.'
              }
            </p>
          </div>
          
          {!state.isLoggedIn ? (
            <div className="space-y-4">
              <button 
                onClick={actions.toggleLogin}
                className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Iniciar Sesión como Administrador
              </button>
              
              <div className="text-sm text-gray-500 border-t pt-4">
                <p className="font-semibold mb-2">Credenciales de prueba:</p>
                <p>Email: admin@ferremas.cl</p>
                <p>Contraseña: admin123</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              <p>Tu cuenta actual: <strong>{state.user?.email}</strong></p>
              <p>Tipo: <strong>{state.user?.type}</strong></p>
              <p className="mt-2">Contacta al administrador del sistema para obtener los permisos necesarios.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <AdminPanel />;
};

export default AdminPage;