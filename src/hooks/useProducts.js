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

export function useProducts() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener siguiente ID autoincremental
  const getNextId = async () => {
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    const ids = productosSnapshot.docs.map(doc => doc.data().id || 0);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  };

  // Cargar todos los productos
  const loadProductos = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'productos'), orderBy('id', 'asc'));
      const snapshot = await getDocs(q);
      
      const productosData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          
          // Cargar subproductos
          const subproductosSnapshot = await getDocs(
            collection(db, 'productos', docSnap.id, 'subproductos')
          );
          
          const subproductos = subproductosSnapshot.docs.map(subDoc => ({
            docId: subDoc.id,
            ...subDoc.data()
          }));

          return {
            docId: docSnap.id,
            ...data,
            subproductos
          };
        })
      );

      setProductos(productosData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener un producto por su docId
  const getProducto = async (docId) => {
    try {
      const docRef = doc(db, 'productos', docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Producto no encontrado');
      }

      // Cargar subproductos
      const subproductosSnapshot = await getDocs(
        collection(db, 'productos', docId, 'subproductos')
      );
      
      const subproductos = subproductosSnapshot.docs.map(subDoc => ({
        docId: subDoc.id,
        ...subDoc.data()
      }));

      return {
        docId: docSnap.id,
        ...docSnap.data(),
        subproductos
      };
    } catch (err) {
      console.error('Error al obtener producto:', err);
      throw err;
    }
  };

  // Crear nuevo producto
  const createProducto = async (productoData) => {
    try {
      const nextId = await getNextId();
      
      const newProducto = {
        ...productoData,
        id: nextId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'productos'), newProducto);
      
      await loadProductos();
      return docRef.id;
    } catch (err) {
      console.error('Error al crear producto:', err);
      throw err;
    }
  };

  // Actualizar producto
  const updateProducto = async (docId, productoData) => {
    try {
      const docRef = doc(db, 'productos', docId);
      
      await updateDoc(docRef, {
        ...productoData,
        updatedAt: serverTimestamp()
      });

      await loadProductos();
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      throw err;
    }
  };

  // Eliminar producto
  const deleteProducto = async (docId) => {
    try {
      // Eliminar todos los subproductos primero
      const subproductosSnapshot = await getDocs(
        collection(db, 'productos', docId, 'subproductos')
      );
      
      await Promise.all(
        subproductosSnapshot.docs.map(subDoc => 
          deleteDoc(doc(db, 'productos', docId, 'subproductos', subDoc.id))
        )
      );

      // Eliminar el producto
      await deleteDoc(doc(db, 'productos', docId));
      
      await loadProductos();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      throw err;
    }
  };

  // Cargar productos al montar el hook
  useEffect(() => {
    loadProductos();
  }, []);

  return {
    productos,
    loading,
    error,
    loadProductos,
    getProducto,
    createProducto,
    updateProducto,
    deleteProducto
  };
}

// Hook para subproductos
export function useSubproductos(productoDocId) {
  const [subproductos, setSubproductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener siguiente ID autoincremental para subproductos
  const getNextSubId = async () => {
    const subproductosSnapshot = await getDocs(
      collection(db, 'productos', productoDocId, 'subproductos')
    );
    const ids = subproductosSnapshot.docs.map(doc => doc.data().id || '');
    const numericIds = ids
      .map(id => {
        const match = id.match(/\d+$/);
        return match ? parseInt(match[0]) : 0;
      })
      .filter(n => !isNaN(n));
    
    return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  };

  // Cargar subproductos
  const loadSubproductos = async () => {
    if (!productoDocId) {
      setSubproductos([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const snapshot = await getDocs(
        collection(db, 'productos', productoDocId, 'subproductos')
      );
      
      const subproductosData = snapshot.docs.map(doc => ({
        docId: doc.id,
        ...doc.data()
      }));

      setSubproductos(subproductosData);
    } catch (err) {
      console.error('Error al cargar subproductos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear subproducto
  const createSubproducto = async (subproductoData) => {
    try {
      const nextId = await getNextSubId();
      
      const newSubproducto = {
        ...subproductoData,
        id: `sub-${nextId}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(
        collection(db, 'productos', productoDocId, 'subproductos'),
        newSubproducto
      );
      
      await loadSubproductos();
    } catch (err) {
      console.error('Error al crear subproducto:', err);
      throw err;
    }
  };

  // Actualizar subproducto
  const updateSubproducto = async (subDocId, subproductoData) => {
    try {
      const docRef = doc(db, 'productos', productoDocId, 'subproductos', subDocId);
      
      await updateDoc(docRef, {
        ...subproductoData,
        updatedAt: serverTimestamp()
      });

      await loadSubproductos();
    } catch (err) {
      console.error('Error al actualizar subproducto:', err);
      throw err;
    }
  };

  // Eliminar subproducto
  const deleteSubproducto = async (subDocId) => {
    try {
      await deleteDoc(doc(db, 'productos', productoDocId, 'subproductos', subDocId));
      await loadSubproductos();
    } catch (err) {
      console.error('Error al eliminar subproducto:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadSubproductos();
  }, [productoDocId]);

  return {
    subproductos,
    loading,
    loadSubproductos,
    createSubproducto,
    updateSubproducto,
    deleteSubproducto
  };
}

