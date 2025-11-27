import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNoticias } from '../hooks/useNoticias';
import { getAbsoluteUrl } from '../config/site';

function NoticiaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNoticia, createNoticia, updateNoticia } = useNoticias();
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!id);
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    slug: '',
    imagenes: [],
    contenido: '',
    enlacesOficiales: []
  });

  // Cargar noticia si estamos editando
  useEffect(() => {
    if (id) {
      loadNoticia();
    }
  }, [id]);

  const loadNoticia = async () => {
    try {
      setLoadingData(true);
      const noticia = await getNoticia(id);
      setFormData({
        titulo: noticia.titulo || '',
        resumen: noticia.resumen || '',
        slug: noticia.slug || '',
        imagenes: noticia.imagenes || [],
        contenido: noticia.contenido || '',
        enlacesOficiales: noticia.enlacesOficiales || []
      });
    } catch (error) {
      console.error('Error al cargar noticia:', error);
      alert('Error al cargar la noticia');
      navigate('/noticias');
    } finally {
      setLoadingData(false);
    }
  };

  // Generar slug automáticamente del título
  const generateSlug = (titulo) => {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generar slug cuando cambia el título
      ...(name === 'titulo' ? { slug: generateSlug(value) } : {})
    }));
  };

  // Manejar imágenes
  const handleAddImagen = () => {
    const nuevaImagen = prompt('Ingresa la ruta de la imagen (ej: /assets/Noticias/imagen.jpg):');
    if (nuevaImagen && nuevaImagen.trim()) {
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, nuevaImagen.trim()]
      }));
    }
  };

  const handleRemoveImagen = (index) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateImagen = (index, nuevaRuta) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.map((img, i) => i === index ? nuevaRuta : img)
    }));
  };

  // Manejar enlaces oficiales
  const handleAddEnlace = () => {
    setFormData(prev => ({
      ...prev,
      enlacesOficiales: [...prev.enlacesOficiales, { titulo: '', url: '' }]
    }));
  };

  const handleRemoveEnlace = (index) => {
    setFormData(prev => ({
      ...prev,
      enlacesOficiales: prev.enlacesOficiales.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateEnlace = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      enlacesOficiales: prev.enlacesOficiales.map((enlace, i) => 
        i === index ? { ...enlace, [field]: value } : enlace
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.titulo.trim()) {
      alert('El título es requerido');
      return;
    }

    if (!formData.resumen.trim()) {
      alert('El resumen es requerido');
      return;
    }

    if (!formData.contenido.trim()) {
      alert('El contenido es requerido');
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para guardar
      const dataToSave = {
        titulo: formData.titulo.trim(),
        resumen: formData.resumen.trim(),
        slug: formData.slug || generateSlug(formData.titulo),
        imagenes: formData.imagenes.filter(img => img.trim()),
        contenido: formData.contenido.trim(),
        enlacesOficiales: formData.enlacesOficiales.filter(
          enlace => enlace.titulo.trim() && enlace.url.trim()
        )
      };

      if (id) {
        // Actualizar
        await updateNoticia(id, dataToSave);
        alert('Noticia actualizada exitosamente');
      } else {
        // Crear
        await createNoticia(dataToSave);
        alert('Noticia creada exitosamente');
      }

      navigate('/noticias');
    } catch (error) {
      console.error('Error al guardar noticia:', error);
      alert('Error al guardar la noticia');
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
        <button
          onClick={() => navigate('/noticias')}
          className="text-primary-600 hover:text-primary-700 mb-4 flex items-center space-x-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver a noticias</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Editar Noticia' : 'Nueva Noticia'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Información Básica
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: Nueva PTAR inaugurada en Buga"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen <span className="text-red-500">*</span>
              </label>
              <textarea
                name="resumen"
                value={formData.resumen}
                onChange={handleChange}
                rows="3"
                className="input-field"
                placeholder="Resumen breve de la noticia (aparece en la lista)"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Este resumen aparecerá en la lista de noticias
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="input-field"
                placeholder="nueva-ptar-inaugurada-buga"
              />
              <p className="mt-1 text-xs text-gray-500">
                Se genera automáticamente del título
              </p>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Imágenes
          </h2>
          
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Instrucciones:</strong> Primero sube las imágenes a cPanel (File Manager o FTP), luego ingresa las rutas aquí.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Ejemplo: <code className="bg-blue-100 px-1 rounded">/assets/Noticias/imagen.jpg</code>
            </p>
          </div>

          <div className="space-y-3">
            {formData.imagenes.map((imagen, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg">
                <div className="flex-1">
                  <input
                    type="text"
                    value={imagen}
                    onChange={(e) => handleUpdateImagen(index, e.target.value)}
                    className="input-field"
                    placeholder="/assets/Noticias/imagen.jpg"
                  />
                  {imagen && (
                    <div className="mt-2">
                      <img
                        src={getAbsoluteUrl(imagen)}
                        alt={`Preview ${index + 1}`}
                        className="max-w-xs rounded-lg border border-gray-300"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        URL: <code className="bg-gray-100 px-1 rounded">{getAbsoluteUrl(imagen)}</code>
                      </p>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImagen(index)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddImagen}
              className="w-full btn-secondary"
            >
              + Agregar Imagen
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Contenido <span className="text-red-500">*</span>
          </h2>
          
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>Formato HTML:</strong> Puedes usar etiquetas HTML básicas como &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Ejemplo: <code className="bg-yellow-100 px-1 rounded">&lt;p&gt;Texto del párrafo&lt;/p&gt;</code>
            </p>
          </div>

          <textarea
            name="contenido"
            value={formData.contenido}
            onChange={handleChange}
            rows="15"
            className="input-field font-mono text-sm"
            placeholder="<p>Primer párrafo de la noticia...</p>&#10;&#10;<p>Segundo párrafo...</p>"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            El contenido se mostrará en la página de la noticia. Las imágenes se distribuirán automáticamente entre los párrafos.
          </p>
        </div>

        {/* Enlaces Oficiales */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Enlaces Oficiales
          </h2>

          <div className="space-y-3">
            {formData.enlacesOficiales.map((enlace, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Enlace
                    </label>
                    <input
                      type="text"
                      value={enlace.titulo}
                      onChange={(e) => handleUpdateEnlace(index, 'titulo', e.target.value)}
                      className="input-field"
                      placeholder="Ej: Leer más en El País"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={enlace.url}
                      onChange={(e) => handleUpdateEnlace(index, 'url', e.target.value)}
                      className="input-field"
                      placeholder="https://ejemplo.com/noticia"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEnlace(index)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Eliminar enlace
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddEnlace}
              className="w-full btn-secondary"
            >
              + Agregar Enlace Oficial
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/noticias')}
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
            {loading ? 'Guardando...' : id ? 'Actualizar Noticia' : 'Crear Noticia'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoticiaForm;

