import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useState } from 'react';

function ProductList() {
  const { productos, loading, deleteProducto } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (docId, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeleting(docId);
      await deleteProducto(docId);
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el producto');
    } finally {
      setDeleting(null);
    }
  };

  // Filtrar productos
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || producto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categorias = ['all', ...new Set(productos.map(p => p.categoria))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Productos
          </h1>
          <p className="text-gray-600">
            Gestiona el catálogo de productos de WWS
          </p>
        </div>
        <Link to="/productos/nuevo" className="btn-primary">
          + Nuevo Producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="all">Todas las categorías</option>
              {categorias.filter(c => c !== 'all').map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      {filteredProductos.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay productos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando un nuevo producto.
          </p>
          <div className="mt-6">
            <Link to="/productos/nuevo" className="btn-primary">
              + Crear Producto
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProductos.map((producto) => (
            <div key={producto.docId} className="card hover:shadow-lg transition-shadow">
              {/* Imagen */}
              {producto.imagen && (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  <span className="text-xs font-medium text-gray-500 ml-2">
                    #{producto.id}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {producto.descripcion}
                </p>

                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {producto.categoria}
                  </span>
                  {producto.marca && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {producto.marca}
                    </span>
                  )}
                </div>

                {producto.subproductos && producto.subproductos.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {producto.subproductos.length} subproducto(s)
                  </p>
                )}
              </div>

              {/* Acciones */}
              <div className="flex space-x-2">
                <Link
                  to={`/productos/editar/${producto.docId}`}
                  className="flex-1 btn-secondary text-center text-sm"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(producto.docId, producto.nombre)}
                  disabled={deleting === producto.docId}
                  className="flex-1 btn-danger text-sm"
                >
                  {deleting === producto.docId ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        Mostrando {filteredProductos.length} de {productos.length} productos
      </div>
    </div>
  );
}

export default ProductList;

