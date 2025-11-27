import { useState, useEffect } from 'react';
import { useAliados } from '../hooks/useAliados';
import ImagePathInput from './ImagePathInput';

function AliadoForm({ aliado, onClose }) {
  const { createAliado, updateAliado } = useAliados();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    logo: '',
    url: ''
  });

  useEffect(() => {
    if (aliado) {
      setFormData({
        nombre: aliado.nombre || '',
        logo: aliado.logo || '',
        url: aliado.url || ''
      });
    }
  }, [aliado]);

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
      alert('El nombre es requerido');
      return;
    }

    if (!formData.logo.trim()) {
      alert('La ruta del logo es requerida');
      return;
    }

    if (!formData.url.trim()) {
      alert('La URL es requerida');
      return;
    }

    try {
      setLoading(true);

      if (aliado) {
        // Actualizar
        await updateAliado(aliado.docId, {
          nombre: formData.nombre.trim(),
          logo: formData.logo.trim(),
          url: formData.url.trim()
        });
        alert('Aliado actualizado exitosamente');
      } else {
        // Crear
        await createAliado({
          nombre: formData.nombre.trim(),
          logo: formData.logo.trim(),
          url: formData.url.trim()
        });
        alert('Aliado creado exitosamente');
      }

      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el aliado');
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
          <span>Volver a aliados</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {aliado ? 'Editar Aliado' : 'Nuevo Aliado'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Información del Aliado
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
                placeholder="Ej: Equom"
                required
              />
            </div>

            <ImagePathInput
              label="Ruta del Logo"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="/assets/Aliados/Equom.png"
              required={true}
              helpText="Ruta del archivo en cPanel (ej: /assets/Aliados/Equom.png)"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://www.ejemplo.com"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                URL del sitio web del aliado
              </p>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            💡 Instrucciones
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Sube primero el logo a cPanel en la carpeta /assets/Aliados/</li>
            <li>Ingresa la ruta completa del logo (ej: /assets/Aliados/Equom.png)</li>
            <li>La URL debe ser completa (incluir https://)</li>
          </ul>
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
            {loading ? 'Guardando...' : aliado ? 'Actualizar Aliado' : 'Crear Aliado'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AliadoForm;

