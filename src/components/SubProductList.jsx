import { useState } from 'react';
import { useSubproductos } from '../hooks/useProducts';
import SubProductForm from './SubProductForm';

function SubProductList({ productoDocId }) {
  const { subproductos, loading, deleteSubproducto, loadSubproductos } = useSubproductos(productoDocId);
  const [showForm, setShowForm] = useState(false);
  const [editingSubproducto, setEditingSubproducto] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleEdit = (subproducto) => {
    setEditingSubproducto(subproducto);
    setShowForm(true);
  };

  const handleDelete = async (subDocId, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
      return;
    }

    try {
      setDeleting(subDocId);
      await deleteSubproducto(subDocId);
      alert('SubProducto eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el subproducto');
    } finally {
      setDeleting(null);
    }
  };

  const handleCloseForm = async () => {
    setShowForm(false);
    setEditingSubproducto(null);
    // Recargar subproductos después de cerrar el formulario
    if (productoDocId) {
      await loadSubproductos();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {subproductos.length} subproducto(s)
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary text-sm"
            >
              + Agregar SubProducto
            </button>
          </div>

          {subproductos.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-4">
                No hay subproductos para este producto
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary text-sm"
              >
                Agregar Primer SubProducto
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {subproductos.map((subproducto) => (
                <div
                  key={subproducto.docId}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    {/* Imagen */}
                    {subproducto.imagen && (
                      <img
                        src={subproducto.imagen}
                        alt={subproducto.nombre}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">
                            {subproducto.nombre}
                          </h4>
                          <p className="text-xs text-gray-500">
                            ID: {subproducto.id}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {subproducto.descripcion}
                      </p>

                      {/* Acciones */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(subproducto)}
                          className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(subproducto.docId, subproducto.nombre)}
                          disabled={deleting === subproducto.docId}
                          className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors disabled:opacity-50"
                        >
                          {deleting === subproducto.docId ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <SubProductForm
          productoDocId={productoDocId}
          subproducto={editingSubproducto}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default SubProductList;

