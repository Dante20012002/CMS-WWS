import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

const EMPRESA_DOC_ID = 'empresa_info';

// Datos actuales extraídos de los archivos de la landing
const empresaData = {
  sobreNosotros: {
    titulo: 'Sobre Nosotros',
    texto: 'Garantizar un servicio de alta calidad que genere confianza y satisfacción en nuestros clientes, fortaleciendo nuestra presencia en el mercado Colombiana y suramericano mediante procesos eficientes, asesoría especializada.',
    imagen: '/assets/Agua.jpg'
  },
  mision: {
    titulo: 'MISIÓN',
    texto: 'Brindar soluciones integrales y de alta calidad en procesos de tratamiento y manejo de aguas, a través de la comercialización, instalación y mantenimiento de equipos especializados. Nos comprometemos a ofrecer un servicio excepcional, basado en la asesoría técnica experta, la innovación y la satisfacción total de nuestros clientes en Colombia y Sudamérica.'
  },
  vision: {
    titulo: 'VISIÓN',
    texto: 'Ser reconocidos como la empresa líder en soluciones para la gestión del agua a través de nuestros equipos en Colombia y Sudamérica, destacándose por la excelencia en nuestro servicio y la confiabilidad de nuestros productos. Nos esforzamos por superar las expectativas de nuestros clientes a través de un enfoque centrado en la calidad, la eficiencia y la mejora continua.'
  },
  objetivos: {
    titulo: 'NUESTRO OBJETIVO',
    texto: 'Garantizar un servicio de alta calidad que genere confianza y satisfacción en nuestros clientes, fortaleciendo nuestra presencia en el mercado Colombiana y suramericano mediante procesos eficientes, asesoría especializada y soluciones y equipos innovadores en gestión del agua.',
    imagen: '/assets/BARRANQUILLA 1.jpg'
  }
};

async function migrateEmpresa() {
  console.log('🚀 Iniciando migración de información de empresa...\n');
  
  try {
    const docRef = doc(db, 'empresa', EMPRESA_DOC_ID);
    
    const dataToSave = {
      ...empresaData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    console.log('📝 Datos a migrar:');
    console.log(JSON.stringify(dataToSave, null, 2));
    console.log('');

    await setDoc(docRef, dataToSave);
    
    console.log('✅ Información de empresa migrada exitosamente');
    console.log(`📄 Documento ID: ${EMPRESA_DOC_ID}`);
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🎉 Migración completada!');
    console.log('✅ Secciones migradas:');
    console.log('   - Sobre Nosotros');
    console.log('   - Misión');
    console.log('   - Visión');
    console.log('   - Objetivos');
    console.log('═══════════════════════════════════════');
  } catch (error) {
    console.error('❌ Error al migrar información de empresa:', error.message);
    throw error;
  }
}

// Ejecutar migración
migrateEmpresa()
  .then(() => {
    console.log('\n✅ Script finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });

