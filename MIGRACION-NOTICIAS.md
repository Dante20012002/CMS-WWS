# 📰 Migración de Noticias a Firebase

Este script migra automáticamente todas las noticias desde `proyecto_wws/src/data/noticias.ts` a Firestore.

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
npm run migrate:noticias
```

### Paso 3: Espera a que termine

El script mostrará el progreso:

```
🚀 Iniciando migración de noticias...

📰 Migrando: Buenaventura inaugura PTAR para la Ciudadela San Antonio (Slug: ptar-buenaventura-ciudadela-san-antonio)
   ✅ Noticia guardada con docId: abc123...
   📊 Campos: título, resumen, 2 imagen(es), 1 enlace(s)

📰 Migrando: Avanza la estructuración de la PTAR en Villavicencio... (Slug: ptar-villavicencio-estructuracion)
   ✅ Noticia guardada con docId: def456...
   📊 Campos: título, resumen, 3 imagen(es), 1 enlace(s)

...

═══════════════════════════════════════
🎉 Migración completada!
✅ Exitosos: 6
❌ Errores: 0
📊 Total: 6
═══════════════════════════════════════
```

## 📊 Qué se migra

### Noticias (Colección principal)
- ✅ ID autoincremental (1, 2, 3, ...)
- ✅ Título
- ✅ Resumen
- ✅ Slug (URL amigable)
- ✅ Imágenes (array de rutas)
- ✅ Contenido HTML
- ✅ Enlaces oficiales (array de objetos con título y URL)
- ✅ Timestamps (createdAt, updatedAt)

## ⚠️ IMPORTANTE

### ⚡ El script NO duplica noticias

- Cada vez que ejecutes el script, creará nuevos documentos
- Si ya migraste, NO lo ejecutes de nuevo o duplicarás todas las noticias

### 🗑️ Para limpiar Firestore antes de re-migrar:

1. Ve a Firebase Console → Firestore Database
2. Selecciona la colección `noticias`
3. Click en los tres puntos → **Delete collection**
4. Confirma la eliminación
5. Ejecuta el script nuevamente

### 🔒 Notas de Seguridad

- El script usa `eval()` para parsear el archivo TypeScript
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

### Error: "Cannot find noticias.ts"
- Verifica que el proyecto Astro esté en `../../proyecto_wws/`
- Verifica que exista el archivo `src/data/noticias.ts`

## ✅ Verificar Migración

1. Ve a Firebase Console
2. Abre **Firestore Database**
3. Deberías ver:
   - Colección `noticias` con 6 documentos (o el número que corresponda)
   - Cada noticia con todos sus campos: titulo, resumen, slug, imagenes, contenido, enlacesOficiales

## 🔄 Migrar Solo Noticias Específicas

Si quieres migrar solo algunas noticias, edita el script y agrega un filtro:

```javascript
// En migrate-noticias.js, línea ~40
const noticias = loadNoticias().filter(n => n.slug.includes('buga')); // Solo noticias de Buga
```

## 📝 Logs

El script muestra en consola:
- ✅ Noticias migradas exitosamente
- ❌ Errores durante la migración
- 📊 Resumen final con estadísticas
- 📊 Cantidad de imágenes y enlaces por noticia

## 🎉 Después de Migrar

Una vez migradas las noticias, puedes:

1. **Ver en el CMS:**
   - `npm run dev`
   - Ve a http://localhost:3001/noticias

2. **Editar noticias:**
   - Usa el CMS para modificar, agregar o eliminar

3. **Consumir en Astro:**
   - La landing ya está configurada para leer desde Firestore
   - Las páginas se generarán automáticamente en build time

## 📋 Estructura de Datos en Firestore

Cada noticia se guarda así:

```javascript
noticias/
├── {docId}
│   ├── id: 1 (autoincremental)
│   ├── titulo: "Título de la noticia"
│   ├── resumen: "Resumen breve..."
│   ├── slug: "titulo-de-la-noticia"
│   ├── imagenes: ["/assets/Noticias/img1.jpg", ...]
│   ├── contenido: "<p>Contenido HTML...</p>"
│   ├── enlacesOficiales: [
│   │   { titulo: "Leer más", url: "https://..." }
│   │ ]
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

---

**¿Listo para migrar?** Ejecuta `npm run migrate:noticias` 🚀

