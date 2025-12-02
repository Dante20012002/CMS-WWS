import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

function Dashboard() {
  const [stats, setStats] = useState({
    productos: 0,
    subproductos: 0,
    noticias: 0,
    proyectos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Contar productos
      const productosSnapshot = await getDocs(collection(db, 'productos'));
      let totalSubproductos = 0;

      // Contar subproductos de cada producto
      for (const doc of productosSnapshot.docs) {
        const subproductosSnapshot = await getDocs(
          collection(db, 'productos', doc.id, 'subproductos')
        );
        totalSubproductos += subproductosSnapshot.size;
      }

      // Contar noticias
      const noticiasSnapshot = await getDocs(collection(db, 'noticias'));

      // Contar proyectos
      const proyectosSnapshot = await getDocs(collection(db, 'proyectos'));

      setStats({
        productos: productosSnapshot.size,
        subproductos: totalSubproductos,
        noticias: noticiasSnapshot.size,
        proyectos: proyectosSnapshot.size
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Bienvenido al sistema de gestión de contenidos de Water Wise Solutions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Productos
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.productos}
              </p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total SubProductos
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.subproductos}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Noticias
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.noticias}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Proyectos
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.proyectos}
              </p>
            </div>
            <div className="bg-orange-100 p-4 rounded-full">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/productos/nuevo"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
          >
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900 group-hover:text-primary-700">
                Crear Nuevo Producto
              </p>
              <p className="text-sm text-gray-600">
                Agregar un producto al catálogo
              </p>
            </div>
          </Link>

          <Link
            to="/productos"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
          >
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900 group-hover:text-primary-700">
                Ver Todos los Productos
              </p>
              <p className="text-sm text-gray-600">
                Gestionar productos existentes
              </p>
            </div>
          </Link>

          <Link
            to="/noticias/nuevo"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
          >
            <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900 group-hover:text-primary-700">
                Crear Nueva Noticia
              </p>
              <p className="text-sm text-gray-600">
                Publicar una nueva noticia
              </p>
            </div>
          </Link>

          <Link
            to="/proyectos/nuevo"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
          >
            <div className="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900 group-hover:text-primary-700">
                Crear Nuevo Proyecto
              </p>
              <p className="text-sm text-gray-600">
                Agregar un proyecto al mapa
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

