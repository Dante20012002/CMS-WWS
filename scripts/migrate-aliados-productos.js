import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';

// Configuración Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('🔧 Configurando Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateAliadosProductos() {
  console.log('🚀 Iniciando migración de aliados en productos y subproductos...\n');
  
  try {
    // 1. Obtener todos los aliados para encontrar "X2 Solutions"
    console.log('📋 Obteniendo aliados...');
    const aliadosSnapshot = await getDocs(query(collection(db, 'aliados'), orderBy('id', 'asc')));
    const aliados = aliadosSnapshot.docs.map(docSnap => ({
      docId: docSnap.id,
      ...docSnap.data()
    }));
    
    // Buscar "X2 Solutions" (puede estar como "X2 Solutions" o "XS Solutions")
    const aliadoX2Solutions = aliados.find(a => 
      a.nombre.toLowerCase().includes('x2 solutions') || 
      a.nombre.toLowerCase().includes('xs solutions') ||
      a.nombre === 'X2 Solutions' ||
      a.nombre === 'XS Solutions'
    );
    
    if (!aliadoX2Solutions) {
      console.error('❌ No se encontró el aliado "X2 Solutions" en Firebase');
      console.log('Aliados disponibles:');
      aliados.forEach(a => console.log(`  - ${a.nombre} (docId: ${a.docId})`));
      return;
    }
    
    console.log(`✅ Aliado encontrado: "${aliadoX2Solutions.nombre}" (docId: ${aliadoX2Solutions.docId})\n`);
    
    // 2. Obtener todos los productos
    console.log('📦 Obteniendo productos...');
    const productosSnapshot = await getDocs(query(collection(db, 'productos'), orderBy('id', 'asc')));
    const productos = productosSnapshot.docs.map(docSnap => ({
      docId: docSnap.id,
      ...docSnap.data()
    }));
    
    console.log(`📊 Total productos encontrados: ${productos.length}\n`);
    
    let productosActualizados = 0;
    let subproductosActualizados = 0;
    let productosConAliado = 0;
    
    // 3. Procesar cada producto
    for (const producto of productos) {
      let productoNecesitaUpdate = false;
      const updates = {};
      
      // Verificar si el producto tiene "XS Solutions" o necesita actualización
      if (producto.marca && (
        producto.marca.toLowerCase().includes('xs solutions') ||
        producto.marca === 'XS Solutions' ||
        producto.marca.toLowerCase() === 'xs solutions'
      )) {
        updates.marca = aliadoX2Solutions.nombre; // Actualizar nombre a "X2 Solutions"
        updates.aliadoId = aliadoX2Solutions.docId; // Agregar aliadoId
        productoNecesitaUpdate = true;
        console.log(`🔄 Producto "${producto.nombre}" tiene marca "${producto.marca}" → actualizando a "${aliadoX2Solutions.nombre}" (aliadoId: ${aliadoX2Solutions.docId})`);
      } else if (producto.aliadoId) {
        // Si ya tiene un aliadoId, mantenerlo pero verificar si necesita actualizar marca
        if (producto.marca && (
          producto.marca.toLowerCase().includes('xs solutions') ||
          producto.marca === 'XS Solutions'
        )) {
          updates.marca = aliadoX2Solutions.nombre;
          productoNecesitaUpdate = true;
          console.log(`🔄 Producto "${producto.nombre}" tiene aliadoId pero marca incorrecta → actualizando marca`);
        } else {
          console.log(`ℹ️  Producto "${producto.nombre}" ya tiene aliadoId: ${producto.aliadoId}`);
        }
      } else if (!producto.aliadoId && producto.marca) {
        // Si tiene marca pero no aliadoId, buscar el aliado correspondiente
        const aliadoEncontrado = aliados.find(a => 
          a.nombre.toLowerCase() === producto.marca.toLowerCase()
        );
        if (aliadoEncontrado) {
          updates.aliadoId = aliadoEncontrado.docId;
          productoNecesitaUpdate = true;
          console.log(`🔗 Producto "${producto.nombre}" tiene marca "${producto.marca}" → agregando aliadoId: ${aliadoEncontrado.docId}`);
        }
      }
      
      // Determinar el aliadoId que se usará para los subproductos (antes de actualizar)
      const aliadoIdParaSubproductos = updates.aliadoId || producto.aliadoId || null;
      
      // Actualizar producto si es necesario
      if (productoNecesitaUpdate) {
        try {
          const productoRef = doc(db, 'productos', producto.docId);
          await updateDoc(productoRef, updates);
          productosActualizados++;
          console.log(`   ✅ Producto actualizado\n`);
        } catch (error) {
          console.error(`   ❌ Error al actualizar producto: ${error.message}\n`);
        }
      }
      
      // 4. Obtener subproductos del producto
      const subproductosSnapshot = await getDocs(
        collection(db, 'productos', producto.docId, 'subproductos')
      );
      
      if (subproductosSnapshot.size > 0) {
        
        if (aliadoIdParaSubproductos) {
          productosConAliado++;
          console.log(`📦 Producto "${producto.nombre}" tiene ${subproductosSnapshot.size} subproducto(s) y aliadoId: ${aliadoIdParaSubproductos}`);
        }
        
        // Actualizar cada subproducto
        for (const subDoc of subproductosSnapshot.docs) {
          const subData = subDoc.data();
          let subproductoNecesitaUpdate = false;
          const subUpdates = {};
          
          // Prioridad 1: Si el subproducto tiene "XS Solutions", cambiarlo a "X2 Solutions"
          if (subData.marca && (
            subData.marca.toLowerCase().includes('xs solutions') ||
            subData.marca === 'XS Solutions' ||
            subData.marca.toLowerCase() === 'xs solutions'
          )) {
            subUpdates.marca = aliadoX2Solutions.nombre;
            subUpdates.aliadoId = aliadoX2Solutions.docId;
            subproductoNecesitaUpdate = true;
            console.log(`   🔄 Subproducto "${subData.nombre}" tiene marca "XS Solutions" → actualizando a "${aliadoX2Solutions.nombre}"`);
          } 
          // Prioridad 2: Si el producto tiene aliadoId pero el subproducto no, asignarle el mismo
          else if (aliadoIdParaSubproductos && (!subData.aliadoId || subData.aliadoId !== aliadoIdParaSubproductos)) {
            subUpdates.aliadoId = aliadoIdParaSubproductos;
            // Si el producto tiene marca, también asignarla al subproducto si no tiene o es diferente
            const marcaProducto = updates.marca || producto.marca || (aliadoIdParaSubproductos === aliadoX2Solutions.docId ? aliadoX2Solutions.nombre : null);
            if (marcaProducto && (!subData.marca || subData.marca !== marcaProducto)) {
              subUpdates.marca = marcaProducto;
            }
            subproductoNecesitaUpdate = true;
            console.log(`   🔗 Subproducto "${subData.nombre}" → asignando aliadoId del producto (${aliadoIdParaSubproductos})`);
          }
          // Prioridad 3: Si el subproducto tiene marca pero no aliadoId, buscar el aliado
          else if (!subData.aliadoId && subData.marca) {
            const aliadoEncontrado = aliados.find(a => 
              a.nombre.toLowerCase() === subData.marca.toLowerCase()
            );
            if (aliadoEncontrado) {
              subUpdates.aliadoId = aliadoEncontrado.docId;
              subproductoNecesitaUpdate = true;
              console.log(`   🔗 Subproducto "${subData.nombre}" tiene marca "${subData.marca}" → agregando aliadoId`);
            }
          }
          
          if (subproductoNecesitaUpdate) {
            try {
              const subproductoRef = doc(db, 'productos', producto.docId, 'subproductos', subDoc.id);
              await updateDoc(subproductoRef, subUpdates);
              subproductosActualizados++;
              console.log(`      ✅ Subproducto actualizado`);
            } catch (error) {
              console.error(`      ❌ Error al actualizar subproducto: ${error.message}`);
            }
          }
        }
        
        if (subproductosSnapshot.size > 0) {
          console.log('');
        }
      }
    }
    
    console.log('═══════════════════════════════════════');
    console.log('🎉 Migración completada!');
    console.log(`✅ Productos actualizados: ${productosActualizados}`);
    console.log(`✅ Subproductos actualizados: ${subproductosActualizados}`);
    console.log(`📊 Productos con aliados asignados: ${productosConAliado}`);
    console.log(`📊 Total productos procesados: ${productos.length}`);
    console.log('═══════════════════════════════════════');
    
  } catch (error) {
    console.error('\n❌ Error fatal:', error);
    throw error;
  }
}

// Ejecutar migración
migrateAliadosProductos()
  .then(() => {
    console.log('\n✅ Script finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });

