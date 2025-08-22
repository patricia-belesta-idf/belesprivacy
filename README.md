# BelesPrivacy - Plataforma de Cursos de Protección de Datos

BelesPrivacy es una plataforma de aprendizaje especializada en protección de datos personales, privacidad y cumplimiento normativo. La aplicación permite a los usuarios inscribirse en cursos, ver videos educativos y tomar evaluaciones para medir su progreso.

## 🚀 Características Principales

- **Sistema de Autenticación**: Integración completa con Supabase Auth
- **Gestión de Cursos**: Catálogo de cursos especializados en protección de datos
- **Sistema de Unidades**: Contenido organizado en unidades con videos y tests
- **Evaluaciones Interactivas**: Tests con preguntas de opción múltiple y explicaciones
- **Seguimiento de Progreso**: Dashboard personalizado con estadísticas de aprendizaje
- **Diseño Responsivo**: Interfaz moderna y minimalista inspirada en Notion
- **Componentes shadcn/ui**: Sistema de diseño consistente y accesible

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: shadcn/ui, Lucide React
- **Estado**: React Context API
- **Base de Datos**: PostgreSQL con Row Level Security (RLS)

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase (gratuita)

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd belesprivacy
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 4. Configurar Supabase

#### 4.1 Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

#### 4.2 Configurar la Base de Datos

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido del archivo `supabase-schema.sql`
3. Ejecuta el script para crear todas las tablas y políticas

#### 4.3 Configurar Autenticación

1. Ve a **Authentication > Settings**
2. Configura las URLs de redirección:
   - Site URL: `http://localhost:3000` (desarrollo)
   - Redirect URLs: `http://localhost:3000/dashboard`

### 5. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
belesprivacy/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── courses/           # Páginas de cursos
│   │   ├── dashboard/         # Dashboard del usuario
│   │   └── page.tsx           # Página principal
│   ├── components/            # Componentes reutilizables
│   │   ├── auth/              # Componentes de autenticación
│   │   ├── layout/            # Componentes de layout
│   │   └── ui/                # Componentes de shadcn/ui
│   ├── contexts/              # Contextos de React
│   ├── lib/                   # Utilidades y configuraciones
│   └── types/                 # Tipos de TypeScript
├── supabase-schema.sql        # Esquema de la base de datos
└── README.md                  # Este archivo
```

## 🎯 Funcionalidades Implementadas

### ✅ Página Principal

- Landing page atractiva con información del curso
- Sección de características destacadas
- Llamadas a la acción para registro

### ✅ Sistema de Autenticación

- Registro e inicio de sesión con Supabase
- Interfaz de usuario en español
- Gestión de sesiones de usuario

### ✅ Catálogo de Cursos

- Lista de cursos disponibles
- Información detallada de cada curso
- Sistema de inscripción

### ✅ Dashboard del Usuario

- Estadísticas de progreso
- Cursos inscritos
- Métricas de aprendizaje

### ✅ Sistema de Unidades

- Navegación entre unidades del curso
- Reproductor de video integrado
- Tests de evaluación

### ✅ Sistema de Evaluación

- Preguntas de opción múltiple
- Explicaciones de respuestas
- Cálculo de puntuaciones
- Requisito de aprobación para continuar

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

### Políticas de Seguridad (RLS)

- Usuarios solo pueden ver y modificar sus propios datos
- Cursos públicos visibles para todos
- Contenido protegido solo para usuarios inscritos

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

## 🚀 Despliegue

### Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Despliegue en Supabase

1. En tu proyecto de Supabase, ve a **Settings > General**
2. Configura el dominio personalizado
3. Actualiza las variables de entorno

## 📱 Características Responsivas

- Diseño mobile-first
- Navegación adaptativa
- Componentes optimizados para móviles
- Breakpoints de Tailwind CSS

## 🔒 Seguridad

- Autenticación con Supabase Auth
- Row Level Security (RLS) en PostgreSQL
- Validación de datos en el frontend y backend
- Políticas de acceso granular

## 🧪 Testing

Para ejecutar las pruebas:

```bash
npm run test
```

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación de Supabase
2. Consulta los issues del repositorio
3. Crea un nuevo issue con detalles del problema

## 🎉 Agradecimientos

- [Supabase](https://supabase.com) por la infraestructura backend
- [shadcn/ui](https://ui.shadcn.com) por los componentes de UI
- [Next.js](https://nextjs.org) por el framework de React
- [Tailwind CSS](https://tailwindcss.com) por el sistema de estilos

---

**BelesPrivacy** - Transformando la educación en protección de datos, una unidad a la vez. 🚀
