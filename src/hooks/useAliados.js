import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export function useAliados() {
  const [aliados, setAliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener siguiente ID autoincremental
  const getNextId = async () => {
    const aliadosSnapshot = await getDocs(collection(db, 'aliados'));
    const ids = aliadosSnapshot.docs.map(doc => doc.data().id || 0);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  };

  // Cargar todos los aliados
  const loadAliados = async () => {
    try {
      setLoading(true);
      // Ordenar por ID ascendente
      const q = query(collection(db, 'aliados'), orderBy('id', 'asc'));
      const snapshot = await getDocs(q);
      
      const aliadosData = snapshot.docs.map(docSnap => ({
        docId: docSnap.id,
        ...docSnap.data()
      }));

      setAliados(aliadosData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar aliados:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener un aliado por su docId
  const getAliado = async (docId) => {
    try {
      const docRef = doc(db, 'aliados', docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Aliado no encontrado');
      }

      return {
        docId: docSnap.id,
        ...docSnap.data()
      };
    } catch (err) {
      console.error('Error al obtener aliado:', err);
      throw err;
    }
  };

  // Crear nuevo aliado
  const createAliado = async (aliadoData) => {
    try {
      const nextId = await getNextId();
      
      const newAliado = {
        ...aliadoData,
        id: nextId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'aliados'), newAliado);
      
      await loadAliados();
      return docRef.id;
    } catch (err) {
      console.error('Error al crear aliado:', err);
      throw err;
    }
  };

  // Actualizar aliado
  const updateAliado = async (docId, aliadoData) => {
    try {
      const docRef = doc(db, 'aliados', docId);
      
      await updateDoc(docRef, {
        ...aliadoData,
        updatedAt: serverTimestamp()
      });

      await loadAliados();
    } catch (err) {
      console.error('Error al actualizar aliado:', err);
      throw err;
    }
  };

  // Eliminar aliado
  const deleteAliado = async (docId) => {
    try {
      await deleteDoc(doc(db, 'aliados', docId));
      await loadAliados();
    } catch (err) {
      console.error('Error al eliminar aliado:', err);
      throw err;
    }
  };

  // Cargar aliados al montar el hook
  useEffect(() => {
    loadAliados();
  }, []);

  return {
    aliados,
    loading,
    error,
    loadAliados,
    getAliado,
    createAliado,
    updateAliado,
    deleteAliado
  };
}

