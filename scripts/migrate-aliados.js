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

// Datos actuales extraídos de sobre-nosotros.astro
const aliadosData = [
  { 
    nombre: 'Equom', 
    logo: '/assets/Aliados/Equom.png',
    url: 'https://www.gequom.com/'
  },
  { 
    nombre: 'X2 Solutions', 
    logo: '/assets/Aliados/XS Solutions.jpg',
    url: 'https://www-x2solutions-it.translate.goog/en/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc'
  },
  { 
    nombre: 'Biolam Colombia', 
    logo: '/assets/Aliados/Biolam Colombia.png',
    url: 'https://biolamcolombia.com/'
  },
  { 
    nombre: 'Coningeniería', 
    logo: '/assets/Aliados/Conngeniería.png',
    url: 'https://coningenieria.com.co/'
  }
];

async function migrateAliados() {
  console.log('🚀 Iniciando migración de aliados...\n');
  
  let successCount = 0;
  let errorCount = 0;
  let idCounter = 1;

  for (const aliado of aliadosData) {
    try {
      console.log(`🤝 Migrando: ${aliado.nombre}`);

      const aliadoToSave = {
        id: idCounter++,
        nombre: aliado.nombre,
        logo: aliado.logo,
        url: aliado.url,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'aliados'), aliadoToSave);
      console.log(`   ✅ Aliado guardado con ID: ${aliadoToSave.id}`);
      console.log('');

      successCount++;
    } catch (error) {
      console.error(`   ❌ Error al migrar "${aliado.nombre}":`, error.message);
      errorCount++;
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════');
  console.log('🎉 Migración completada!');
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📊 Total: ${aliadosData.length}`);
  console.log('═══════════════════════════════════════');
}

// Ejecutar migración
migrateAliados()
  .then(() => {
    console.log('\n✅ Script finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });

