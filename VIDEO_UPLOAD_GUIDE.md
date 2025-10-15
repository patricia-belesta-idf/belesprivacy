# 🎥 Guía para Subir Videos - RgpdEducation

## **📋 Resumen de Funcionalidades**

### **✅ Lo que ya funciona:**

- **Reproductor de video personalizado** con controles avanzados
- **Soporte para múltiples plataformas**: YouTube, Vimeo, archivos directos
- **Seguimiento automático del progreso** (90% visto = completado)
- **Integración con la base de datos** para marcar unidades como completadas
- **Sistema de pestañas** para alternar entre video y test

## **🚀 Opciones para Subir Videos**

### **1. YouTube (Recomendado para empezar)**

#### **Ventajas:**

- ✅ Gratis y sin límites
- ✅ Streaming automático
- ✅ Reproductor robusto
- ✅ Fácil de implementar

#### **Cómo usar:**

1. **Sube tu video a YouTube** (puedes hacerlo privado)
2. **Obtén el ID del video** de la URL: `https://www.youtube.com/watch?v=VIDEO_ID`
3. **Convierte a formato embed**: `https://www.youtube.com/embed/VIDEO_ID`
4. **Actualiza la base de datos** en la tabla `units.video_url`

#### **Ejemplo:**

```sql
UPDATE units
SET video_url = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
WHERE title = 'Introducción a la Protección de Datos';
```

### **2. Vimeo**

#### **Ventajas:**

- ✅ Mejor calidad de video
- ✅ Más profesional
- ✅ Controles avanzados

#### **Cómo usar:**

1. **Sube tu video a Vimeo**
2. **Obtén el ID del video** de la URL: `https://vimeo.com/VIDEO_ID`
3. **Convierte a formato embed**: `https://player.vimeo.com/video/VIDEO_ID`
4. **Actualiza la base de datos**

### **3. Archivos Directos (Supabase Storage)**

#### **Ventajas:**

- ✅ Control total
- ✅ Privacidad completa
- ✅ Sin dependencias externas

#### **Desventajas:**

- ❌ Límites de almacenamiento
- ❌ Costos adicionales
- ❌ Más complejo de implementar

## **📊 Estructura de la Base de Datos**

### **Tabla `units`:**

```sql
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL,
  video_url TEXT NOT NULL,  -- Aquí va la URL del video
  duration INTEGER NOT NULL, -- Duración en minutos
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Tabla `user_progress`:**

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  unit_id UUID REFERENCES units(id),
  video_watched BOOLEAN DEFAULT FALSE,
  video_watched_at TIMESTAMP,
  quiz_passed BOOLEAN DEFAULT FALSE,
  quiz_passed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## **🔧 Cómo Actualizar Videos en la Base de Datos**

### **Opción 1: SQL Directo**

```sql
-- Actualizar un video específico
UPDATE units
SET video_url = 'https://www.youtube.com/embed/TU_VIDEO_ID'
WHERE title = 'Nombre de la Unidad';

-- Verificar el cambio
SELECT title, video_url FROM units WHERE title = 'Nombre de la Unidad';
```

### **Opción 2: Panel de Supabase**

1. Ve a tu proyecto de Supabase
2. Navega a **Table Editor** → **units**
3. Encuentra la unidad que quieres actualizar
4. Haz clic en **Edit** y cambia el campo `video_url`
5. Guarda los cambios

### **Opción 3: API de Supabase**

```javascript
const { error } = await supabase
  .from("units")
  .update({
    video_url: "https://www.youtube.com/embed/TU_VIDEO_ID",
  })
  .eq("title", "Nombre de la Unidad");
```

## **📱 Formatos de Video Recomendados**

### **Para YouTube/Vimeo:**

- **Resolución**: 720p (1280x720) o 1080p (1920x1080)
- **Formato**: MP4 (H.264)
- **Bitrate**: 2-8 Mbps para 720p, 5-15 Mbps para 1080p
- **Duración**: 15-45 minutos por unidad

### **Para archivos directos:**

- **Formato**: MP4 (H.264) o WebM
- **Codec de audio**: AAC o MP3
- **Tamaño máximo**: 500MB por video (recomendado)

## **🎯 Flujo de Trabajo Recomendado**

### **Paso 1: Preparar el Video**

1. **Grabar** tu contenido de protección de datos
2. **Editar** para mantener la calidad y duración apropiada
3. **Exportar** en formato MP4 con resolución 720p o 1080p

### **Paso 2: Subir a YouTube**

1. **Crear cuenta** de YouTube (puede ser privada)
2. **Subir video** con título descriptivo
3. **Configurar privacidad** (privado o no listado)
4. **Obtener URL de embed**

### **Paso 3: Actualizar Base de Datos**

1. **Conectar** a tu proyecto de Supabase
2. **Ejecutar SQL** para actualizar `video_url`
3. **Verificar** que el cambio se aplicó correctamente

### **Paso 4: Probar en la Aplicación**

1. **Navegar** a la unidad en tu aplicación
2. **Verificar** que el video se reproduce correctamente
3. **Probar** el seguimiento del progreso

## **🚨 Solución de Problemas**

### **Video no se reproduce:**

- ✅ Verifica que la URL sea correcta
- ✅ Asegúrate de que el video no sea privado
- ✅ Revisa la consola del navegador para errores

### **Progreso no se registra:**

- ✅ Verifica que el usuario esté autenticado
- ✅ Revisa la consola para errores de base de datos
- ✅ Confirma que la función `handleVideoEnd` se ejecute

### **Error de permisos:**

- ✅ Verifica las políticas RLS en Supabase
- ✅ Confirma que el usuario tenga acceso al curso
- ✅ Revisa los logs de Supabase

## **📈 Próximos Pasos**

### **Mejoras futuras:**

- [ ] **Analytics de video**: Tiempo de visualización, pausas, rebobinado
- [ ] **Subtítulos**: Soporte para archivos .srt
- [ ] **Calidad adaptativa**: Cambio automático de resolución
- [ ] **Descarga offline**: Para usuarios premium
- [ ] **Transcripciones**: Texto del video para búsqueda

### **Integración con IA:**

- [ ] **Resumen automático** del contenido del video
- [ ] **Generación de preguntas** basadas en el contenido
- [ ] **Detección de conceptos clave** para el test

---

## **💡 Consejos Finales**

1. **Empieza con YouTube** para validar la funcionalidad
2. **Mantén videos cortos** (15-30 minutos) para mejor retención
3. **Usa títulos descriptivos** para facilitar la gestión
4. **Prueba en diferentes dispositivos** antes de publicar
5. **Monitorea el rendimiento** de los videos en Analytics

¿Necesitas ayuda con algún paso específico? ¡Estoy aquí para ayudarte! 🚀
