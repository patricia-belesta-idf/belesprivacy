# 🎥 Guía para Subir Videos Directos a Supabase Storage

## **🎯 ¿Por qué videos directos?**

Para cumplir tu criterio de aceptación del **95%**, necesitas usar videos subidos directamente. Esto te permite:

### **✅ Seguimiento preciso del 95%:**
- **Progreso en tiempo real** (segundo a segundo)
- **Detección automática** cuando el usuario alcanza el 95%
- **Analytics avanzados**: pausas, rebobinado, tiempo total de visualización
- **Validación real** del progreso del usuario

### **❌ Limitaciones de YouTube/Vimeo:**
- **No puedes medir** el progreso real del usuario
- **Solo detección manual** de finalización
- **Sin analytics** del comportamiento de visualización

---

## **📁 Configuración de Supabase Storage**

### **Paso 1: Crear el Bucket de Videos**

1. **Ve a tu proyecto de Supabase**
2. **Navega a Storage** en el panel izquierdo
3. **Crea un nuevo bucket:**
   - **Nombre**: `course-videos`
   - **Público**: ✅ Sí (para acceso directo)
   - **Límite de archivos**: 500MB por archivo (recomendado)

### **Paso 2: Configurar Políticas de Acceso**

```sql
-- Política para permitir lectura pública de videos
CREATE POLICY "Public video access" ON storage.objects
FOR SELECT USING (bucket_id = 'course-videos');

-- Política para que solo admins puedan subir videos
CREATE POLICY "Admin video upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'course-videos' 
  AND auth.jwt() ->> 'role' = 'admin'
);
```

---

## **🎬 Preparación de Videos**

### **Formatos Recomendados:**
- **Contenedor**: MP4 (mejor compatibilidad)
- **Codec de Video**: H.264
- **Codec de Audio**: AAC
- **Resolución**: 720p (1280x720) o 1080p (1920x1080)
- **Bitrate**: 2-5 Mbps para 720p, 5-10 Mbps para 1080p
- **Duración**: 15-45 minutos por unidad

### **Herramientas de Compresión:**
- **Handbrake** (gratuito): Excelente para compresión
- **FFmpeg**: Para usuarios avanzados
- **Adobe Media Encoder**: Para usuarios de Adobe

### **Configuración de Handbrake:**
1. **Preset**: "Web" → "Gmail Large 3 Minutes 720p30"
2. **Video**: H.264, RF 23 (buena calidad/tamaño)
3. **Audio**: AAC, 128 kbps

---

## **📤 Subir Videos a Supabase**

### **Opción A: Interface Web (Más fácil)**

1. **Ve a Storage** → **course-videos** en Supabase
2. **Haz clic en "Upload"**
3. **Selecciona tu archivo MP4**
4. **Espera a que se complete la subida**
5. **Copia la URL pública**

### **Opción B: JavaScript/TypeScript (Programático)**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function uploadVideo(file: File, fileName: string) {
  const { data, error } = await supabase.storage
    .from('course-videos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading video:', error)
    return null
  }

  // Obtener URL pública
  const { data: publicData } = supabase.storage
    .from('course-videos')
    .getPublicUrl(fileName)

  return publicData.publicUrl
}
```

---

## **🔄 Actualizar Base de Datos**

### **Una vez subido el video:**

```sql
-- Actualizar la unidad con la nueva URL del video
UPDATE units 
SET video_url = 'https://tu-proyecto.supabase.co/storage/v1/object/public/course-videos/introduccion-proteccion-datos.mp4'
WHERE title = 'Introducción a la Protección de Datos';

-- Verificar el cambio
SELECT title, video_url FROM units WHERE title = 'Introducción a la Protección de Datos';
```

### **Naming Convention (Recomendado):**
- `curso-{id}-unidad-{orden}-{titulo-slug}.mp4`
- Ejemplo: `curso-1-unidad-01-introduccion-proteccion-datos.mp4`

---

## **🧪 Probar la Funcionalidad**

### **Verificación paso a paso:**

1. **Sube un video de prueba** (incluso de 1-2 minutos)
2. **Actualiza la base de datos** con la nueva URL
3. **Ve a la unidad** en tu aplicación
4. **Verifica que se reproduce** correctamente
5. **Prueba el seguimiento del 95%**:
   - Ve el 94% del video → No debería completarse
   - Ve el 95% del video → Debería marcarse como completado automáticamente

### **Debugging común:**
- **Video no se reproduce**: Verifica que la URL sea pública
- **Progreso no se detecta**: Confirma que uses `AdvancedVideoPlayer`
- **95% no funciona**: Revisa la consola del navegador para errores

---

## **📊 Analytics Incluidos**

Con el nuevo `AdvancedVideoPlayer` obtienes:

### **Métricas básicas:**
- ✅ Progreso en tiempo real
- ✅ Tiempo total de visualización
- ✅ Número de pausas
- ✅ Número de rebobinados
- ✅ Porcentaje máximo alcanzado

### **Métricas avanzadas:**
- ✅ Segmentos de tiempo vistos
- ✅ Velocidades de reproducción usadas
- ✅ Tiempo en pantalla completa
- ✅ Score de engagement automático

### **Datos guardados en:**
- **Tabla**: `video_analytics`
- **Tabla**: `video_quality_metrics`

---

## **🚀 Flujo de Trabajo Completo**

### **Para cada video nuevo:**

1. **Grabar/Editar** tu contenido
2. **Exportar** en formato MP4 optimizado
3. **Subir** a Supabase Storage bucket `course-videos`
4. **Copiar** la URL pública
5. **Actualizar** la base de datos:
   ```sql
   UPDATE units 
   SET video_url = 'https://tu-url-de-supabase.mp4'
   WHERE id = 'tu-unit-id';
   ```
6. **Probar** en la aplicación
7. **Verificar** que se detecte el 95% correctamente

---

## **💰 Consideraciones de Costos**

### **Supabase Storage:**
- **1GB gratuito** en el plan gratuito
- **$0.021 por GB** después del límite gratuito
- **1TB** = aproximadamente **100-200 videos** de 30 minutos en 720p

### **Alternativas si necesitas más espacio:**
- **AWS S3** + CloudFront (CDN)
- **Google Cloud Storage**
- **Cloudinary** (optimización automática)

---

## **📝 Próximos Pasos**

1. **Crea el bucket** `course-videos` en Supabase
2. **Sube un video de prueba** (puede ser de 1-2 minutos)
3. **Actualiza la base de datos** con la nueva URL
4. **Prueba** que se detecte el 95% correctamente
5. **Procede** a subir tus videos reales de protección de datos

¿Necesitas ayuda con algún paso específico? 🚀
