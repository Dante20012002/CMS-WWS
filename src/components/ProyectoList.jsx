import { Link } from 'react-router-dom';
import { useProyectos } from '../hooks/useProyectos';
import { useState } from 'react';
import { getAbsoluteUrl } from '../config/site';

function ProyectoList() {
  const { proyectos, loading, deleteProyecto } = useProyectos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('all');
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (docId, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar el proyecto "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setDeleting(docId);
      await deleteProyecto(docId);
      alert('Proyecto eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el proyecto');
    } finally {
      setDeleting(null);
    }
  };

  // Filtrar proyectos
  const filteredProyectos = proyectos.filter(proyecto => {
    const matchesSearch = proyecto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proyecto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proyecto.ubicacion?.ciudad?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = selectedTipo === 'all' || proyecto.tipo === selectedTipo;
    return matchesSearch && matchesTipo;
  });

  // Obtener tipos únicos
  const tipos = ['all', ...new Set(proyectos.map(p => p.tipo).filter(Boolean))];

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
            Proyectos
          </h1>
          <p className="text-gray-600">
            Gestiona los proyectos de "Donde hemos estado"
          </p>
        </div>
        <Link to="/proyectos/nuevo" className="btn-primary">
          + Nuevo Proyecto
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
              placeholder="Buscar por nombre, descripción o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos los tipos</option>
              {tipos.filter(t => t !== 'all').map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Proyectos */}
      {filteredProyectos.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay proyectos
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando un nuevo proyecto.
          </p>
          <div className="mt-6">
            <Link to="/proyectos/nuevo" className="btn-primary">
              + Crear Proyecto
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProyectos.map((proyecto) => (
            <div key={proyecto.docId} className="card hover:shadow-lg transition-shadow">
              {/* Imagen */}
              {proyecto.imagenPrincipal && (
                <img
                  src={getAbsoluteUrl(proyecto.imagenPrincipal)}
                  alt={proyecto.nombre}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {proyecto.nombre}
                  </h3>
                  <span className="text-xs font-medium text-gray-500 ml-2">
                    #{proyecto.id}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2">
                  {proyecto.descripcion}
                </p>

                <div className="flex items-center space-x-2">
                  {proyecto.tipo && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {proyecto.tipo.charAt(0).toUpperCase() + proyecto.tipo.slice(1)}
                    </span>
                  )}
                  {proyecto.ubicacion && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {proyecto.ubicacion.ciudad}
                    </span>
                  )}
                </div>

                {proyecto.ubicacion && (
                  <p className="text-xs text-gray-500">
                    📍 {proyecto.ubicacion.ciudad}, {proyecto.ubicacion.departamento}
                  </p>
                )}

                {proyecto.ubicacion && (
                  <p className="text-xs text-gray-500">
                    🗺️ {proyecto.ubicacion.lat?.toFixed(4)}, {proyecto.ubicacion.lng?.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Acciones */}
              <div className="flex space-x-2">
                <Link
                  to={`/proyectos/editar/${proyecto.docId}`}
                  className="flex-1 btn-secondary text-center text-sm"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(proyecto.docId, proyecto.nombre)}
                  disabled={deleting === proyecto.docId}
                  className="flex-1 btn-danger text-sm"
                >
                  {deleting === proyecto.docId ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 text-sm text-gray-600 text-center">
        Mostrando {filteredProyectos.length} de {proyectos.length} proyectos
      </div>
    </div>
  );
}

export default ProyectoList;


