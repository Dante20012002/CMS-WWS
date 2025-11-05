# 🌊 WWS Admin CMS - React + Firebase

Sistema de gestión de contenidos para Water Wise Solutions construido con React, Firebase y Tailwind CSS.

## 🚀 Características

- ✅ Autenticación con Firebase Auth
- ✅ CRUD completo de Productos y SubProductos
- ✅ Upload de imágenes a Firebase Storage
- ✅ IDs autoincrementales
- ✅ Búsqueda y filtros
- ✅ UI moderna y responsive
- ✅ Deploy en Vercel

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Firebase
- Cuenta de Vercel (para deploy)

## 🔧 Configuración Inicial

### 1. Obtener Credenciales Firebase Web SDK

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **wwses-b764c**
3. Ve a **Project Settings** (⚙️ en el sidebar)
4. Scroll hasta **Your apps** → **Web app**
5. Si no tienes una app web, haz clic en **Add app** (</>) y selecciona **Web**
6. Copia las credenciales que se parecen a esto:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "wwses-b764c.firebaseapp.com",
  projectId: "wwses-b764c",
  storageBucket: "wwses-b764c.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456..."
};
```

### 2. Crear archivo .env.local

Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=wwses-b764c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=wwses-b764c
VITE_FIREBASE_STORAGE_BUCKET=wwses-b764c.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
VITE_FIREBASE_APP_ID=1:123456...
```

### 3. Configurar Firebase

#### A. Firestore Database

1. En Firebase Console, ve a **Firestore Database**
2. Crea la base de datos (modo producción)
3. Reglas de seguridad (pestaña **Rules**):

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

#### B. Firebase Storage

1. En Firebase Console, ve a **Storage**
2. Activa Storage
3. Reglas de seguridad (pestaña **Rules**):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Permitir lectura pública, escritura solo a usuarios autenticados
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### C. Authentication

1. En Firebase Console, ve a **Authentication**
2. Habilita **Email/Password** en la pestaña **Sign-in method**
3. Ve a **Users** y agrega un usuario administrador:
   - Email: tu-email@ejemplo.com
   - Password: (elige una contraseña segura)

### 4. Instalar Dependencias

```bash
npm install
```

## 🎯 Uso

### Desarrollo Local

```bash
npm run dev
```

Abre [http://localhost:3001](http://localhost:3001) en tu navegador.

### Build para Producción

```bash
npm run build
```

### Preview del Build

```bash
npm run preview
```

## 🚢 Deploy a Vercel

### Opción 1: Desde la terminal

1. Instala Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Sigue las instrucciones:
   - Link to existing project? **No**
   - Project name? **wws-admin-cms**
   - Directory? **./** (enter)
   - Quiere sobrescribir? **No**

4. Configura variables de entorno en Vercel:
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

5. Deploy a producción:
```bash
vercel --prod
```

### Opción 2: Desde Vercel Dashboard

1. Ve a [vercel.com](https://vercel.com)
2. Click en **Add New** → **Project**
3. Importa tu repositorio de Git
4. Configura las variables de entorno en **Environment Variables**
5. Click en **Deploy**

## 📁 Estructura del Proyecto

```
wws-admin-cms/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Dashboard.jsx
│   │   ├── Layout.jsx
│   │   ├── Login.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductForm.jsx
│   │   ├── SubProductList.jsx
│   │   ├── SubProductForm.jsx
│   │   └── ImageUpload.jsx
│   ├── config/
│   │   └── firebase.js      # Configuración Firebase
│   ├── hooks/
│   │   └── useProducts.js   # Lógica de productos
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local               # Variables de entorno (NO subir a Git)
├── package.json
└── README.md
```

## 🗄️ Estructura de Datos en Firestore

### Colección: `productos`

```javascript
{
  id: 1,                    // Autoincremental
  nombre: "Producto",
  descripcion: "...",
  descripcionLarga: "...",
  imagen: "https://...",    // URL de Firebase Storage
  imagenes: [],
  slug: "producto",
  categoria: "CATEGORIA",
  modelo3d: "/models/...",
  marcadores3d: [],
  pdf: "https://...",
  qr: "/assets/...",
  formUrl: "https://...",
  marca: "Marca",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Sub-colección: `productos/{productoId}/subproductos`

```javascript
{
  id: "sub-1",
  nombre: "SubProducto",
  descripcion: "...",
  descripcionLarga: "...",
  imagen: "https://...",
  slug: "subproducto",
  modelo3d: "/models/...",
  marcadores3d: [],
  qr: "/assets/...",
  pdf: "https://...",
  formUrl: "https://...",
  marca: "Marca",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 📝 Uso del CMS

### Crear Producto

1. Inicia sesión
2. Ve a **Productos** → **+ Nuevo Producto**
3. Completa el formulario:
   - Nombre (requerido)
   - Descripción corta (requerido)
   - Descripción larga
   - Categoría
   - Sube imagen principal
   - Agrega URLs de recursos (PDF, QR, modelo 3D, etc.)
4. Click en **Crear Producto**

### Editar Producto

1. En la lista de productos, click en **Editar**
2. Modifica los campos necesarios
3. Click en **Actualizar Producto**

### Gestionar SubProductos

1. Edita un producto
2. Scroll hasta la sección **SubProductos**
3. Click en **+ Agregar SubProducto**
4. Completa el formulario
5. Click en **Crear**

## 🔐 Seguridad

- ✅ Autenticación requerida para todas las operaciones
- ✅ Reglas de Firestore configuradas
- ✅ Storage con lectura pública, escritura autenticada
- ⚠️ NO subas `.env.local` a Git (ya está en `.gitignore`)

## 🆘 Solución de Problemas

### Error: "Firebase not initialized"
- Verifica que `.env.local` existe y tiene todas las variables
- Verifica que las variables empiezan con `VITE_`

### Error: "Permission denied"
- Verifica las reglas de Firestore y Storage
- Verifica que estás autenticado

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Imágenes no se cargan
- Verifica que Firebase Storage está habilitado
- Verifica las reglas de Storage

## 📞 Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.

## 📄 Licencia

© 2025 Water Wise Solutions. Todos los derechos reservados.

