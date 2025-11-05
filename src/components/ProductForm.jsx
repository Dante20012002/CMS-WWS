import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import SubProductList from './SubProductList';

const CATEGORIAS = [
  'CONTROL DE CAUDAL',
  'DRAGADO Y PRETRATAMIENTO',
  'AGITACIÓN Y FLOCULACIÓN',
  'TRATAMIENTO SECUNDARIO',
  'SEDIMENTACIÓN',
  'TRATAMIENTO TERCIARIO',
  'TRATAMIENTO DE LODOS Y TRANSPORTADORES',
  'ADECUACIONES ESTRUCTURALES E HIDRÁULICAS',
  'SERVICIOS'
];

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProducto, createProducto, updateProducto } = useProducts();
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!id);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    descripcionLarga: '',
    imagen: '',
    imagenes: [],
    slug: '',
    categoria: CATEGORIAS[0],
    modelo3d: '',
    marcadores3d: [],
    pdf: '',
    qr: '',
    formUrl: '',
    marca: ''
  });

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
        categoria: producto.categoria || CATEGORIAS[0],
        modelo3d: producto.modelo3d || '',
        marcadores3d: producto.marcadores3d || [],
        pdf: producto.pdf || '',
        qr: producto.qr || '',
        formUrl: producto.formUrl || '',
        marca: producto.marca || ''
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

  // Ya no necesitamos handleImageUpload - usamos campos de texto

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
        marca: formData.marca || null
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
              >
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
                Marca
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: XS Solutions"
              />
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
              Ejemplo: <code className="bg-blue-100 px-1 rounded">/assets/Productos/imagen.jpg</code>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruta de Imagen Principal
              </label>
              <input
                type="text"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                className="input-field"
                placeholder="/assets/Productos/imagen.jpg"
              />
              {formData.imagen && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <img
                    src={formData.imagen}
                    alt="Preview"
                    className="max-w-xs rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div style={{ display: 'none' }} className="text-xs text-red-500 mt-2">
                    ⚠️ No se pudo cargar la imagen. Verifica la ruta.
                  </div>
                </div>
              )}
            </div>

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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de PDF
              </label>
              <input
                type="text"
                name="pdf"
                value={formData.pdf}
                onChange={handleChange}
                className="input-field"
                placeholder="https://drive.google.com/uc?export=download&id=..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Opcional. URL completa del PDF (puede ser Google Drive)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruta de Imagen QR
              </label>
              <input
                type="text"
                name="qr"
                value={formData.qr}
                onChange={handleChange}
                className="input-field"
                placeholder="/assets/QR/producto-qr.png"
              />
              {formData.qr && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Preview QR:</p>
                  <img
                    src={formData.qr}
                    alt="QR Preview"
                    className="max-w-[150px] rounded-lg border border-gray-300"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

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

