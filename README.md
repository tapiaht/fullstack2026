# Generic Fullstack Framework 🚀

> **Tu plantilla definitiva para el desarrollo rápido de aplicaciones Fullstack con Next.js 16.**

Este proyecto no es solo un boilerplate; es un **framework ligero y configurable** diseñado para adaptarse a tu dominio de negocio. Ya sea que estés construyendo un E-commerce, un Blog, un CRM o un sistema de inventario, esta plantilla te permite definir tu entidad principal y generar automáticamente la base de datos, la autenticación y la interfaz de usuario.

---

## ⚡ Características Principales

-   **Configuración Declarativa**: Define tu aplicación y tus datos en `domain.config.ts`. ¡El sistema se adapta a ti!
-   **Generadores CLI Inteligentes**: Scripts automatizados que crean tu esquema de Prisma, tus Server Actions y tus páginas de Dashboard en segundos.
-   **Stack Moderno & Robusto**:
    -   **Framework**: Next.js 16 (App Router & Server Actions).
    -   **Base de Datos**: PostgreSQL con Prisma ORM.
    -   **Autenticación**: Better-Auth (Segura, moderna y sin vendor lock-in).
    -   **Estilos**: Tailwind CSS + Shadcn/UI.
    -   **Almacenamiento**: Abstracción lista para Cloudinary (o fallbacks locales).
-   **Arquitectura Limpia**: Separación clara entre configuración, núcleo (core) e interfaz de usuario.

---

## 🛠️ Guía de Uso Rápido

Sigue estos pasos para transformar esta plantilla en tu propia aplicación en minutos:

### 1. Instalación
```bash
git clone https://github.com/tapiaht/fullstack2026.git mi-proyecto
cd mi-proyecto
npm install
```

### 2. Configuración de Entorno
Crea un archivo `.env` en la raíz (puedes basarte en `.env.example` si existe) con:
```env
# Base de Datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/mibasededatos"

# Autenticación (Better-Auth)
BETTER_AUTH_SECRET="tu_secreto_super_seguro"
BETTER_AUTH_URL="http://localhost:3000"

# Almacenamiento (Opcional, para imágenes)
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
```

### 3. **El Paso Mágico**: Define tu Dominio 🪄
Edita el archivo `src/config/domain.config.ts`. Aquí es donde ocurre la magia. Cambia el nombre de la entidad (ej. de 'Product' a 'Post', 'Task', 'Patient') y define sus campos.

```typescript
// src/config/domain.config.ts
export const domainConfig = {
    entity: {
        name: 'Curso',
        namePlural: 'Cursos',
        fields: [
            { name: 'titulo', type: 'string', required: true },
            { name: 'precio', type: 'number' },
            { name: 'portada', type: 'image' }
        ]
        // ...
    }
}
```

### 4. Genera tu Aplicación
Ejecuta los generadores para construir tu backend y frontend:

```bash
# 1. Generar el esquema de base de datos basado en tu config
npm run generate:schema

# 2. Sincronizar la base de datos (¡Cuidado! Esto puede resetear datos en desarrollo)
npx prisma db push --force-reset

# 3. Generar las páginas del Dashboard (Grid, Formularios de Crear/Editar)
npm run generate:pages
```

### 5. ¡A Desarrollar!
```bash
npm run dev
```
Visita `http://localhost:3000` y regístrate. ¡Tu dashboard CRUD completo ya está listo!

---

## 🎯 Alcances y Limitaciones

### ✅ Lo que SÍ hace (Alcance)
-   **CRUD Completo**: Genera operaciones de Crear, Leer, Actualizar y Borrar para tu entidad principal.
-   **Gestión de Imágenes**: Maneja subidas y actualizaciones de imágenes transparentemente.
-   **Tipos de Datos Variados**: Soporta texto (input/textarea), números, booleanos, fechas e imágenes.
-   **Autenticación de Usuarios**: Flujos completos de Login y Registro listos para usar.
-   **UI Responsiva**: Dashboard adaptable a móviles y escritorio.

### ❌ Lo que NO hace (Aún)
-   **Múltiples Entidades Relacionales**: Actualmente, los generadores están optimizados para una entidad principal potente. Las relaciones complejas (ej. Comentarios dentro de Posts) requieren código manual adicional.
-   **Pasarela de Pagos**: No incluye integración pre-construida con Stripe/PayPal (aunque es fácil de añadir).
-   **Lógica de Negocio Compleja**: Los generadores crean una base sólida, pero las reglas de negocio específicas (ej. "enviar email si el stock < 10") deben implementarse manualmente en los Server Actions.

---

## 🏗️ Detalles de Implementación

El proyecto sigue una estructura modular:

-   `src/config/`: El cerebro de la app. Define QUÉ es tu app.
-   `src/cli/`: Herramientas que leen la config y escriben código por ti.
-   `src/core/`: Lógica agnóstica del dominio (Servicios de Storage, Acciones Genéricas).
-   `src/components/core/`: Componentes UI "inteligentes" (`EntityForm`, `EntityGrid`) que se renderizan dinámicamente según la configuración.

---

## 🤝 Contribuciones y Feedback

Esta plantilla es un proyecto vivo y tu opinión es vital para su evolución.

-   ¿Encontraste un bug?
-   ¿Tienes una idea para un nuevo generador?
-   ¿Quieres mejorar la documentación?

**¡Me encantaría recibir tus preguntas, sugerencias y Pull Requests!**
Ayúdame a hacer de esta la mejor plantilla fullstack para la comunidad. Abre un [Issue](https://github.com/tapiaht/fullstack2026/issues) o contáctame directamente.

---

Hecho con ❤️ por [TapiaHT](https://github.com/tapiaht)
