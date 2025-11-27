import { useState, useEffect } from 'react';
import { useCategorias } from '../hooks/useCategorias';

function CategoriaForm({ categoria, onClose }) {
  const { createCategoria, updateCategoria } = useCategorias();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: ''
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre || ''
      });
    }
  }, [categoria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      alert('El nombre de la categoría es requerido');
      return;
    }

    try {
      setLoading(true);

      if (categoria) {
        // Actualizar
        await updateCategoria(categoria.docId, {
          nombre: formData.nombre.trim()
        });
        alert('Categoría actualizada exitosamente');
      } else {
        // Crear
        await createCategoria({
          nombre: formData.nombre.trim()
        });
        alert('Categoría creada exitosamente');
      }

      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onClose}
          className="text-primary-600 hover:text-primary-700 mb-4 flex items-center space-x-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver a categorías</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Información de la Categoría
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: CONTROL DE CAUDAL"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Este nombre aparecerá en el selector de categorías al crear/editar productos
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : categoria ? 'Actualizar Categoría' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoriaForm;

