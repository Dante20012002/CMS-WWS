import { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const EMPRESA_DOC_ID = 'empresa_info'; // ID único del documento

export function useEmpresa() {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar información de la empresa
  const loadEmpresa = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'empresa', EMPRESA_DOC_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setEmpresa({
          docId: docSnap.id,
          ...docSnap.data()
        });
      } else {
        // Si no existe, crear con valores por defecto
        const defaultData = {
          sobreNosotros: {
            titulo: 'Sobre Nosotros',
            texto: '',
            imagen: ''
          },
          mision: {
            titulo: 'MISIÓN',
            texto: ''
          },
          vision: {
            titulo: 'VISIÓN',
            texto: ''
          },
          objetivos: {
            titulo: 'NUESTRO OBJETIVO',
            texto: '',
            imagen: ''
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(docRef, defaultData);
        setEmpresa({
          docId: EMPRESA_DOC_ID,
          ...defaultData
        });
      }
      setError(null);
    } catch (err) {
      console.error('Error al cargar información de empresa:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar información de la empresa
  const updateEmpresa = async (data) => {
    try {
      const docRef = doc(db, 'empresa', EMPRESA_DOC_ID);
      
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Recargar datos
      await loadEmpresa();
    } catch (err) {
      console.error('Error al actualizar información de empresa:', err);
      throw err;
    }
  };

  // Cargar al montar
  useEffect(() => {
    loadEmpresa();
  }, []);

  return {
    empresa,
    loading,
    error,
    loadEmpresa,
    updateEmpresa
  };
}

