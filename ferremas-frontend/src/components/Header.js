import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';

const Header = () => {
  const { state, actions, computed } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    actions.logout();
    localStorage.removeItem('token');
  };

  return (
    <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden text-white"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              ☰
            </button>
            <h1 
              className="text-2xl font-bold text-yellow-400 cursor-pointer" 
              onClick={() => actions.setCurrentPage('home')}
            >
              FERREMAS
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => actions.setCurrentPage('home')}
              className="hover:text-yellow-400 transition-colors flex items-center space-x-1"
            >
              🏠 <span>Inicio</span>
            </button>
            <button 
              onClick={() => actions.setCurrentPage('products')}
              className="hover:text-yellow-400 transition-colors"
            >
              Productos
            </button>
            <button 
              onClick={() => actions.setCurrentPage('contact')}
              className="hover:text-yellow-400 transition-colors"
            >
              Contacto
            </button>
            {state.user?.type === 'admin' && (
              <button 
                onClick={() => actions.setCurrentPage('admin')}
                className="hover:text-yellow-400 transition-colors"
              >
                Administración
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="pl-10 pr-4 py-2 rounded-lg text-gray-900 w-64"
                value={state.searchTerm}
                onChange={(e) => actions.setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
            
            <button 
              onClick={actions.toggleCart}
              className="relative hover:text-yellow-400 transition-colors"
            >
              🛒
              {computed.getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {computed.getTotalItems()}
                </span>
              )}
            </button>
            
            {state.isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 hover:text-yellow-400 transition-colors">
                  👤 <span className="hidden md:block">{state.user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold">{state.user?.name}</p>
                    <p className="text-xs text-gray-500">{state.user?.type}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={actions.toggleLogin}
                className="hover:text-yellow-400 transition-colors flex items-center space-x-1"
              >
                👤 <span className="hidden md:block">Ingresar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <button 
              onClick={() => { 
                actions.setCurrentPage('home'); 
                setShowMobileMenu(false); 
              }}
              className="block w-full text-left py-2 hover:text-yellow-400"
            >
              Inicio
            </button>
            <button 
              onClick={() => { 
                actions.setCurrentPage('products'); 
                setShowMobileMenu(false); 
              }}
              className="block w-full text-left py-2 hover:text-yellow-400"
            >
              Productos
            </button>
            <button 
              onClick={() => { 
                actions.setCurrentPage('contact'); 
                setShowMobileMenu(false); 
              }}
              className="block w-full text-left py-2 hover:text-yellow-400"
            >
              Contacto
            </button>
            {state.user?.type === 'admin' && (
              <button 
                onClick={() => { 
                  actions.setCurrentPage('admin'); 
                  setShowMobileMenu(false); 
                }}
                className="block w-full text-left py-2 hover:text-yellow-400"
              >
                Administración
              </button>
            )}
            <div className="pt-2">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full px-3 py-2 rounded text-gray-900"
                value={state.searchTerm}
                onChange={(e) => actions.setSearch(e.target.value)}
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;