import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

function ImageUpload({ onUploadComplete, folder = 'productos', buttonText = 'Subir Imagen' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Subir a Firebase Storage
    try {
      setUploading(true);
      
      // Generar nombre único
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      // Subir archivo
      await uploadBytes(storageRef, file);

      // Obtener URL
      const downloadURL = await getDownloadURL(storageRef);

      // Notificar al padre
      if (onUploadComplete) {
        onUploadComplete(downloadURL);
      }

      alert('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen. Por favor intenta de nuevo.');
    } finally {
      setUploading(false);
      setPreview(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="btn-primary inline-block cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        {uploading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Subiendo...
          </span>
        ) : (
          buttonText
        )}
      </label>

      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs rounded-lg border border-gray-300"
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;

