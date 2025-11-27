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

export function useNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener siguiente ID autoincremental
  const getNextId = async () => {
    const noticiasSnapshot = await getDocs(collection(db, 'noticias'));
    const ids = noticiasSnapshot.docs.map(doc => doc.data().id || 0);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  };

  // Cargar todas las noticias
  const loadNoticias = async () => {
    try {
      setLoading(true);
      // Ordenar por ID descendente (más recientes primero)
      const q = query(collection(db, 'noticias'), orderBy('id', 'desc'));
      const snapshot = await getDocs(q);
      
      const noticiasData = snapshot.docs.map(docSnap => ({
        docId: docSnap.id,
        ...docSnap.data()
      }));

      setNoticias(noticiasData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar noticias:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener una noticia por su docId
  const getNoticia = async (docId) => {
    try {
      const docRef = doc(db, 'noticias', docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Noticia no encontrada');
      }

      return {
        docId: docSnap.id,
        ...docSnap.data()
      };
    } catch (err) {
      console.error('Error al obtener noticia:', err);
      throw err;
    }
  };

  // Crear nueva noticia
  const createNoticia = async (noticiaData) => {
    try {
      const nextId = await getNextId();
      
      const newNoticia = {
        ...noticiaData,
        id: nextId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'noticias'), newNoticia);
      
      await loadNoticias();
      return docRef.id;
    } catch (err) {
      console.error('Error al crear noticia:', err);
      throw err;
    }
  };

  // Actualizar noticia
  const updateNoticia = async (docId, noticiaData) => {
    try {
      const docRef = doc(db, 'noticias', docId);
      
      await updateDoc(docRef, {
        ...noticiaData,
        updatedAt: serverTimestamp()
      });

      await loadNoticias();
    } catch (err) {
      console.error('Error al actualizar noticia:', err);
      throw err;
    }
  };

  // Eliminar noticia
  const deleteNoticia = async (docId) => {
    try {
      await deleteDoc(doc(db, 'noticias', docId));
      await loadNoticias();
    } catch (err) {
      console.error('Error al eliminar noticia:', err);
      throw err;
    }
  };

  // Cargar noticias al montar el hook
  useEffect(() => {
    loadNoticias();
  }, []);

  return {
    noticias,
    loading,
    error,
    loadNoticias,
    getNoticia,
    createNoticia,
    updateNoticia,
    deleteNoticia
  };
}

