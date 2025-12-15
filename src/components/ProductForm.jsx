import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategorias } from '../hooks/useCategorias';
import { useAliados } from '../hooks/useAliados';
import SubProductList from './SubProductList';
import Marcadores3DEditor from './Marcadores3DEditor';
import ImagePathInput from './ImagePathInput';
import { getAbsoluteUrl } from '../config/site';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProducto, createProducto, updateProducto } = useProducts();
  const { categorias, loading: loadingCategorias } = useCategorias();
  const { aliados, loading: loadingAliados } = useAliados();
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!id);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    descripcionLarga: '',
    imagen: '',
    imagenes: [],
    slug: '',
    categoria: '',
    modelo3d: '',
    marcadores3d: [],
    pdf: '',
    qr: '',
    formUrl: '',
    marca: '', // Mantener para compatibilidad con datos existentes
    aliadoId: '' // Nuevo campo: ID del documento del aliado
  });

  // Establecer categoría por defecto cuando se carguen las categorías (solo si no hay producto cargado)
  useEffect(() => {
    if (categorias.length > 0 && !formData.categoria && !loadingData) {
      setFormData(prev => ({
        ...prev,
        categoria: categorias[0].nombre
      }));
    }
  }, [categorias, loadingData]);

  // Cargar producto si estamos editando
  useEffect(() => {
    if (id) {
      loadProducto();
    }
  }, [id]);

  const loadProducto = async () => {
    try {
      setLoadingData(true);
      const producto = await getProducto(id);
      setFormData({
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        descripcionLarga: producto.descripcionLarga || '',
        imagen: producto.imagen || '',
        imagenes: producto.imagenes || [],
        slug: producto.slug || '',
        categoria: producto.categoria || (categorias.length > 0 ? categorias[0].nombre : ''),
        modelo3d: producto.modelo3d || '',
        marcadores3d: producto.marcadores3d || [],
        pdf: producto.pdf || '',
        qr: producto.qr || '',
        formUrl: producto.formUrl || '',
        marca: producto.marca || '', // Mantener para compatibilidad
        aliadoId: producto.aliadoId || '' // Nuevo campo
      });
    } catch (error) {
      console.error('Error al cargar producto:', error);
      alert('Error al cargar el producto');
      navigate('/productos');
    } finally {
      setLoadingData(false);
    }
  };

  // Generar slug automáticamente del nombre
  const generateSlug = (nombre) => {
    return nombre
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
      // Auto-generar slug cuando cambia el nombre
      ...(name === 'nombre' ? { slug: generateSlug(value) } : {})
    }));
  };

  // Handlers específicos para ImagePathInput que reciben el valor directamente
  const handleImageChange = (value) => {
    setFormData(prev => ({
      ...prev,
      imagen: value
    }));
  };

  const handleQrChange = (value) => {
    setFormData(prev => ({
      ...prev,
      qr: value
    }));
  };

  // Ya no necesitamos handleImageUpload - usamos campos de texto

  const handleMarcadoresChange = (marcadores) => {
    setFormData(prev => ({
      ...prev,
      marcadores3d: marcadores
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      alert('El nombre es requerido');
      return;
    }

    if (!formData.descripcion.trim()) {
      alert('La descripción es requerida');
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para guardar (remover campos vacíos)
      const dataToSave = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        descripcionLarga: formData.descripcionLarga.trim(),
        imagen: formData.imagen || '',
        imagenes: formData.imagenes || [],
        slug: formData.slug || generateSlug(formData.nombre),
        categoria: formData.categoria,
        modelo3d: formData.modelo3d || null,
        marcadores3d: formData.marcadores3d || [],
        pdf: formData.pdf || null,
        qr: formData.qr || null,
        formUrl: formData.formUrl || null,
        aliadoId: formData.aliadoId && formData.aliadoId.trim() ? formData.aliadoId.trim() : null,
        marca: formData.marca && formData.marca.trim() ? formData.marca.trim() : null // Mantener para compatibilidad
      };

      if (id) {
        // Actualizar
        await updateProducto(id, dataToSave);
        alert('Producto actualizado exitosamente');
      } else {
        // Crear
        await createProducto(dataToSave);
        alert('Producto creado exitosamente');
      }

      navigate('/productos');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
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
          onClick={() => navigate('/productos')}
          className="text-primary-600 hover:text-primary-700 mb-4 flex items-center space-x-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver a productos</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Información Básica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: W-CPM COMPUERTA MURAL"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Corta <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="2"
                className="input-field"
                placeholder="Descripción breve del producto"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción Larga
              </label>
              <textarea
                name="descripcionLarga"
                value={formData.descripcionLarga}
                onChange={handleChange}
                rows="4"
                className="input-field"
                placeholder="Descripción detallada del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="input-field"
                required
                disabled={loadingCategorias || categorias.length === 0}
              >
                {loadingCategorias ? (
                  <option>Cargando categorías...</option>
                ) : categorias.length === 0 ? (
                  <option>No hay categorías disponibles</option>
                ) : (
                  categorias.map(cat => (
                    <option key={cat.docId} value={cat.nombre}>{cat.nombre}</option>
                  ))
                )}
              </select>
              {categorias.length === 0 && !loadingCategorias && (
                <p className="mt-1 text-xs text-yellow-600">
                  ⚠️ No hay categorías disponibles. Ve a "Categorías" para crear una.
                </p>
              )}
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
                placeholder="compuerta-mural"
              />
              <p className="mt-1 text-xs text-gray-500">
                Se genera automáticamente del nombre
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca / Aliado
              </label>
              <select
                name="aliadoId"
                value={formData.aliadoId || ''}
                onChange={(e) => {
                  const selectedAliadoId = e.target.value;
                  const selectedAliado = aliados.find(a => a.docId === selectedAliadoId);
                  setFormData(prev => ({
                    ...prev,
                    aliadoId: selectedAliadoId,
                    marca: selectedAliado ? selectedAliado.nombre : '' // Mantener para compatibilidad
                  }));
                }}
                className="input-field"
              >
                <option value="">Sin marca / Aliado</option>
                {loadingAliados ? (
                  <option disabled>Cargando aliados...</option>
                ) : (
                  aliados.map(aliado => (
                    <option key={aliado.docId} value={aliado.docId}>
                      {aliado.nombre}
                    </option>
                  ))
                )}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Selecciona un aliado para asociar este producto. El logo del aliado aparecerá en la página del producto.
              </p>
              {formData.aliadoId && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  {(() => {
                    const selectedAliado = aliados.find(a => a.docId === formData.aliadoId);
                    return selectedAliado ? (
                      <>
                        <p className="text-xs text-blue-800">
                          ✓ Aliado seleccionado: <strong>{selectedAliado.nombre}</strong>
                        </p>
                        {selectedAliado.logo && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-blue-600">Logo del aliado:</span>
                            <img 
                              src={getAbsoluteUrl(selectedAliado.logo)} 
                              alt={selectedAliado.nombre}
                              className="h-8 object-contain"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        )}
                      </>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Multimedia */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Multimedia
          </h2>
          
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Instrucciones:</strong> Primero sube los archivos a cPanel (File Manager o FTP), luego ingresa las rutas aquí.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Ejemplos: 
              <code className="bg-blue-100 px-1 rounded ml-1">/assets/Productos/imagen.jpg</code>
              <code className="bg-blue-100 px-1 rounded ml-1">/assets/PDF/producto.pdf</code>
              <code className="bg-blue-100 px-1 rounded ml-1">/models/producto.glb</code>
            </p>
          </div>

          <div className="space-y-6">
            <ImagePathInput
              label="Ruta de Imagen Principal"
              name="imagen"
              value={formData.imagen}
              onChange={handleImageChange}
              placeholder="/assets/Productos/imagen.jpg"
              helpText="Ruta del archivo en cPanel (ej: /assets/Productos/imagen.jpg)"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruta de Modelo 3D (.glb)
              </label>
              <input
                type="text"
                name="modelo3d"
                value={formData.modelo3d}
                onChange={handleChange}
                className="input-field"
                placeholder="/models/producto.glb"
              />
              <p className="mt-1 text-xs text-gray-500">
                Opcional. Ruta al archivo .glb del modelo 3D
              </p>
              
              {/* Editor de Marcadores 3D - Solo si hay modelo3d */}
              {formData.modelo3d && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <Marcadores3DEditor
                    marcadores={formData.marcadores3d || []}
                    onChange={handleMarcadoresChange}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    💡 Los marcadores 3D definen puntos interactivos en el modelo. Cada marcador tiene coordenadas (X, Y, Z) y labels (nombres de accesorios).
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruta de PDF
              </label>
              <input
                type="text"
                name="pdf"
                value={formData.pdf}
                onChange={handleChange}
                className="input-field"
                placeholder="/assets/PDF/producto.pdf"
              />
              <p className="mt-1 text-xs text-gray-500">
                Opcional. Ruta del archivo PDF en cPanel (ej: /assets/PDF/producto.pdf)
              </p>
              {formData.pdf && (
                <div className="mt-2">
                  <a
                    href={formData.pdf.startsWith('http://') || formData.pdf.startsWith('https://') 
                      ? formData.pdf 
                      : getAbsoluteUrl(formData.pdf)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-700 underline"
                  >
                    🔗 Ver PDF
                  </a>
                </div>
              )}
            </div>

            <ImagePathInput
              label="Ruta de Imagen QR"
              name="qr"
              value={formData.qr}
              onChange={handleQrChange}
              placeholder="/assets/QR/producto-qr.png"
              helpText="Ruta del archivo QR en cPanel (ej: /assets/QR/producto-qr.png)"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Formulario
              </label>
              <input
                type="text"
                name="formUrl"
                value={formData.formUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://forms.office.com/Pages/ResponsePage.aspx?id=..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Opcional. URL del formulario de Microsoft Forms
              </p>
            </div>
          </div>
        </div>

        {/* SubProductos (solo en edición) */}
        {id && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              SubProductos
            </h2>
            <SubProductList productoDocId={id} />
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/productos')}
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
            {loading ? 'Guardando...' : id ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;

