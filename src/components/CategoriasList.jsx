import { useState } from 'react';
import { useCategorias } from '../hooks/useCategorias';
import CategoriaForm from './CategoriaForm';

function CategoriasList() {
  const { categorias, loading, deleteCategoria } = useCategorias();
  const [showForm, setShowForm] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (docId, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${nombre}"? Esta acción no se puede deshacer y afectará a los productos que la usen.`)) {
      return;
    }

    try {
      setDeleting(docId);
      await deleteCategoria(docId);
      alert('Categoría eliminada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la categoría');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (categoria) => {
    setEditingCategoria(categoria);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingCategoria(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategoria(null);
  };

  if (showForm) {
    return (
      <CategoriaForm
        categoria={editingCategoria}
        onClose={handleCloseForm}
      />
    );
  }

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
            Categorías de Productos
          </h1>
          <p className="text-gray-600">
            Gestiona las categorías disponibles para los productos
          </p>
        </div>
        <button onClick={handleNew} className="btn-primary">
          + Nueva Categoría
        </button>
      </div>

      {/* Lista de Categorías */}
      {categorias.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay categorías
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando una nueva categoría.
          </p>
          <div className="mt-6">
            <button onClick={handleNew} className="btn-primary">
              + Agregar Categoría
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {categorias.map((categoria) => (
            <div key={categoria.docId} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-bold">
                    {categoria.nombre}
                  </div>
                  <span className="text-sm text-gray-500">
                    ID: {categoria.id}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(categoria)}
                    className="btn-secondary text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(categoria.docId, categoria.nombre)}
                    disabled={deleting === categoria.docId}
                    className="btn-danger text-sm"
                  >
                    {deleting === categoria.docId ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Advertencia */}
      <div className="mt-6 card bg-yellow-50 border-yellow-200">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Advertencia:</strong> Al eliminar una categoría, los productos que la usen quedarán sin categoría asignada. Se recomienda editar los productos antes de eliminar categorías.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        Total: {categorias.length} categoría(s)
      </div>
    </div>
  );
}

export default CategoriasList;

