# 🖼️ Sistema de Gestión de Imágenes desde cPanel

## 📋 Descripción

El CMS está alojado en **Vercel**, mientras que las imágenes y la landing están en **cPanel**. El sistema permite previsualizar imágenes desde cPanel usando la URL pública del sitio.

## 🔧 Configuración

### 1. Variable de Entorno (Opcional)

Puedes configurar la URL del sitio en `.env.local`:

```env
VITE_SITE_URL=https://waterwises.com
```

Si no se configura, se usa `https://waterwises.com` por defecto.

### 2. Cómo Funciona

1. **Rutas Relativas**: Cuando ingresas una ruta relativa (ej: `/assets/imagen.jpg`), el sistema la convierte automáticamente a URL absoluta: `https://waterwises.com/assets/imagen.jpg`

2. **URLs Absolutas**: Si ingresas una URL completa (ej: `https://waterwises.com/assets/imagen.jpg`), se usa tal cual.

3. **Preview Automático**: El componente `ImagePathInput` muestra automáticamente un preview de la imagen y valida que exista.

## 🎯 Componente ImagePathInput

El componente `ImagePathInput` se usa en todos los formularios que requieren imágenes:

### Características:
- ✅ **Preview automático** de la imagen desde cPanel
- ✅ **Validación** de que la imagen existe
- ✅ **Conversión automática** de rutas relativas a URLs absolutas
- ✅ **Botón "Ver"** para abrir la imagen en nueva pestaña
- ✅ **Indicadores visuales**:
  - 🟢 Verde: Imagen válida y cargada
  - 🔴 Rojo: Imagen no encontrada
  - ⏳ Spinner: Validando...

### Uso:

```jsx
<ImagePathInput
  label="Ruta de Imagen"
  name="imagen"
  value={formData.imagen}
  onChange={handleChange}
  placeholder="/assets/imagen.jpg"
  required={false}
  helpText="Ruta del archivo en cPanel"
/>
```

## 📍 Dónde se Usa

El componente `ImagePathInput` está integrado en:

1. **ProductForm** - Imagen principal y QR
2. **EmpresaEditor** - Imágenes de "Sobre Nosotros" y "Objetivos"
3. **AliadoForm** - Logo del aliado
4. **NoticiaForm** - Preview mejorado para imágenes múltiples

## 🔄 Flujo de Trabajo

```
1. Subir imagen a cPanel
   → /public_html/assets/Productos/imagen.jpg

2. Ingresar ruta en CMS
   → /assets/Productos/imagen.jpg

3. Sistema convierte a URL
   → https://waterwises.com/assets/Productos/imagen.jpg

4. Preview automático
   → Muestra la imagen y valida que existe
```

## ⚙️ Configuración del Dominio

El dominio se configura en `src/config/site.js`:

```javascript
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://waterwises.com';
```

### Cambiar el Dominio:

1. **Opción 1: Variable de entorno** (Recomendado)
   ```env
   VITE_SITE_URL=https://tu-dominio.com
   ```

2. **Opción 2: Editar directamente**
   Edita `src/config/site.js` y cambia el valor por defecto.

## 🐛 Solución de Problemas

### ❌ La imagen no se muestra en el preview

**Causas posibles:**
1. La ruta es incorrecta
2. El archivo no existe en cPanel
3. El dominio está mal configurado
4. Problemas de CORS (poco probable)

**Solución:**
1. Verifica que la ruta sea correcta (debe empezar con `/`)
2. Verifica que el archivo exista en cPanel
3. Verifica la configuración del dominio en `src/config/site.js`
4. Abre la URL directamente en el navegador para verificar

### ❌ El indicador siempre muestra "No encontrada"

**Causa:** Puede ser un problema de CORS o la imagen realmente no existe.

**Solución:**
1. Abre la URL directamente en el navegador
2. Si funciona en el navegador, el problema es de validación (no crítico)
3. La imagen se guardará correctamente aunque el preview falle

## ✅ Ventajas

- ✅ **No requiere credenciales**: Usa la URL pública del sitio
- ✅ **Preview en tiempo real**: Ves la imagen antes de guardar
- ✅ **Validación automática**: Sabes si la imagen existe
- ✅ **Simple**: Solo ingresas la ruta relativa
- ✅ **Seguro**: No expone credenciales de cPanel

## 📝 Notas

- Las rutas se guardan como **rutas relativas** en Firestore (ej: `/assets/imagen.jpg`)
- La landing en Astro usa estas rutas directamente (son relativas al dominio)
- El preview en el CMS usa URLs absolutas para cargar desde cPanel
- Si cambias el dominio, actualiza `VITE_SITE_URL` o `src/config/site.js`

---

**¿Listo para usar?** Solo ingresa las rutas relativas y el sistema se encarga del resto! 🚀

