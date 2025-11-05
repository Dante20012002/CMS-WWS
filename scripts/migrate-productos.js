import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Leer archivo productos.ts y extraer el array
function loadProductos() {
  try {
    const productosPath = join(__dirname, '..', '..', 'proyecto_wws', 'src', 'data', 'productos.ts');
    console.log(`📂 Leyendo archivo: ${productosPath}`);
    
    const content = readFileSync(productosPath, 'utf-8');
    
    // Extraer el array de productos usando regex
    const match = content.match(/export const productos: Producto\[\] = (\[[\s\S]*?\]);/);
    
    if (!match) {
      throw new Error('No se pudo extraer el array de productos del archivo');
    }
    
    // Evaluar el array (cuidado: esto es solo para desarrollo)
    const productosStr = match[1];
    const productos = eval(productosStr);
    
    console.log(`✅ ${productos.length} productos cargados del archivo\n`);
    return productos;
  } catch (error) {
    console.error('❌ Error al leer productos.ts:', error.message);
    throw error;
  }
}

// Función para limpiar datos (eliminar undefined, validar tipos, convertir a estructura válida para Firestore)
function cleanForFirestore(obj) {
  // Manejar null y undefined
  if (obj === null || obj === undefined) {
    return null;
  }
  
  // Manejar números inválidos
  if (typeof obj === 'number') {
    if (isNaN(obj) || !isFinite(obj)) {
      return null;
    }
    return obj;
  }
  
  // Manejar strings
  if (typeof obj === 'string') {
    // Retornar string tal cual (incluso si está vacío)
    return obj;
  }
  
  // Manejar arrays
  if (Array.isArray(obj)) {
    const cleaned = obj
      .map(item => cleanForFirestore(item))
      .filter(item => item !== null && item !== undefined);
    return cleaned.length > 0 ? cleaned : [];
  }
  
  // Manejar objetos
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      // Solo incluir el campo si no es undefined
      if (value !== undefined) {
        const cleanedValue = cleanForFirestore(value);
        // Incluir el campo solo si el valor limpio no es undefined
        if (cleanedValue !== undefined) {
          cleaned[key] = cleanedValue;
        }
      }
    }
    // Retornar el objeto incluso si está vacío
    return cleaned;
  }
  
  // Otros tipos primitivos (boolean, etc)
  return obj;
}

async function migrateProductos() {
  console.log('🚀 Iniciando migración de productos...\n');
  
  const productos = loadProductos();
  
  let successCount = 0;
  let errorCount = 0;

  for (const producto of productos) {
    try {
      console.log(`📦 Migrando: ${producto.nombre} (ID: ${producto.id})`);

      // Extraer subproductos (los guardaremos después)
      const { subProductos, accesorios, ...productoData } = producto;

      // Preparar datos del producto (sin limpiar aún)
      const productoRaw = {
        id: producto.id,
        nombre: productoData.nombre,
        descripcion: productoData.descripcion,
        descripcionLarga: productoData.descripcionLarga,
        imagen: productoData.imagen,
        imagenes: productoData.imagenes,
        slug: productoData.slug,
        categoria: productoData.categoria,
        modelo3d: productoData.modelo3d,
        marcadores3d: productoData.marcadores3d,
        pdf: productoData.pdf,
        qr: productoData.qr,
        formUrl: productoData.formUrl,
        marca: productoData.marca
      };

      // Limpiar datos (eliminar undefined)
      const productoClean = cleanForFirestore(productoRaw);
      
      // Agregar timestamps
      const productoToSave = {
        ...productoClean,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Debug: Mostrar el primer producto para verificar
      if (producto.id === 1) {
        console.log('   🔍 DEBUG - Datos del primer producto:');
        console.log(JSON.stringify(productoToSave, null, 2));
        console.log('');
      }

      // Guardar producto
      const productoRef = await addDoc(collection(db, 'productos'), productoToSave);
      console.log(`   ✅ Producto guardado con docId: ${productoRef.id}`);

      // Migrar subproductos si existen
      if (subProductos && subProductos.length > 0) {
        console.log(`   📋 Migrando ${subProductos.length} subproducto(s)...`);
        
        for (const subProducto of subProductos) {
          const subProductoRaw = {
            id: subProducto.id,
            nombre: subProducto.nombre,
            descripcion: subProducto.descripcion,
            descripcionLarga: subProducto.descripcionLarga,
            imagen: subProducto.imagen,
            slug: subProducto.slug,
            modelo3d: subProducto.modelo3d,
            marcadores3d: subProducto.marcadores3d,
            qr: subProducto.qr,
            pdf: subProducto.pdf,
            formUrl: subProducto.formUrl,
            marca: subProducto.marca
          };

          // Limpiar datos (eliminar undefined)
          const subProductoClean = cleanForFirestore(subProductoRaw);
          
          // Agregar timestamps
          const subProductoToSave = {
            ...subProductoClean,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };

          await addDoc(
            collection(db, 'productos', productoRef.id, 'subproductos'),
            subProductoToSave
          );
          console.log(`      ✅ SubProducto: ${subProducto.nombre}`);
        }
      }

      successCount++;
      console.log('');
    } catch (error) {
      console.error(`   ❌ Error al migrar ${producto.nombre}:`, error.message);
      errorCount++;
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════');
  console.log('🎉 Migración completada!');
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📊 Total: ${productos.length}`);
  console.log('═══════════════════════════════════════');
}

// Ejecutar migración
migrateProductos()
  .then(() => {
    console.log('\n✅ Script finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });
