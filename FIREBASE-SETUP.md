# 🔥 Guía de Configuración Firebase

## Paso 1: Obtener Credenciales Web SDK

Las credenciales que proporcionaste son de **Service Account** (para backend). Para React necesitamos las credenciales **Web SDK**.

### Cómo obtenerlas:

1. **Ve a Firebase Console**
   - https://console.firebase.google.com/

2. **Selecciona tu proyecto**
   - Proyecto: `wwses-b764c`

3. **Ve a Project Settings**
   - Click en el ícono de engranaje ⚙️ al lado de "Project Overview"
   - Click en "Project settings"

4. **Scroll hasta "Your apps"**
   - Si NO ves ninguna app web (</> icono), necesitas crear una:
     - Click en el botón **</>** (Web)
     - Dale un nombre: "WWS CMS Web"
     - NO marques Firebase Hosting
     - Click "Register app"

5. **Copia las credenciales**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "wwses-b764c.firebaseapp.com",
     projectId: "wwses-b764c",
     storageBucket: "wwses-b764c.appspot.com",
     messagingSenderId: "123456789...",
     appId: "1:123456789:web:..."
   };
   ```

6. **Crea archivo `.env.local`** en la raíz del proyecto:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=wwses-b764c.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=wwses-b764c
   VITE_FIREBASE_STORAGE_BUCKET=wwses-b764c.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789...
   VITE_FIREBASE_APP_ID=1:123456789:web:...
   ```

## Paso 2: Habilitar Authentication

1. En Firebase Console, ve a **Authentication** (sidebar izquierdo)
2. Click en **Get started** (si es la primera vez)
3. Ve a la pestaña **Sign-in method**
4. Click en **Email/Password**
5. Habilita **Email/Password** (toggle ON)
6. Click **Save**

### Crear usuario administrador:

1. Ve a la pestaña **Users**
2. Click en **Add user**
3. Ingresa:
   - Email: tu-email@ejemplo.com
   - Password: (una contraseña segura)
4. Click **Add user**

## Paso 3: Configurar Firestore

1. En Firebase Console, ve a **Firestore Database**
2. Click en **Create database**
3. Selecciona **Start in production mode**
4. Elige una ubicación (elige la más cercana, ej: `us-east1`)
5. Click **Enable**

### Configurar reglas de seguridad:

1. Ve a la pestaña **Rules**
2. Reemplaza el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer/escribir
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Paso 4: Configurar Storage

1. En Firebase Console, ve a **Storage**
2. Click en **Get started**
3. Acepta las reglas por defecto
4. Elige la misma ubicación que Firestore
5. Click **Done**

### Configurar reglas de seguridad:

1. Ve a la pestaña **Rules**
2. Reemplaza el contenido con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Lectura pública, escritura solo para usuarios autenticados
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Paso 5: Verificar Configuración

### Checklist:

- ✅ Tienes archivo `.env.local` con todas las variables
- ✅ Authentication está habilitado (Email/Password)
- ✅ Tienes al menos un usuario administrador creado
- ✅ Firestore Database está creado
- ✅ Reglas de Firestore configuradas
- ✅ Storage está habilitado
- ✅ Reglas de Storage configuradas

## Paso 6: Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre http://localhost:3001 y verifica que puedes iniciar sesión con el usuario que creaste.

## 🎉 ¡Listo!

Ahora puedes:
1. Iniciar sesión con tu usuario
2. Crear productos
3. Subir imágenes
4. Gestionar subproductos

## 📝 Notas Importantes

### Seguridad
- **NUNCA** subas `.env.local` a Git
- Las credenciales del Service Account que compartiste son sensibles - elimínalas de donde las compartiste

### Costos
- Firebase Free Tier incluye:
  - 1 GB de Storage
  - 50,000 lecturas/día de Firestore
  - 20,000 escrituras/día de Firestore
  - Authentication ilimitado

### Respaldo
- Antes de hacer cambios importantes, haz respaldo de Firestore:
  - Cloud Console → Firestore → Import/Export

## 🆘 Problemas Comunes

### "Firebase: Error (auth/user-not-found)"
- Verifica que creaste el usuario en Authentication → Users

### "Missing or insufficient permissions"
- Verifica las reglas de Firestore
- Verifica que estás autenticado

### "Firebase Storage: unauthorized"
- Verifica las reglas de Storage
- Verifica que estás autenticado

### Variables de entorno no funcionan
- Verifica que el archivo se llama exactamente `.env.local`
- Verifica que todas las variables empiezan con `VITE_`
- Reinicia el servidor de desarrollo (`npm run dev`)

