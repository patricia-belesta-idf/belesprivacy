# RgpdEducation - Plataforma de Cursos de Protección de Datos

RgpdEducation es una plataforma de aprendizaje especializada en protección de datos personales, privacidad y cumplimiento normativo. La aplicación permite a los usuarios inscribirse en cursos, ver videos educativos y tomar evaluaciones para medir su progreso.

## 🚀 Características Principales

- **Sistema de Autenticación**: Integración completa con Supabase Auth
- **Gestión de Cursos**: Catálogo de cursos especializados en protección de datos
- **Sistema de Unidades**: Contenido organizado en unidades con videos y tests
- **Evaluaciones Interactivas**: Tests con preguntas de opción múltiple y explicaciones
- **Seguimiento de Progreso**: Dashboard personalizado con estadísticas de aprendizaje
- **Diseño Responsivo**: Interfaz moderna y minimalista inspirada en Notion
- **Componentes shadcn/ui**: Sistema de diseño consistente y accesible
- **Splash Cursor Animation**: Efecto de fluido WebGL interactivo
- **Multilingüe**: Soporte para Español, Inglés y Ruso

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: shadcn/ui, Lucide React
- **Estado**: React Context API
- **Base de Datos**: PostgreSQL con Row Level Security (RLS)
- **Hosting**: Vercel (Serverless)
- **Animaciones**: WebGL, Canvas API

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase (gratuita)
- Cuenta de Vercel (gratuita)
- Git

## 🚀 Instalación Completa - Paso a Paso

### 1. 📁 Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/rgpd-education.git
cd rgpd-education

# O si es un fork empresarial
git clone https://github.com/empresa/rgpd-education.git
cd rgpd-education
```

### 2. 📦 Instalar Dependencias

```bash
# Instalar todas las dependencias
npm install

# Verificar que todo esté instalado correctamente
npm run build
```

### 3. 🗄️ Configurar Supabase (Backend)

#### 3.1 Crear Proyecto en Supabase

1. **Ve a [supabase.com](https://supabase.com)**
2. **Crea una cuenta** o inicia sesión
3. **"New Project"**:
   - **Name**: `rgpd-education-empresa` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura y guárdala
   - **Region**: Elige la más cercana a tus usuarios
4. **Espera** a que se complete la creación (2-3 minutos)

#### 3.2 Configurar la Base de Datos

1. **En tu proyecto de Supabase**, ve a **SQL Editor**
2. **Copia todo el contenido** del archivo `supabase-schema.sql`
3. **Pega y ejecuta** el script completo
4. **Verifica** que se hayan creado todas las tablas:
   - `profiles`
   - `courses`
   - `units`
   - `quizzes`
   - `quiz_questions`
   - `enrollments`
   - `quiz_attempts`
   - `user_progress`
   - `video_analytics`
   - `video_quality_metrics`

#### 3.3 Configurar Autenticación

1. **Ve a Authentication > Settings**
2. **Configura las URLs**:
   - **Site URL**: `http://localhost:3008` (desarrollo)
   - **Redirect URLs**:
     ```
     http://localhost:3008/dashboard
     http://localhost:3008/courses
     https://tu-dominio.com/dashboard
     https://tu-dominio.com/courses
     ```

#### 3.4 Configurar Storage (para videos - opcional)

1. **Ve a Storage**
2. **Create bucket**:
   - **Name**: `course-videos`
   - **Public**: ✅ Sí
3. **Configurar políticas** (copia y pega en SQL Editor):

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

### 4. 🔧 Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3008
NEXT_PUBLIC_COMPANY_NAME="Tu Empresa"

# Development
NODE_ENV=development
```

**¿Dónde encontrar estas claves?**

1. **En Supabase** → **Settings** → **API**
2. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 5. 🎬 Configurar Videos

#### Opción A: YouTube (Recomendado para empezar)

1. **Crea un canal de YouTube** (puede ser privado)
2. **Sube tus videos** (pueden ser "No listados")
3. **Obtén el ID** de cada video: `https://www.youtube.com/watch?v=VIDEO_ID`
4. **Convierte a formato embed**: `https://www.youtube.com/embed/VIDEO_ID`
5. **Actualiza la base de datos**:

```sql
-- Ejemplo: Actualizar URL de video
UPDATE units
SET video_url = 'https://www.youtube.com/embed/TU_VIDEO_ID'
WHERE title = 'Introducción a la Protección de Datos';
```

#### Opción B: Supabase Storage (Videos propios)

1. **Ve a Storage** → **course-videos**
2. **Upload** tus archivos MP4
3. **Copia la URL pública** de cada video
4. **Actualiza la base de datos** con las nuevas URLs

### 6. 🚀 Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev

