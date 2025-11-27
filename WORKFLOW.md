# 📋 Flujo de Trabajo - WWS Admin CMS

## 🎯 Arquitectura Simplificada

El CMS gestiona **solo datos textuales** en Firestore. Las imágenes y modelos 3D se manejan manualmente en cPanel.

```
┌─────────────────────────────────────┐
│  1. SUBIR ARCHIVOS A CPANEL        │
│     (File Manager o FTP)            │
│     → /public_html/assets/          │
│     → /public_html/models/          │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│  2. CREAR/EDITAR EN CMS (Vercel)   │
│     - Ingresar datos del producto   │
│     - Copiar rutas de archivos      │
│     - Guardar en Firestore          │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│  3. FIRESTORE (Firebase)            │
│     Almacena:                       │
│     - Textos (nombre, descrip...)   │
│     - Rutas (/assets/img.jpg)       │
│     - URLs (PDFs, forms, etc)       │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│  4. LANDING ASTRO (cPanel)          │
│     - Lee datos desde Firestore     │
│     - Carga imágenes locales        │
│     - Muestra productos             │
└─────────────────────────────────────┘
```

---

## 📝 Workflow para CREAR un producto

### **Paso 1: Subir archivos a cPanel**

1. **Accede a cPanel** → File Manager
2. **Navega a:**
   - Imágenes: `/public_html/assets/Productos/`
   - Modelos 3D: `/public_html/models/`
   - QRs: `/public_html/assets/QR/`
   - PDFs: `/public_html/assets/PDF/` (crea esta carpeta si no existe)

3. **Sube tus archivos:**
   ```
   /public_html/
   ├── assets/
   │   ├── Productos/
   │   │   └── mi-producto.jpg        ← Sube aquí
   │   ├── QR/
   │   │   └── mi-producto-qr.png     ← Sube aquí
   │   └── PDF/
   │       └── mi-producto.pdf         ← Sube aquí
   └── models/
       └── mi-producto.glb             ← Sube aquí
   ```

4. **Anota las rutas** (las necesitarás en el CMS):
   ```
   Imagen: /assets/Productos/mi-producto.jpg
   QR:     /assets/QR/mi-producto-qr.png
   PDF:    /assets/PDF/mi-producto.pdf
   Modelo: /models/mi-producto.glb
   ```

### **Paso 2: Crear producto en el CMS**

1. **Abre el CMS:**
   ```
   https://tu-cms.vercel.app
   ```

2. **Ve a Productos → + Nuevo Producto**

3. **Completa el formulario:**
   
   **Información Básica:**
   - ✅ Nombre del Producto (requerido)
   - ✅ Descripción Corta (requerido)
   - ✅ Descripción Larga
   - ✅ Categoría (requerido)
   - ⚙️ Slug (se genera automáticamente)
   - Marca (opcional)

   **Multimedia:**
   - 📷 Ruta de Imagen Principal: `/assets/Productos/mi-producto.jpg`
   - 🎮 Ruta de Modelo 3D: `/models/mi-producto.glb`
   - 📄 Ruta de PDF: `/assets/PDF/mi-producto.pdf`
   - 📱 Ruta de QR: `/assets/QR/mi-producto-qr.png`
   - 📋 URL de Formulario: `https://forms.office.com/...`

4. **Click en "Crear Producto"**

5. **Verifica:**
   - ✅ Las imágenes se muestran en el preview
   - ✅ El producto aparece en la lista

### **Paso 3: Verificar en la Landing**

1. **Abre tu sitio:**
   ```
   https://waterwises.com/productos
   ```

2. **Deberías ver:**
   - ✅ El nuevo producto listado
   - ✅ La imagen cargando correctamente
   - ✅ Todos los datos mostrados

---

## ✏️ Workflow para EDITAR un producto

### **Opción A: Solo cambiar textos**

1. **Ve al CMS → Productos**
2. **Click en "Editar"** del producto
3. **Modifica los campos de texto** necesarios
4. **Click en "Actualizar Producto"**
5. ✅ **Los cambios se reflejan inmediatamente** en la landing

### **Opción B: Cambiar imágenes o modelos**

1. **Sube el nuevo archivo a cPanel** (mismo proceso del Paso 1)
2. **Ve al CMS → Productos → Editar**
3. **Actualiza la ruta** del archivo:
   ```
   Antes: /assets/Productos/producto-viejo.jpg
   Ahora: /assets/Productos/producto-nuevo.jpg
   ```
4. **Click en "Actualizar Producto"**
5. ✅ **La landing mostrará el nuevo archivo**

---

## 🗑️ Workflow para ELIMINAR un producto

### **Paso 1: Eliminar del CMS**

1. **Ve al CMS → Productos**
2. **Click en "Eliminar"** del producto
3. **Confirma la eliminación**
4. ✅ El producto desaparece de Firestore y de la landing

### **Paso 2: Limpiar archivos en cPanel (opcional)**

