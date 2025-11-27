import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmpresa } from '../hooks/useEmpresa';
import ImagePathInput from './ImagePathInput';

function EmpresaEditor() {
  const navigate = useNavigate();
  const { empresa, loading: loadingData, updateEmpresa } = useEmpresa();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sobreNosotros: {
      titulo: '',
      texto: '',
      imagen: ''
    },
    mision: {
      titulo: '',
      texto: ''
    },
    vision: {
      titulo: '',
      texto: ''
    },
    objetivos: {
      titulo: '',
      texto: '',
      imagen: ''
    }
  });

  // Cargar datos cuando empresa esté disponible
  useEffect(() => {
    if (empresa) {
      setFormData({
        sobreNosotros: empresa.sobreNosotros || { titulo: 'Sobre Nosotros', texto: '', imagen: '' },
        mision: empresa.mision || { titulo: 'MISIÓN', texto: '' },
        vision: empresa.vision || { titulo: 'VISIÓN', texto: '' },
        objetivos: empresa.objetivos || { titulo: 'NUESTRO OBJETIVO', texto: '', imagen: '' }
      });
    }
  }, [empresa]);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.sobreNosotros.texto.trim()) {
      alert('El texto de "Sobre Nosotros" es requerido');
      return;
    }

    if (!formData.mision.texto.trim()) {
      alert('El texto de "Misión" es requerido');
      return;
    }

    if (!formData.vision.texto.trim()) {
      alert('El texto de "Visión" es requerido');
      return;
    }

    if (!formData.objetivos.texto.trim()) {
      alert('El texto de "Objetivos" es requerido');
      return;
    }

    try {
      setLoading(true);

      await updateEmpresa(formData);
      alert('Información actualizada exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la información');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Editar Información de la Empresa
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona el contenido de "Sobre Nosotros", "Misión" y "Objetivos"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sobre Nosotros */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Sobre Nosotros
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.sobreNosotros.titulo}
                onChange={(e) => handleChange('sobreNosotros', 'titulo', e.target.value)}
                className="input-field"
                placeholder="Sobre Nosotros"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.sobreNosotros.texto}
                onChange={(e) => handleChange('sobreNosotros', 'texto', e.target.value)}
                rows="6"
                className="input-field"
                placeholder="Descripción de la empresa..."
                required
              />
            </div>

            <div>
              <ImagePathInput
                label="Ruta de Imagen"
                name="sobreNosotros.imagen"
                value={formData.sobreNosotros.imagen}
                onChange={(e) => handleChange('sobreNosotros', 'imagen', e.target.value)}
                placeholder="/assets/Agua.jpg"
                helpText="Ruta del archivo en cPanel (ej: /assets/Agua.jpg)"
              />
            </div>
          </div>
        </div>

        {/* Misión */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Misión
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.mision.titulo}
                onChange={(e) => handleChange('mision', 'titulo', e.target.value)}
                className="input-field"
                placeholder="MISIÓN"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.mision.texto}
                onChange={(e) => handleChange('mision', 'texto', e.target.value)}
                rows="6"
                className="input-field"
                placeholder="Texto de la misión..."
                required
              />
            </div>
          </div>
        </div>

        {/* Visión */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Visión
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.vision.titulo}
                onChange={(e) => handleChange('vision', 'titulo', e.target.value)}
                className="input-field"
                placeholder="VISIÓN"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.vision.texto}
                onChange={(e) => handleChange('vision', 'texto', e.target.value)}
                rows="6"
                className="input-field"
                placeholder="Texto de la visión..."
                required
              />
            </div>
          </div>
        </div>

        {/* Objetivos */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Nuestros Objetivos
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.objetivos.titulo}
                onChange={(e) => handleChange('objetivos', 'titulo', e.target.value)}
                className="input-field"
                placeholder="NUESTRO OBJETIVO"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.objetivos.texto}
                onChange={(e) => handleChange('objetivos', 'texto', e.target.value)}
                rows="6"
                className="input-field"
                placeholder="Texto de los objetivos..."
                required
              />
            </div>

            <div>
              <ImagePathInput
                label="Ruta de Imagen"
                name="objetivos.imagen"
                value={formData.objetivos.imagen}
                onChange={(e) => handleChange('objetivos', 'imagen', e.target.value)}
                placeholder="/assets/BARRANQUILLA 1.jpg"
                helpText="Ruta del archivo en cPanel (ej: /assets/BARRANQUILLA 1.jpg)"
              />
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            💡 Instrucciones
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Sube primero las imágenes a cPanel (File Manager o FTP)</li>
            <li>Ingresa las rutas de las imágenes (ej: /assets/Agua.jpg)</li>
            <li>Los textos pueden incluir HTML básico si es necesario</li>
            <li>Los cambios se reflejarán en la landing después del build</li>
            <li>Gestiona: Sobre Nosotros, Misión, Visión y Objetivos</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
            disabled={loading}
          >
            Volver al Dashboard
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmpresaEditor;