# La aplicación estará disponible en:
# http://localhost:3008
```

### 7. 🧪 Verificar que Todo Funciona

1. **Abre** `http://localhost:3008`
2. **Verifica** que la página principal carga
3. **Prueba** el registro de un usuario
4. **Verifica** que puedes acceder al dashboard
5. **Prueba** la reproducción de videos
6. **Verifica** que los tests funcionan

---

## 🌐 Despliegue a Producción

### 1. 🚀 Desplegar en Vercel

#### 1.1 Preparar el Repositorio

```bash
# Asegúrate de que todo esté committeado
git add .
git commit -m "Ready for production deployment"
git push origin main
```

#### 1.2 Configurar Vercel

1. **Ve a [vercel.com](https://vercel.com)**
2. **"New Project"**
3. **Import from GitHub** → Selecciona tu repositorio
4. **Configure**:
   - **Project Name**: `rgpd-education-empresa`
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (por defecto)

#### 1.3 Configurar Variables de Entorno en Vercel

1. **En tu proyecto de Vercel** → **Settings** → **Environment Variables**
2. **Agrega todas las variables**:

```
NEXT_PUBLIC_SUPABASE_URL = https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = tu_anon_key
SUPABASE_SERVICE_ROLE_KEY = tu_service_role_key
NEXT_PUBLIC_APP_URL = https://tu-dominio.com
NEXT_PUBLIC_COMPANY_NAME = Tu Empresa
NODE_ENV = production
```

3. **Deploy** automáticamente

### 2. 🌐 Configurar Dominio Personalizado

#### 2.1 En Vercel

1. **Settings** → **Domains**
2. **Add Domain**: `curso.empresa.com`
3. **Copia la configuración DNS** que te da Vercel

#### 2.2 En tu Proveedor DNS

**Configuración típica:**

```
Tipo: CNAME
Nombre: curso
Valor: cname.vercel-dns.com
TTL: 3600
```

**Proveedores comunes:**

**Cloudflare:**

```
Type: CNAME
Name: curso
Target: cname.vercel-dns.com
Proxy status: DNS only (nube gris)
```

**GoDaddy:**

```
Host: curso
Points to: cname.vercel-dns.com
TTL: 1 Hour
```

#### 2.3 Verificar DNS

```bash
# Verificar que el DNS esté propagado
nslookup curso.empresa.com

# Debería mostrar:
# curso.empresa.com canonical name = cname.vercel-dns.com
```

### 3. 🔄 Actualizar URLs en Supabase

1. **Ve a Authentication > Settings**
2. **Actualiza las URLs**:
   - **Site URL**: `https://curso.empresa.com`
   - **Redirect URLs**:
     ```
     https://curso.empresa.com/dashboard
     https://curso.empresa.com/courses
     ```

---

## 📊 Estructura del Proyecto

```
rgpd-education/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Rutas de autenticación
│   │   │   ├── login/         # Página de login
│   │   │   └── signup/        # Página de registro
│   │   ├── courses/           # Páginas de cursos
│   │   │   ├── [courseId]/    # Página de curso específico
│   │   │   │   └── units/     # Unidades del curso
│   │   │   │       └── [unitId]/ # Página de unidad
│   │   │   └── page.tsx       # Lista de cursos
│   │   ├── dashboard/         # Dashboard del usuario
│   │   ├── privacy/           # Política de privacidad
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página principal
│   ├── components/            # Componentes reutilizables
│   │   ├── auth/              # Componentes de autenticación
│   │   ├── dashboard/         # Componentes del dashboard
│   │   ├── layout/            # Componentes de layout
│   │   ├── ui/                # Componentes de shadcn/ui
│   │   │   └── SplashCursor.tsx # Animación de cursor
│   │   └── video/             # Reproductores de video
│   ├── contexts/              # Contextos de React
│   │   ├── AuthContext.tsx    # Contexto de autenticación
│   │   └── LanguageContext.tsx # Contexto de idiomas
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilidades y configuraciones
│   │   ├── supabase.ts        # Cliente de Supabase
│   │   └── utils.ts           # Utilidades generales
│   ├── messages/              # Archivos de traducción
│   │   ├── es.json            # Español
│   │   ├── en.json            # Inglés
│   │   └── ru.json            # Ruso
│   └── types/                 # Tipos de TypeScript
├── supabase-schema.sql        # Esquema de la base de datos
├── anti-cheat-tables-only.sql # Tablas anti-trampa
├── package.json               # Dependencias del proyecto
└── README.md                  # Este archivo
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Página Principal

- Landing page atractiva con información del curso
- Sección de características destacadas
- Llamadas a la acción para registro
- **Splash Cursor Animation** con efecto de fluido WebGL

### ✅ Sistema de Autenticación

- Registro e inicio de sesión con Supabase
- Interfaz de usuario multilingüe
- Gestión de sesiones de usuario
- Formularios dinámicos (login/signup)

### ✅ Catálogo de Cursos

- Lista de cursos disponibles
- Información detallada de cada curso
- Sistema de inscripción
- Botón de contacto por email

### ✅ Dashboard del Usuario

- Estadísticas de progreso
- Cursos inscritos
- Métricas de aprendizaje
- Navegación intuitiva

### ✅ Sistema de Unidades

- Navegación entre unidades del curso
- Reproductor de video avanzado con analytics
- Tests de evaluación
- Seguimiento de progreso en tiempo real

### ✅ Sistema de Evaluación

- Preguntas de opción múltiple
- Explicaciones de respuestas
- Cálculo de puntuaciones
- Requisito de aprobación para continuar
- Sistema anti-trampa

### ✅ Política de Privacidad

- Página completa de política de privacidad
- Diseño futurista y atractivo
- Contenido traducido
- Navegación interactiva

---

## 🔧 Configuración de la Base de Datos

### Tablas Principales

- **profiles**: Perfiles de usuario extendidos
- **courses**: Información de los cursos
- **units**: Unidades de cada curso
- **quizzes**: Evaluaciones de las unidades
- **quiz_questions**: Preguntas de los tests
- **enrollments**: Inscripciones de usuarios
- **quiz_attempts**: Intentos de evaluación
- **user_progress**: Seguimiento del progreso
- **video_analytics**: Analytics de reproducción de videos
- **video_quality_metrics**: Métricas de calidad de video

### Políticas de Seguridad (RLS)

- Usuarios solo pueden ver y modificar sus propios datos
- Cursos públicos visibles para todos
- Contenido protegido solo para usuarios inscritos
- Analytics protegidos por usuario

---

## 🎨 Personalización

### Temas y Colores

La aplicación utiliza un sistema de colores basado en Tailwind CSS. Los colores principales se pueden modificar en:

- `src/app/globals.css` - Variables CSS personalizadas
- `tailwind.config.js` - Configuración de Tailwind

### Componentes

Todos los componentes utilizan shadcn/ui, que se pueden personalizar:

```bash
npx shadcn@latest add [component-name]
```

### Traducciones

Para agregar nuevos idiomas o modificar traducciones:

1. **Crea un nuevo archivo** en `src/messages/` (ej: `fr.json`)
2. **Agrega las traducciones** siguiendo la estructura existente
3. **Actualiza** `src/contexts/LanguageContext.tsx`

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo en puerto 3008

# Producción
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter de código

# Utilidades
npm run type-check   # Verificación de tipos TypeScript
```

---

## 🔒 Seguridad

- Autenticación con Supabase Auth
- Row Level Security (RLS) en PostgreSQL
- Validación de datos en el frontend y backend
- Políticas de acceso granular
- Sistema anti-trampa en videos y quizzes
- Protección contra ataques comunes

---

## 📱 Características Responsivas

- Diseño mobile-first
- Navegación adaptativa
- Componentes optimizados para móviles
- Breakpoints de Tailwind CSS
- Touch-friendly en dispositivos móviles

---

## 🧪 Testing

Para ejecutar las pruebas:

```bash
npm run test
```

---

## 🆘 Troubleshooting

### Problemas Comunes

#### 1. Error de conexión a Supabase

```
Error: Invalid API key
```

**Solución**: Verifica que las variables de entorno estén correctas en `.env.local`

#### 2. Videos no se reproducen

```
Error: Video not found
```

**Solución**: Verifica que las URLs de video en la base de datos sean correctas

#### 3. Error de autenticación

```
Error: Invalid redirect URL
```

**Solución**: Actualiza las URLs de redirección en Supabase Auth settings

#### 4. SplashCursor no funciona

```
Error: WebGL not supported
```

**Solución**: El componente se desactiva automáticamente en navegadores sin WebGL

### Logs y Debugging

```bash
# Ver logs de desarrollo
npm run dev

# Ver logs de build
npm run build

# Verificar tipos
npm run type-check
```

---

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🆘 Soporte

Si tienes problemas o preguntas:

1. **Revisa** este README completo
2. **Consulta** la documentación de [Supabase](https://supabase.com/docs)
3. **Revisa** los issues del repositorio
4. **Crea** un nuevo issue con detalles del problema

---

## 🎉 Agradecimientos

- [Supabase](https://supabase.com) por la infraestructura backend
- [shadcn/ui](https://ui.shadcn.com) por los componentes de UI
- [Next.js](https://nextjs.org) por el framework de React
- [Tailwind CSS](https://tailwindcss.com) por el sistema de estilos
- [ReactBits](https://reactbits.dev) por la inspiración del SplashCursor

---

**RgpdEducation** - Transformando la educación en protección de datos, una unidad a la vez. 🚀

---

## 📞 Contacto

Para soporte técnico o consultas sobre la implementación:

- **Email**: soporte@empresa.com
- **Documentación**: [Enlace a docs internas]
- **Slack**: #rgpd-education-support
