import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useState } from 'react';

function Layout({ user, children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">🌊</span>
                <span className="text-xl font-bold text-gray-900">WWS CMS</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') && location.pathname === '/'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                
                {/* Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                      isActive('/productos') || isActive('/noticias') || isActive('/proyectos') || isActive('/aliados') || isActive('/categorias')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>Gestión</span>
                    <svg className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {menuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setMenuOpen(false)}
                      ></div>
                      <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                        <div className="py-1">
                          <Link
                            to="/productos"
                            onClick={() => setMenuOpen(false)}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive('/productos')
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            Productos
                          </Link>
                          <Link
                            to="/noticias"
                            onClick={() => setMenuOpen(false)}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive('/noticias')
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            Noticias
                          </Link>
                          <Link
                            to="/proyectos"
                            onClick={() => setMenuOpen(false)}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive('/proyectos')
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            Proyectos
                          </Link>
                          <Link
                            to="/aliados"
                            onClick={() => setMenuOpen(false)}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive('/aliados')
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            Aliados
                          </Link>
                          <Link
                            to="/categorias"
                            onClick={() => setMenuOpen(false)}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive('/categorias')
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            Categorías
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Link
                  to="/empresa"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/empresa')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Empresa
                </Link>
                <Link
                  to="/usuarios"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/usuarios')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Usuarios
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2025 Water Wise Services. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

