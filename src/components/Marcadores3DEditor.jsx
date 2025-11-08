import { useState } from 'react';

function Marcadores3DEditor({ marcadores, onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMarcador, setNewMarcador] = useState({
    x: 0,
    y: 0,
    z: 0,
    label: [{ nombre: '' }]
  });

  const handleAddMarcador = () => {
    if (newMarcador.label[0].nombre.trim()) {
      const updated = [...marcadores, newMarcador];
      onChange(updated);
      setNewMarcador({
        x: 0,
        y: 0,
        z: 0,
        label: [{ nombre: '' }]
      });
      setShowAddForm(false);
    } else {
      alert('El nombre del label es requerido');
    }
  };

  const handleUpdateMarcador = (index, updatedMarcador) => {
    const updated = marcadores.map((m, i) => i === index ? updatedMarcador : m);
    onChange(updated);
    setEditingIndex(null);
  };

  const handleDeleteMarcador = (index) => {
    if (window.confirm('¿Eliminar este marcador?')) {
      const updated = marcadores.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  const handleAddLabel = (marcadorIndex, marcador) => {
    const updated = {
      ...marcador,
      label: [...marcador.label, { nombre: '' }]
    };
    handleUpdateMarcador(marcadorIndex, updated);
  };

  const handleUpdateLabel = (marcadorIndex, labelIndex, nombre) => {
    const marcador = marcadores[marcadorIndex];
    const updated = {
      ...marcador,
      label: marcador.label.map((l, i) => 
        i === labelIndex ? { nombre } : l
      )
    };
    handleUpdateMarcador(marcadorIndex, updated);
  };

  const handleDeleteLabel = (marcadorIndex, labelIndex) => {
    const marcador = marcadores[marcadorIndex];
    if (marcador.label.length === 1) {
      alert('Debe haber al menos un label');
      return;
    }
    const updated = {
      ...marcador,
      label: marcador.label.filter((_, i) => i !== labelIndex)
    };
    handleUpdateMarcador(marcadorIndex, updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-900">
          Marcadores 3D ({marcadores.length})
        </h4>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 text-sm font-medium bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          {showAddForm ? 'Cancelar' : '+ Agregar'}
        </button>
      </div>

      {/* Formulario para agregar nuevo marcador */}
      {showAddForm && (
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
          <h5 className="text-sm font-medium text-gray-900 mb-2">Nuevo Marcador</h5>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">X</label>
              <input
                type="number"
                step="0.001"
                value={newMarcador.x}
                onChange={(e) => setNewMarcador({ ...newMarcador, x: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Y</label>
              <input
                type="number"
                step="0.001"
                value={newMarcador.y}
                onChange={(e) => setNewMarcador({ ...newMarcador, y: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Z</label>
              <input
                type="number"
                step="0.001"
                value={newMarcador.z}
                onChange={(e) => setNewMarcador({ ...newMarcador, z: parseFloat(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                placeholder="0.0"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-xs text-gray-600 mb-1">Nombre del Label</label>
            <input
              type="text"
              value={newMarcador.label[0].nombre}
              onChange={(e) => setNewMarcador({
                ...newMarcador,
                label: [{ nombre: e.target.value }]
              })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="Ej: Obturador"
            />
          </div>
          <button
            type="button"
            onClick={handleAddMarcador}
            className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700"
          >
            Agregar
          </button>
        </div>
      )}

      {/* Lista de marcadores existentes */}
      {marcadores.length === 0 && !showAddForm && (
        <p className="text-xs text-gray-500 italic py-2">
          No hay marcadores configurados. Agrega uno para comenzar.
        </p>
      )}

      {marcadores.map((marcador, index) => (
        <div key={index} className="p-2 border border-gray-300 rounded-lg bg-white">
          {editingIndex === index ? (
            // Modo edición
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h5 className="text-sm font-medium text-gray-900">Marcador #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
              </div>

              {/* Coordenadas */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">X</label>
                  <input
                    type="number"
                    step="0.001"
                    value={marcador.x}
                    onChange={(e) => {
                      const updated = { ...marcador, x: parseFloat(e.target.value) || 0 };
                      handleUpdateMarcador(index, updated);
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Y</label>
                  <input
                    type="number"
                    step="0.001"
                    value={marcador.y}
                    onChange={(e) => {
                      const updated = { ...marcador, y: parseFloat(e.target.value) || 0 };
                      handleUpdateMarcador(index, updated);
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Z</label>
                  <input
                    type="number"
                    step="0.001"
                    value={marcador.z}
                    onChange={(e) => {
                      const updated = { ...marcador, z: parseFloat(e.target.value) || 0 };
                      handleUpdateMarcador(index, updated);
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Labels */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-gray-700">Labels</label>
                  <button
                    type="button"
                    onClick={() => handleAddLabel(index, marcador)}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    + Label
                  </button>
                </div>
                <div className="space-y-1">
                  {marcador.label.map((label, labelIndex) => (
                    <div key={labelIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={label.nombre}
                        onChange={(e) => handleUpdateLabel(index, labelIndex, e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                        placeholder="Nombre del label"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteLabel(index, labelIndex)}
                        className="text-red-600 hover:text-red-700 text-sm px-1"
                        disabled={marcador.label.length === 1}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => handleDeleteMarcador(index)}
                  className="px-3 py-1.5 text-sm font-medium bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            // Modo visualización - más compacto
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                  <span className="text-xs text-gray-500">
                    ({marcador.x.toFixed(2)}, {marcador.y.toFixed(2)}, {marcador.z.toFixed(2)})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {marcador.label.map((label, labelIndex) => (
                    <span
                      key={labelIndex}
                      className="inline-block px-1.5 py-0.5 text-xs bg-primary-100 text-primary-800 rounded"
                    >
                      {label.nombre}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingIndex(index)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
              >
                Editar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Marcadores3DEditor;

