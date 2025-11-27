import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

// Datos actuales extraídos de ProductForm.jsx
const categoriasData = [
  'CONTROL DE CAUDAL',
  'DRAGADO Y PRETRATAMIENTO',
  'AGITACIÓN Y FLOCULACIÓN',
  'TRATAMIENTO SECUNDARIO',
  'SEDIMENTACIÓN',
  'TRATAMIENTO TERCIARIO',
  'TRATAMIENTO DE LODOS Y TRANSPORTADORES',
  'ADECUACIONES ESTRUCTURALES E HIDRÁULICAS',
  'SERVICIOS'
];

async function migrateCategorias() {
  console.log('🚀 Iniciando migración de categorías...\n');
  
  let successCount = 0;
  let errorCount = 0;
  let idCounter = 1;

  for (const categoriaNombre of categoriasData) {
    try {
      console.log(`📂 Migrando: ${categoriaNombre}`);

      const categoriaToSave = {
        id: idCounter++,
        nombre: categoriaNombre,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'categorias'), categoriaToSave);
      console.log(`   ✅ Categoría guardada con ID: ${categoriaToSave.id}`);
      console.log('');

      successCount++;
    } catch (error) {
      console.error(`   ❌ Error al migrar "${categoriaNombre}":`, error.message);
      errorCount++;
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════');
  console.log('🎉 Migración completada!');
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📊 Total: ${categoriasData.length}`);
  console.log('═══════════════════════════════════════');
}

// Ejecutar migración
migrateCategorias()
  .then(() => {
    console.log('\n✅ Script finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });

