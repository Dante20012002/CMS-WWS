import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('🔧 Configurando Firebase...');
console.log('Config:', JSON.stringify(firebaseConfig, null, 2));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirestore() {
  try {
    console.log('\n📝 Intentando escribir un documento simple...');
    
    const testData = {
      nombre: 'Test',
      numero: 123,
      fecha: new Date()
    };
    
    console.log('Datos:', JSON.stringify(testData, null, 2));
    
    const docRef = await addDoc(collection(db, 'test'), testData);
    
    console.log('✅ ¡Éxito! Documento creado con ID:', docRef.id);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.code, error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testFirestore();

