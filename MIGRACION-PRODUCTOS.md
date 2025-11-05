# 📦 Migración de Productos a Firebase

Este script migra automáticamente todos los productos desde `proyecto_wws/src/data/productos.ts` a Firestore.

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
npm run migrate
```

### Paso 3: Espera a que termine

El script mostrará el progreso:

```
🚀 Iniciando migración de productos...

📦 Migrando: W-CPM COMPUERTA MURAL (ID: 1)
   ✅ Producto guardado con docId: abc123...

📦 Migrando: W-CPC COMPUERTA CANAL ABIERTO (ID: 2)
   ✅ Producto guardado con docId: def456...

...

═══════════════════════════════════════
🎉 Migración completada!
✅ Exitosos: 38
❌ Errores: 0
📊 Total: 38
═══════════════════════════════════════
```

## 📊 Qué se migra

### Productos (Colección principal)
- ✅ ID autoincremental
- ✅ Nombre, descripción, descripción larga
- ✅ Imagen principal
- ✅ Slug, categoría
- ✅ Modelo 3D, marcadores 3D
- ✅ PDF, QR, URL de formulario
- ✅ Marca
- ✅ Timestamps (createdAt, updatedAt)

### SubProductos (Sub-colección)
- ✅ ID único
- ✅ Todos los campos del subproducto
- ✅ Se guardan en `productos/{productoId}/subproductos`

## ⚠️ IMPORTANTE

### ⚡ El script NO duplica productos

- Cada vez que ejecutes el script, creará nuevos documentos
- Si ya migraste, NO lo ejecutes de nuevo o duplicarás todos los productos

### 🗑️ Para limpiar Firestore antes de re-migrar:

1. Ve a Firebase Console → Firestore Database
2. Selecciona la colección `productos`
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

### Error: "Cannot find productos.ts"
- Verifica que el proyecto Astro esté en `../../proyecto_wws/`
- Verifica que exista el archivo `src/data/productos.ts`

## ✅ Verificar Migración

1. Ve a Firebase Console
2. Abre **Firestore Database**
3. Deberías ver:
   - Colección `productos` con 38 documentos
   - Cada producto con su sub-colección `subproductos` (si corresponde)

## 🔄 Migrar Solo Productos Específicos

Si quieres migrar solo algunos productos, edita el script y agrega un filtro:

```javascript
// En migrate-productos.js, línea ~40
const productos = loadProductos().filter(p => p.id <= 5); // Solo primeros 5
```

## 📝 Logs

El script muestra en consola:
- ✅ Productos migrados exitosamente
- ❌ Errores durante la migración
- 📊 Resumen final con estadísticas

## 🎉 Después de Migrar

Una vez migrados los productos, puedes:

1. **Ver en el CMS:**
   - `npm run dev`
   - Ve a http://localhost:3001/productos

2. **Editar productos:**
   - Usa el CMS para modificar, agregar o eliminar

3. **Consumir en Astro:**
   - Adapta Astro para leer desde Firestore en lugar de `productos.ts`

---

**¿Listo para migrar?** Ejecuta `npm run migrate` 🚀

