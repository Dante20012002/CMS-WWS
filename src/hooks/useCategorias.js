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

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener siguiente ID autoincremental
  const getNextId = async () => {
    const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
    const ids = categoriasSnapshot.docs.map(doc => doc.data().id || 0);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  };

  // Cargar todas las categorías
  const loadCategorias = async () => {
    try {
      setLoading(true);
      // Ordenar por ID ascendente
      const q = query(collection(db, 'categorias'), orderBy('id', 'asc'));
      const snapshot = await getDocs(q);
      
      const categoriasData = snapshot.docs.map(docSnap => ({
        docId: docSnap.id,
        ...docSnap.data()
      }));

      setCategorias(categoriasData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener una categoría por su docId
  const getCategoria = async (docId) => {
    try {
      const docRef = doc(db, 'categorias', docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Categoría no encontrada');
      }

      return {
        docId: docSnap.id,
        ...docSnap.data()
      };
    } catch (err) {
      console.error('Error al obtener categoría:', err);
      throw err;
    }
  };

  // Crear nueva categoría
  const createCategoria = async (categoriaData) => {
    try {
      const nextId = await getNextId();
      
      const newCategoria = {
        ...categoriaData,
        id: nextId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'categorias'), newCategoria);
      
      await loadCategorias();
      return docRef.id;
    } catch (err) {
      console.error('Error al crear categoría:', err);
      throw err;
    }
  };

  // Actualizar categoría
  const updateCategoria = async (docId, categoriaData) => {
    try {
      const docRef = doc(db, 'categorias', docId);
      
      await updateDoc(docRef, {
        ...categoriaData,
        updatedAt: serverTimestamp()
      });

      await loadCategorias();
    } catch (err) {
      console.error('Error al actualizar categoría:', err);
      throw err;
    }
  };

  // Eliminar categoría
  const deleteCategoria = async (docId) => {
    try {
      await deleteDoc(doc(db, 'categorias', docId));
      await loadCategorias();
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      throw err;
    }
  };

  // Cargar categorías al montar el hook
  useEffect(() => {
    loadCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,
    loadCategorias,
    getCategoria,
    createCategoria,
    updateCategoria,
    deleteCategoria
  };
}

