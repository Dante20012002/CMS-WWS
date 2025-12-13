import { useState, useEffect } from 'react';
import { getAbsoluteUrl } from '../config/site';

function ImagePathInput({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = '/assets/imagen.jpg',
  required = false,
  helpText = 'Ruta del archivo en cPanel (ej: /assets/imagen.jpg)'
}) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageExists, setImageExists] = useState(null);
  const [checking, setChecking] = useState(false);

  // Convertir ruta relativa a URL absoluta para preview
  useEffect(() => {
    if (value && value.trim()) {
      const absoluteUrl = getAbsoluteUrl(value.trim());
      setPreviewUrl(absoluteUrl);
      validateImage(absoluteUrl);
    } else {
      setPreviewUrl('');
      setImageExists(null);
    }
  }, [value]);

  const validateImage = (url) => {
    setChecking(true);
    setImageExists(null);
    
    // Usar Image object para validar
    const img = new Image();
    img.onload = () => {
      setImageExists(true);
      setChecking(false);
    };
    img.onerror = () => {
      setImageExists(false);
      setChecking(false);
    };
    img.src = url;
  };

  const handleChange = (e) => {
    try {
      const newValue = e.target.value;
      // Siempre pasar el valor directamente, no el evento
      if (typeof onChange === 'function') {
        onChange(newValue);
      }
    } catch (error) {
      console.error('Error en handleChange de ImagePathInput:', error);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          className="input-field flex-1"
          placeholder={placeholder}
          required={required}
        />
        {previewUrl && (
          <button
            type="button"
            onClick={() => window.open(previewUrl, '_blank')}
            className="btn-secondary whitespace-nowrap"
            title="Abrir imagen en nueva pestaña"
          >
            🔗 Ver
          </button>
        )}
      </div>
      
      {helpText && (
        <p className="mt-1 text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {/* Preview de imagen */}
      {previewUrl && (
        <div className="mt-3">
          <div className="relative inline-block">
            {checking && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            )}
            <img
              src={previewUrl}
              alt="Preview"
              className={`max-w-xs rounded-lg border-2 ${
                imageExists === false 
                  ? 'border-red-300 opacity-50' 
                  : imageExists === true 
                    ? 'border-green-300' 
                    : 'border-gray-300'
              }`}
              onLoad={() => {
                if (!checking) setImageExists(true);
              }}
              onError={() => {
                setImageExists(false);
              }}
            />
            {imageExists === false && !checking && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                ⚠️ No encontrada
              </div>
            )}
            {imageExists === true && !checking && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                ✓ Válida
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            URL: <code className="bg-gray-100 px-1 rounded">{previewUrl}</code>
          </p>
        </div>
      )}
    </div>
  );
}

export default ImagePathInput;

