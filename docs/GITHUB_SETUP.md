# Guía de Publicación en GitHub

Esta guía te ayudará a subir tu proyecto "Generic App Framework" a GitHub.

## Prerrequisitos
- Tener una cuenta en [GitHub](https://github.com/).
- Tener `git` instalado en tu terminal.

## Pasos para subir el proyecto

### 1. Inicializar Git
Si aún no lo has hecho, inicializa el repositorio en la carpeta raíz del proyecto:

```bash
git init
```

### 2. Configurar .gitignore
Asegúrate de que tu archivo `.gitignore` incluya lo siguiente para evitar subir secretos o archivos innecesarios:

```text
node_modules
.next
.env
.env.local
build
dist
.DS_Store
```

### 3. Crear el Repositorio en GitHub
1. Ve a https://github.com/new.
2. Escribe un nombre para el repositorio (ej: `nextjs-generic-framework`).
3. Elige **Público** o **Privado**.
4. **NO** marques "Initialize this repository with a README" (ya tenemos archivos locales).
5. Haz clic en "Create repository".

### 4. Conectar y Subir
Copia los comandos que te da GitHub bajo "...or push an existing repository from the command line" y ejecútalos en tu terminal:

```bash
# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Generic Framework with Blog CMS configuration"

# Renombrar rama a main (si es necesario)
git branch -M main

# Conectar con el repositorio remoto (reemplaza TU_USUARIO y TU_REPO)
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# Subir cambios
git push -u origin main
```

## Configuración de Entorno (CI/CD o Deploy)

Si planeas desplegar esto en Vercel o Netlify, recuerda configurar las siguientes variables de entorno en el panel de control del hosting:

- `DATABASE_URL` (Tu conexión a PostgreSQL)
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `CLOUDINARY_URL` (o las credenciales individuales de Cloudinary)

---
**Nota:** Para cambiar el propósito de la app en el futuro, solo edita `src/config/domain.config.ts` y ejecuta los scripts de generación documentados en el README.
