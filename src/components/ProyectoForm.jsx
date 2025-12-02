import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProyectos } from '../hooks/useProyectos';
import ImagePathInput from './ImagePathInput';

const TIPOS_PROYECTO = [
  { value: 'instalacion', label: 'Instalación' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'consultoria', label: 'Consultoría' },
  { value: 'venta', label: 'Venta' }
];

function ProyectoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProyecto, createProyecto, updateProyecto } = useProyectos();
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!id);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'instalacion',
    ubicacion: {
      lat: 0,
      lng: 0,
      ciudad: '',
      departamento: ''
    },
    fecha: '',
    detalles: '',
    capacidad: '',
    historia: '',
    imagenPrincipal: '',
    imagen30proyectos: [],
    imagenesEquipos: [],
    equipos: [],
    resumen: '',
    linkNoticia: ''
  });

  // Cargar proyecto si estamos editando
  useEffect(() => {
    if (id) {
      loadProyecto();
    }
  }, [id]);

  const loadProyecto = async () => {
    try {
      setLoadingData(true);
      const proyecto = await getProyecto(id);
      setFormData({
        nombre: proyecto.nombre || '',
        descripcion: proyecto.descripcion || '',
        tipo: proyecto.tipo || 'instalacion',
        ubicacion: proyecto.ubicacion || {
          lat: 0,
          lng: 0,
          ciudad: '',
          departamento: ''
        },
        fecha: proyecto.fecha || '',
        detalles: proyecto.detalles || '',
        capacidad: proyecto.capacidad || '',
        historia: proyecto.historia || '',
        imagenPrincipal: proyecto.imagenPrincipal || '',
        imagen30proyectos: proyecto.imagen30proyectos || [],
        imagenesEquipos: proyecto.imagenesEquipos || [],
        equipos: proyecto.equipos || [],
        resumen: proyecto.resumen || '',
        linkNoticia: proyecto.linkNoticia || ''
      });
    } catch (error) {
      console.error('Error al cargar proyecto:', error);
      alert('Error al cargar el proyecto');
      navigate('/proyectos');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUbicacionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      ubicacion: {
        ...prev.ubicacion,
        [field]: field === 'lat' || field === 'lng' ? parseFloat(value) || 0 : value
      }
    }));
  };

  // Manejar imágenes 30 proyectos
  const handleAddImagen30 = () => {
    setFormData(prev => ({
      ...prev,
      imagen30proyectos: [...prev.imagen30proyectos, '']
    }));
  };

  const handleUpdateImagen30 = (index, value) => {
    setFormData(prev => ({
      ...prev,
      imagen30proyectos: prev.imagen30proyectos.map((img, i) => i === index ? value : img)
    }));
  };

  const handleRemoveImagen30 = (index) => {
    setFormData(prev => ({
      ...prev,
      imagen30proyectos: prev.imagen30proyectos.filter((_, i) => i !== index)
    }));
  };

  // Manejar imágenes equipos
  const handleAddImagenEquipo = () => {
    setFormData(prev => ({
      ...prev,
      imagenesEquipos: [...prev.imagenesEquipos, '']
    }));
  };

  const handleUpdateImagenEquipo = (index, value) => {
    setFormData(prev => ({
      ...prev,
      imagenesEquipos: prev.imagenesEquipos.map((img, i) => i === index ? value : img)
    }));
  };

  const handleRemoveImagenEquipo = (index) => {
    setFormData(prev => ({
      ...prev,
      imagenesEquipos: prev.imagenesEquipos.filter((_, i) => i !== index)
    }));
  };

  // Manejar equipos
  const handleAddEquipo = () => {
    setFormData(prev => ({
      ...prev,
      equipos: [...prev.equipos, '']
    }));
  };

  const handleUpdateEquipo = (index, value) => {
    setFormData(prev => ({
      ...prev,
      equipos: prev.equipos.map((eq, i) => i === index ? value : eq)
    }));
  };

  const handleRemoveEquipo = (index) => {
    setFormData(prev => ({
      ...prev,
      equipos: prev.equipos.filter((_, i) => i !== index)
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

    if (!formData.ubicacion.ciudad.trim()) {
      alert('La ciudad es requerida');
      return;
    }

    if (!formData.ubicacion.departamento.trim()) {
      alert('El departamento es requerido');
      return;
    }

    if (formData.ubicacion.lat === 0 && formData.ubicacion.lng === 0) {
      alert('Las coordenadas son requeridas');
      return;
    }

    try {
      setLoading(true);

      // Preparar datos para guardar
      const dataToSave = {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        tipo: formData.tipo,
        ubicacion: {
          lat: formData.ubicacion.lat,
          lng: formData.ubicacion.lng,
          ciudad: formData.ubicacion.ciudad.trim(),
          departamento: formData.ubicacion.departamento.trim()
        },
        fecha: formData.fecha.trim(),
        detalles: formData.detalles.trim(),
        capacidad: formData.capacidad.trim(),
        historia: formData.historia.trim() || null,
        imagenPrincipal: formData.imagenPrincipal.trim() || null,
        imagen30proyectos: formData.imagen30proyectos.filter(img => img.trim()),
        imagenesEquipos: formData.imagenesEquipos.filter(img => img.trim()),
        equipos: formData.equipos.filter(eq => eq.trim()),
        resumen: formData.resumen.trim() || null,
        linkNoticia: formData.linkNoticia.trim() || null
      };

      if (id) {
        await updateProyecto(id, dataToSave);
        alert('Proyecto actualizado exitosamente');
      } else {
        await createProyecto(dataToSave);
        alert('Proyecto creado exitosamente');
      }
      navigate('/proyectos');
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      alert('Error al guardar el proyecto');
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h1>
          <p className="text-gray-600">
            {id ? 'Modifica la información del proyecto' : 'Completa la información del nuevo proyecto'}
          </p>
        </div>
        <button
          onClick={() => navigate('/proyectos')}
          className="btn-secondary"
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: PTAR Yumbo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                className="input-field"
                placeholder="Descripción breve del proyecto"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {TIPOS_PROYECTO.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="text"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ej: 2022 o 2015-2025"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detalles
              </label>
              <textarea
                name="detalles"
                value={formData.detalles}
                onChange={handleChange}
                rows="3"
                className="input-field"
                placeholder="Detalles técnicos del proyecto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad
              </label>
              <input
                type="text"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: 543 l/s o 30.000 m³/día"
              />
            </div>
          </div>
        </div>

        {/* Ubicación y Coordenadas */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ubicación y Coordenadas</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ubicacion.ciudad}
                  onChange={(e) => handleUbicacionChange('ciudad', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Yumbo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ubicacion.departamento}
                  onChange={(e) => handleUbicacionChange('departamento', e.target.value)}
                  className="input-field"
                  placeholder="Ej: Valle del Cauca"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitud <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.ubicacion.lat}
                  onChange={(e) => handleUbicacionChange('lat', e.target.value)}
                  className="input-field"
                  placeholder="Ej: 3.5833"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Coordenada de latitud para el mapa
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitud <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.ubicacion.lng}
                  onChange={(e) => handleUbicacionChange('lng', e.target.value)}
                  className="input-field"
                  placeholder="Ej: -76.5"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Coordenada de longitud para el mapa
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Consejo:</strong> Puedes obtener las coordenadas desde Google Maps haciendo clic derecho en el lugar y seleccionando las coordenadas.
              </p>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Imágenes</h2>
          <div className="space-y-4">
            <ImagePathInput
              label="Imagen Principal"
              value={formData.imagenPrincipal}
              onChange={(value) => setFormData(prev => ({ ...prev, imagenPrincipal: value }))}
              placeholder="/assets/BARRANQUILLA 1.jpg"
              previewType="image"
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Imágenes para "30 Proyectos"
                </label>
                <button
                  type="button"
                  onClick={handleAddImagen30}
                  className="text-sm btn-primary"
                >
                  + Agregar Imagen
                </button>
              </div>
              {formData.imagen30proyectos.map((imagen, index) => (
                <div key={index} className="mb-2">
                  <ImagePathInput
                    label={`Imagen ${index + 1}`}
                    value={imagen}
                    onChange={(value) => handleUpdateImagen30(index, value)}
                    placeholder="/assets/BARRANQUILLA 2.JPG"
                    previewType="image"
                    onRemove={() => handleRemoveImagen30(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipos */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Equipos Utilizados</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Lista de Equipos
                </label>
                <button
                  type="button"
                  onClick={handleAddEquipo}
                  className="text-sm btn-primary"
                >
                  + Agregar Equipo
                </button>
              </div>
              {formData.equipos.map((equipo, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={equipo}
                    onChange={(e) => handleUpdateEquipo(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="Ej: Sedimentador"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveEquipo(index)}
                    className="btn-danger text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Imágenes de Equipos
                </label>
                <button
                  type="button"
                  onClick={handleAddImagenEquipo}
                  className="text-sm btn-primary"
                >
                  + Agregar Imagen
                </button>
              </div>
              {formData.imagenesEquipos.map((imagen, index) => (
                <div key={index} className="mb-2">
                  <ImagePathInput
                    label={`Imagen Equipo ${index + 1}`}
                    value={imagen}
                    onChange={(value) => handleUpdateImagenEquipo(index, value)}
                    placeholder="/assets/Yumbo 1.webp"
                    previewType="image"
                    onRemove={() => handleRemoveImagenEquipo(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Información Adicional</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Historia
              </label>
              <textarea
                name="historia"
                value={formData.historia}
                onChange={handleChange}
                rows="6"
                className="input-field"
                placeholder="Historia detallada del proyecto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen
              </label>
              <textarea
                name="resumen"
                value={formData.resumen}
                onChange={handleChange}
                rows="3"
                className="input-field"
                placeholder="Resumen breve del proyecto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link de Noticia
              </label>
              <input
                type="url"
                name="linkNoticia"
                value={formData.linkNoticia}
                onChange={handleChange}
                className="input-field"
                placeholder="https://www.elheraldo.co/..."
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/proyectos')}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : id ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProyectoForm;


