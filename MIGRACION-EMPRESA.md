# 🏢 Migración de Información de Empresa a Firebase

Este script migra automáticamente la información de la empresa (Sobre Nosotros, Misión, Visión y Objetivos) desde los archivos estáticos a Firestore.

## 📋 Pre-requisitos

1. **Firebase configurado:**
   - ✅ Firestore Database habilitado
   - ✅ Reglas de Firestore configuradas
   - ✅ Authentication configurado

2. **Archivo `.env.local` con credenciales:**
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=wwses-b764c.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=wwses-b764c
   VITE_FIREBASE_STORAGE_BUCKET=wwses-b764c.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
   VITE_FIREBASE_APP_ID=1:123456:web:...
   ```

3. **Dependencias instaladas:**
   ```bash
   npm install
   ```

## 🚀 Ejecutar Migración

### Paso 1: Asegúrate de estar en el directorio correcto

```bash
cd "C:\Users\santi\Proyecto WWS\wws-admin-cms"
```

### Paso 2: Ejecuta el script de migración

```bash
npm run migrate:empresa
```

### Paso 3: Espera a que termine

El script mostrará el progreso:

```
🚀 Iniciando migración de información de empresa...

📝 Datos a migrar:
{
  "sobreNosotros": {
    "titulo": "Sobre Nosotros",
    "texto": "...",
    "imagen": "/assets/Agua.jpg"
  },
  "mision": {
    "titulo": "MISIÓN",
    "texto": "..."
  },
  "vision": {
    "titulo": "VISIÓN",
    "texto": "..."
  },
  "objetivos": {
    "titulo": "NUESTRO OBJETIVO",
    "texto": "...",
    "imagen": "/assets/BARRANQUILLA 1.jpg"
  }
}

✅ Información de empresa migrada exitosamente
📄 Documento ID: empresa_info

═══════════════════════════════════════
🎉 Migración completada!
✅ Secciones migradas:
   - Sobre Nosotros
   - Misión
   - Visión
   - Objetivos
═══════════════════════════════════════
```

## 📊 Qué se migra

### Información de Empresa (Documento único: `empresa_info`)

- ✅ **Sobre Nosotros**
  - Título
  - Texto descriptivo
  - Ruta de imagen

- ✅ **Misión**
  - Título
  - Texto de la misión

- ✅ **Visión**
  - Título
  - Texto de la visión

- ✅ **Objetivos**
  - Título
  - Texto de los objetivos
  - Ruta de imagen

- ✅ Timestamps (createdAt, updatedAt)

## ⚠️ IMPORTANTE

### ⚡ El script reemplaza datos existentes

- Si ya existe el documento `empresa_info`, se actualizará con los nuevos datos
- Si no existe, se creará automáticamente
- Los datos migrados son los valores actuales de los archivos estáticos

### 🔒 Notas de Seguridad

- El script usa datos hardcodeados extraídos de los archivos actuales
- Solo úsalo para migración inicial
- NO lo expongas en producción

## 🐛 Solución de Problemas

### Error: "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### Error: "Permission denied" en Firestore
- Verifica que las reglas de Firestore estén configuradas:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Error: "Cannot read properties of undefined"
- Verifica que el archivo `.env.local` exista
- Verifica que todas las variables `VITE_FIREBASE_*` estén configuradas

## ✅ Verificar Migración

1. Ve a Firebase Console
2. Abre **Firestore Database**
3. Deberías ver:
   - Colección `empresa` con un documento `empresa_info`
   - El documento debe contener: sobreNosotros, mision, vision, objetivos

## 📋 Estructura de Datos en Firestore

El documento se guarda así:

```javascript
empresa/
└── empresa_info
    ├── sobreNosotros: {
    │   titulo: "Sobre Nosotros",
    │   texto: "...",
    │   imagen: "/assets/Agua.jpg"
    │ }
    ├── mision: {
    │   titulo: "MISIÓN",
    │   texto: "..."
    │ }
    ├── vision: {
    │   titulo: "VISIÓN",
    │   texto: "..."
    │ }
    ├── objetivos: {
    │   titulo: "NUESTRO OBJETIVO",
    │   texto: "...",
    │   imagen: "/assets/BARRANQUILLA 1.jpg"
    │ }
    ├── createdAt: timestamp
    └── updatedAt: timestamp
```

## 🎉 Después de Migrar

Una vez migrada la información, puedes:

1. **Ver en el CMS:**
   - `npm run dev`
   - Ve a http://localhost:3001/empresa
   - Deberías ver todos los campos con los datos migrados

2. **Editar información:**
   - Usa el CMS para modificar cualquier sección
   - Los cambios se guardan en Firestore

3. **Consumir en Astro:**
   - La landing ya está configurada para leer desde Firestore
   - Los cambios se reflejarán después del build

## 📝 Datos Migrados

Los datos que se migran son los valores actuales extraídos de:
- `proyecto_wws/src/pages/sobre-nosotros.astro`
- `proyecto_wws/src/components/About.astro`

Si necesitas actualizar los datos antes de migrar, edita el archivo `scripts/migrate-empresa.js`.

---

**¿Listo para migrar?** Ejecuta `npm run migrate:empresa` 🚀

