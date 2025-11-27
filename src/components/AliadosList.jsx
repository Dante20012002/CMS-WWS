import { useState } from 'react';
import { useAliados } from '../hooks/useAliados';
import AliadoForm from './AliadoForm';
import { getAbsoluteUrl } from '../config/site';

function AliadosList() {
  const { aliados, loading, deleteAliado } = useAliados();
  const [showForm, setShowForm] = useState(false);
  const [editingAliado, setEditingAliado] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (docId, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el aliado "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeleting(docId);
      await deleteAliado(docId);
      alert('Aliado eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el aliado');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (aliado) => {
    setEditingAliado(aliado);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingAliado(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAliado(null);
  };

  if (showForm) {
    return (
      <AliadoForm
        aliado={editingAliado}
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
            Nuestros Aliados
          </h1>
          <p className="text-gray-600">
            Gestiona los aliados que aparecen en la sección "Sobre Nosotros"
          </p>
        </div>
        <button onClick={handleNew} className="btn-primary">
          + Nuevo Aliado
        </button>
      </div>

      {/* Lista de Aliados */}
      {aliados.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay aliados
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando un nuevo aliado.
          </p>
          <div className="mt-6">
            <button onClick={handleNew} className="btn-primary">
              + Agregar Aliado
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aliados.map((aliado) => (
            <div key={aliado.docId} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                {/* Logo */}
                {aliado.logo && (
                  <div className="mb-4">
                    <img
                      src={getAbsoluteUrl(aliado.logo)}
                      alt={aliado.nombre}
                      className="w-32 h-32 object-contain rounded-lg border border-gray-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300 hidden">
                      <span className="text-gray-400 text-xs">Sin imagen</span>
                    </div>
                  </div>
                )}

                {/* Nombre */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {aliado.nombre}
                </h3>

                {/* URL */}
                {aliado.url && (
                  <a
                    href={aliado.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 mb-4 break-all"
                  >
                    {aliado.url}
                  </a>
                )}

                {/* Acciones */}
                <div className="flex space-x-2 w-full mt-auto">
                  <button
                    onClick={() => handleEdit(aliado)}
                    className="flex-1 btn-secondary text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(aliado.docId, aliado.nombre)}
                    disabled={deleting === aliado.docId}
                    className="flex-1 btn-danger text-sm"
                  >
                    {deleting === aliado.docId ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        Total: {aliados.length} aliado(s)
      </div>
    </div>
  );
}

export default AliadosList;

