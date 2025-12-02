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

export function useProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener siguiente ID autoincremental
  const getNextId = async () => {
    const proyectosSnapshot = await getDocs(collection(db, 'proyectos'));
    const ids = proyectosSnapshot.docs.map(doc => doc.data().id || 0);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  };

  // Cargar todos los proyectos
  const loadProyectos = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'proyectos'), orderBy('id', 'asc'));
      const snapshot = await getDocs(q);
      
      const proyectosData = snapshot.docs.map(docSnap => ({
        docId: docSnap.id,
        ...docSnap.data()
      }));

      setProyectos(proyectosData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar proyectos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener un proyecto por su docId
  const getProyecto = async (docId) => {
    try {
      const docRef = doc(db, 'proyectos', docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Proyecto no encontrado');
      }

      return {
        docId: docSnap.id,
        ...docSnap.data()
      };
    } catch (err) {
      console.error('Error al obtener proyecto:', err);
      throw err;
    }
  };

  // Crear nuevo proyecto
  const createProyecto = async (proyectoData) => {
    try {
      const nextId = await getNextId();
      
      const newProyecto = {
        ...proyectoData,
        id: nextId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'proyectos'), newProyecto);
      
      await loadProyectos();
      return docRef.id;
    } catch (err) {
      console.error('Error al crear proyecto:', err);
      throw err;
    }
  };

  // Actualizar proyecto
  const updateProyecto = async (docId, proyectoData) => {
    try {
      const docRef = doc(db, 'proyectos', docId);
      
      await updateDoc(docRef, {
        ...proyectoData,
        updatedAt: serverTimestamp()
      });

      await loadProyectos();
    } catch (err) {
      console.error('Error al actualizar proyecto:', err);
      throw err;
    }
  };

  // Eliminar proyecto
  const deleteProyecto = async (docId) => {
    try {
      await deleteDoc(doc(db, 'proyectos', docId));
      await loadProyectos();
    } catch (err) {
      console.error('Error al eliminar proyecto:', err);
      throw err;
    }
  };

  // Cargar proyectos al montar el hook
  useEffect(() => {
    loadProyectos();
  }, []);

  return {
    proyectos,
    loading,
    error,
    loadProyectos,
    getProyecto,
    createProyecto,
    updateProyecto,
    deleteProyecto
  };
}


