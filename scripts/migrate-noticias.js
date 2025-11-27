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

// Leer archivo noticias.ts y extraer el array
function loadNoticias() {
  try {
    const noticiasPath = join(__dirname, '..', '..', 'proyecto_wws', 'src', 'data', 'noticias.ts');
    console.log(`📂 Leyendo archivo: ${noticiasPath}`);
    
    const content = readFileSync(noticiasPath, 'utf-8');
    
    // Extraer el array de noticias usando regex
    const match = content.match(/const noticias: Noticia\[\] = (\[[\s\S]*?\]);/);
    
    if (!match) {
      throw new Error('No se pudo extraer el array de noticias del archivo');
    }
    
    // Evaluar el array (cuidado: esto es solo para desarrollo)
    const noticiasStr = match[1];
    const noticias = eval(noticiasStr);
    
    console.log(`✅ ${noticias.length} noticias cargadas del archivo\n`);
    return noticias;
  } catch (error) {
    console.error('❌ Error al leer noticias.ts:', error.message);
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

async function migrateNoticias() {
  console.log('🚀 Iniciando migración de noticias...\n');
  
  const noticias = loadNoticias();
  
  let successCount = 0;
  let errorCount = 0;
  let idCounter = 1;

  for (const noticia of noticias) {
    try {
      console.log(`📰 Migrando: ${noticia.titulo} (Slug: ${noticia.slug})`);

      // Preparar datos de la noticia
      const noticiaRaw = {
        id: idCounter++, // ID autoincremental
        titulo: noticia.titulo,
        resumen: noticia.resumen,
        slug: noticia.slug,
        imagenes: noticia.imagenes || [],
        contenido: noticia.contenido || '',
        enlacesOficiales: noticia.enlacesOficiales || []
      };

      // Limpiar datos (eliminar undefined)
      const noticiaClean = cleanForFirestore(noticiaRaw);
      
      // Agregar timestamps
      const noticiaToSave = {
        ...noticiaClean,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Debug: Mostrar la primera noticia para verificar
      if (idCounter === 2) {
        console.log('   🔍 DEBUG - Datos de la primera noticia:');
        console.log(JSON.stringify(noticiaToSave, null, 2));
        console.log('');
      }

      // Guardar noticia
      const noticiaRef = await addDoc(collection(db, 'noticias'), noticiaToSave);
      console.log(`   ✅ Noticia guardada con docId: ${noticiaRef.id}`);
      console.log(`   📊 Campos: título, resumen, ${noticia.imagenes?.length || 0} imagen(es), ${noticia.enlacesOficiales?.length || 0} enlace(s)`);
      console.log('');

      successCount++;
    } catch (error) {
      console.error(`   ❌ Error al migrar "${noticia.titulo}":`, error.message);
      errorCount++;
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════');
  console.log('🎉 Migración completada!');
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📊 Total: ${noticias.length}`);
  console.log('═══════════════════════════════════════');
}

// Ejecutar migración
migrateNoticias()
  .then(() => {
    console.log('\n✅ Script finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });

