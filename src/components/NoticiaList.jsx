import { Link } from 'react-router-dom';
import { useNoticias } from '../hooks/useNoticias';
import { useState } from 'react';
import { getAbsoluteUrl } from '../config/site';

function NoticiaList() {
  const { noticias, loading, deleteNoticia } = useNoticias();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (docId, titulo) => {
    if (!window.confirm(`¿Estás seguro de eliminar la noticia "${titulo}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeleting(docId);
      await deleteNoticia(docId);
      alert('Noticia eliminada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la noticia');
    } finally {
      setDeleting(null);
    }
  };

  // Filtrar noticias
  const filteredNoticias = noticias.filter(noticia => {
    const matchesSearch = noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         noticia.resumen.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
            Noticias
          </h1>
          <p className="text-gray-600">
            Gestiona las noticias del sitio
          </p>
        </div>
        <Link to="/noticias/nuevo" className="btn-primary">
          + Nueva Noticia
        </Link>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Buscar por título o resumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Lista de Noticias */}
      {filteredNoticias.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay noticias
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando una nueva noticia.
          </p>
          <div className="mt-6">
            <Link to="/noticias/nuevo" className="btn-primary">
              + Crear Noticia
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNoticias.map((noticia) => (
            <div key={noticia.docId} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Imagen */}
                {noticia.imagenes && noticia.imagenes.length > 0 && (
                  <div className="md:w-48 flex-shrink-0">
                    <img
                      src={getAbsoluteUrl(noticia.imagenes[0])}
                      alt={noticia.titulo}
                      className="w-full h-32 md:h-full object-cover rounded-lg"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        ID: {noticia.id} | Slug: {noticia.slug}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {noticia.resumen}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    {noticia.imagenes && noticia.imagenes.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {noticia.imagenes.length} imagen(es)
                      </span>
                    )}
                    {noticia.enlacesOficiales && noticia.enlacesOficiales.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {noticia.enlacesOficiales.length} enlace(s)
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/noticias/editar/${noticia.docId}`}
                      className="flex-1 btn-secondary text-center text-sm"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(noticia.docId, noticia.titulo)}
                      disabled={deleting === noticia.docId}
                      className="flex-1 btn-danger text-sm"
                    >
                      {deleting === noticia.docId ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        Mostrando {filteredNoticias.length} de {noticias.length} noticias
      </div>
    </div>
  );
}

export default NoticiaList;