1. **Ve a cPanel → File Manager**
2. **Navega a las carpetas de archivos:**
   - `/public_html/assets/Productos/`
   - `/public_html/models/`
   - `/public_html/assets/QR/`
   - `/public_html/assets/PDF/`
3. **Elimina los archivos** del producto si ya no los necesitas

---

## 🔧 SubProductos

El workflow es exactamente el mismo, pero:

1. **Edita un producto** existente
2. **Scroll hasta "SubProductos"**
3. **Click en "+ Agregar SubProducto"**
4. **Sigue el mismo proceso:**
   - Sube archivos a cPanel primero
   - Ingresa rutas en el formulario
   - Guarda

---

## 💡 Tips y Buenas Prácticas

### **📁 Organización de archivos en cPanel:**

```
/public_html/
├── assets/
│   ├── Productos/
│   │   ├── 1.jpg           ← Por ID de producto
│   │   ├── 2.jpg
│   │   └── compuerta-mural.jpg  ← O por nombre
│   ├── QR/
│   │   ├── 1-qr.png
│   │   └── compuerta-mural-qr.png
│   └── PDF/
│       ├── 1.pdf
│       └── compuerta-mural.pdf
└── models/
    ├── 1-modelo.glb
    └── compuerta-mural.glb
```

### **🎨 Optimización de imágenes:**

Antes de subir a cPanel, optimiza tus imágenes:
- **Formato:** JPG para fotos, PNG para gráficos
- **Tamaño:** Máximo 1920px de ancho
- **Peso:** Máximo 500 KB por imagen
- **Herramientas:** TinyPNG, Squoosh, Photoshop

### **⚡ Velocidad:**

- ✅ Usa nombres cortos sin espacios: `producto-1.jpg`
- ✅ Minúsculas siempre: `producto.jpg` no `Producto.JPG`
- ✅ Sin caracteres especiales: `compuerta.jpg` no `compuerta(1).jpg`

### **🔄 Caché:**

Si actualizas una imagen pero la landing muestra la vieja:
1. **Opción A:** Cambia el nombre del archivo:
   ```
   producto.jpg → producto-v2.jpg
   ```
2. **Opción B:** Espera 5-10 minutos (caché del navegador)
3. **Opción C:** Abre en ventana de incógnito

---

## 🚨 Solución de Problemas

### **❌ La imagen no se muestra en el CMS (preview)**

**Causas posibles:**
1. Ruta incorrecta (verifica mayúsculas/minúsculas)
2. El archivo no se subió correctamente a cPanel
3. El archivo está en una carpeta diferente

**Solución:**
1. Verifica la ruta exacta en File Manager de cPanel
2. Copia la ruta completa: `/assets/Productos/archivo.jpg`
3. Pégala en el CMS exactamente como está

### **❌ La imagen no se muestra en la landing**

**Causas posibles:**
1. El proyecto Astro no está desplegado con los archivos
2. La ruta en Firestore es incorrecta
3. Problema de permisos en cPanel

**Solución:**
1. Verifica que el archivo exista en: `https://waterwises.com/assets/Productos/archivo.jpg`
2. Si no existe, súbelo de nuevo a cPanel
3. Verifica permisos del archivo (644 o 755)

### **❌ El modelo 3D no carga**

**Causas posibles:**
1. Archivo .glb corrupto
2. Ruta incorrecta
3. Archivo muy pesado (>10 MB)

**Solución:**
1. Prueba abrir el .glb en [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com/)
2. Si funciona ahí, el problema es la ruta
3. Optimiza el modelo si es muy pesado

---

## 📊 Resumen de Ubicaciones

| Tipo de Archivo | Ubicación en cPanel | Ejemplo de Ruta |
|----------------|---------------------|-----------------|
| **Imágenes** | `/public_html/assets/Productos/` | `/assets/Productos/producto.jpg` |
| **QR Codes** | `/public_html/assets/QR/` | `/assets/QR/producto-qr.png` |
| **Modelos 3D** | `/public_html/models/` | `/models/producto.glb` |
| **PDFs** | `/public_html/assets/PDF/` | `/assets/PDF/producto.pdf` |
| **Formularios** | Microsoft Forms | `https://forms.office.com/...` |

---

## 🎯 Ventajas de este Workflow

✅ **Simple:** No necesitas configurar FTP en el CMS
✅ **Seguro:** No hay credenciales expuestas
✅ **Control total:** Gestionas archivos directamente en cPanel
✅ **Sin costos extra:** Todo gratis (Firestore + cPanel)
✅ **Escalable:** Puedes migrar a Cloudinary después si quieres

---

## 🔜 Mejoras Futuras (Opcional)

Si en el futuro quieres automatizar la subida de imágenes:

1. **Cloudinary:** Upload directo desde el CMS
2. **Firebase Storage:** Integración con Firebase
3. **API FTP:** Upload programático a cPanel

Pero por ahora, el workflow manual es **simple, funcional y gratis**. 🚀

