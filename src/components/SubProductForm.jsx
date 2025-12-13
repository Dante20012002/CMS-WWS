import { useState, useEffect } from 'react';
import { useSubproductos } from '../hooks/useProducts';
import { useAliados } from '../hooks/useAliados';
import Marcadores3DEditor from './Marcadores3DEditor';
import ImagePathInput from './ImagePathInput';
import { getAbsoluteUrl } from '../config/site';

function SubProductForm({ productoDocId, subproducto, onClose }) {
  const { createSubproducto, updateSubproducto } = useSubproductos(productoDocId);
  const { aliados, loading: loadingAliados } = useAliados();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    descripcionLarga: '',
    imagen: '',
    slug: '',
    modelo3d: '',
    marcadores3d: [],
    qr: '',
    pdf: '',
    formUrl: '',
    marca: '', // Mantener para compatibilidad
    aliadoId: '' // Nuevo campo: ID del documento del aliado
  });

  useEffect(() => {
    if (subproducto) {
      setFormData({
        nombre: subproducto.nombre || '',
        descripcion: subproducto.descripcion || '',
        descripcionLarga: subproducto.descripcionLarga || '',
        imagen: subproducto.imagen || '',
        slug: subproducto.slug || '',
        modelo3d: subproducto.modelo3d || '',
        marcadores3d: subproducto.marcadores3d || [],
        qr: subproducto.qr || '',
        pdf: subproducto.pdf || '',
        formUrl: subproducto.formUrl || '',
        marca: subproducto.marca || '', // Mantener para compatibilidad
        aliadoId: subproducto.aliadoId || '' // Nuevo campo
      });
    }
  }, [subproducto]);

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
      ...(name === 'nombre' ? { slug: generateSlug(value) } : {})
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
    // Prevenir el comportamiento por defecto si viene de un evento
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // Importante: detener propagación
    }

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

      const dataToSave = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        descripcionLarga: formData.descripcionLarga.trim(),
        imagen: formData.imagen || '',
        slug: formData.slug || generateSlug(formData.nombre),
        modelo3d: formData.modelo3d || null,
        marcadores3d: formData.marcadores3d || [],
        qr: formData.qr || null,
        pdf: formData.pdf || null,
        formUrl: formData.formUrl || null,
        aliadoId: formData.aliadoId && formData.aliadoId.trim() ? formData.aliadoId.trim() : null,
        marca: formData.marca && formData.marca.trim() ? formData.marca.trim() : null // Mantener para compatibilidad
      };

      console.log('Guardando subproducto:', {
        isEdit: !!subproducto,
        docId: subproducto?.docId,
        productoDocId,
        dataToSave
      });

      if (subproducto && subproducto.docId) {
        await updateSubproducto(subproducto.docId, dataToSave);
        alert('SubProducto actualizado exitosamente');
      } else {
        await createSubproducto(dataToSave);
        alert('SubProducto creado exitosamente');
      }

      // Esperar un momento para que Firestore se actualice
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onClose();
    } catch (error) {
      console.error('Error al guardar subproducto:', error);
      console.error('Detalles del error:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      alert(`Error al guardar el subproducto: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-primary-200 rounded-lg p-6 bg-primary-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {subproducto ? 'Editar SubProducto' : 'Nuevo SubProducto'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Información Básica */}
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
            placeholder="Nombre del subproducto"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Corta <span className="text-red-500">*</span>
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="2"
            className="input-field"
            placeholder="Descripción breve"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Larga
          </label>
          <textarea
            name="descripcionLarga"
            value={formData.descripcionLarga}
            onChange={handleChange}
            rows="3"
            className="input-field"
            placeholder="Descripción detallada"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="input-field"
              placeholder="slug-del-subproducto"
            />
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
              Selecciona un aliado para asociar este subproducto. El logo del aliado aparecerá en la página del subproducto.
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

        {/* Multimedia */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Multimedia</h4>
          
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
            <p className="text-blue-800">
              💡 Sube primero los archivos a cPanel (File Manager o FTP), luego ingresa las rutas aquí.
            </p>
            <p className="text-blue-600 mt-1">
              Ejemplos: <code className="bg-blue-100 px-1 rounded">/assets/Productos/imagen.jpg</code>
              <code className="bg-blue-100 px-1 rounded ml-1">/assets/PDF/subproducto.pdf</code>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruta de Imagen
              </label>
              <input
                type="text"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                className="input-field"
                placeholder="/assets/Productos/subproducto.jpg"
              />
              {formData.imagen && (
                <div className="mt-2">
                  <img
                    src={formData.imagen}
                    alt="Preview"
                    className="max-w-xs rounded-lg border border-gray-300"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruta Modelo 3D
              </label>
              <input
                type="text"
                name="modelo3d"
                value={formData.modelo3d}
                onChange={handleChange}
                className="input-field"
                placeholder="/models/subproducto.glb"
              />
              
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ruta PDF
                </label>
                <input
                  type="text"
                  name="pdf"
                  value={formData.pdf}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="/assets/PDF/subproducto.pdf"
                />
                {formData.pdf && formData.pdf.startsWith('/') && (
                  <div className="mt-1">
                    <a
                      href={formData.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-600 hover:text-primary-700 underline"
                    >
                      🔗 Ver PDF
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ruta QR
                </label>
                <input
                  type="text"
                  name="qr"
                  value={formData.qr}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="/assets/QR/qr.png"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Formulario
              </label>
              <input
                type="text"
                name="formUrl"
                value={formData.formUrl}
                onChange={handleChange}
                className="input-field"
                placeholder="https://forms.office.com/..."
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : subproducto ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubProductForm;

