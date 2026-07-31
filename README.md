# El Rincón del Vino

E-commerce full stack de vinos desarrollado con React, Flask y PostgreSQL. Permite explorar un catálogo, buscar y filtrar productos, registrarse, iniciar sesión y gestionar un carrito persistente.

> El proyecto nació como trabajo final de un equipo de cuatro estudiantes en el bootcamp de 4Geeks Academy. Actualmente es mantenido y evolucionado de manera individual por [Jorge Oteiza](https://github.com/JorgeOteiza), responsable de su estabilización, seguridad, documentación y preparación para portafolio.

## Funciones actuales

- Catálogo de vinos por tipo y categoría.
- Búsqueda y detalle de productos.
- Registro e inicio de sesión con contraseñas hasheadas.
- Autenticación mediante JWT y rutas privadas.
- Carrito persistente en `localStorage`.
- Perfil y eliminación protegida de cuenta.
- API REST con Flask y SQLAlchemy.
- Base PostgreSQL con migraciones Alembic.
- Checkout demostrativo. No procesa pagos reales.

Favoritos, recuperación de contraseña e historial completo continúan en proceso de renovación y no deben considerarse funciones terminadas.

## Tecnologías

- Frontend: React 18, React Router, Context API, Bootstrap y Webpack.
- Backend: Python 3.12, Flask, Flask-JWT-Extended y SQLAlchemy.
- Datos: PostgreSQL y Flask-Migrate/Alembic.
- Herramientas: Pipenv, npm y Git.

## Ejecución local

### Requisitos

- Python 3.12
- Pipenv
- Node.js
- PostgreSQL 16 o una base PostgreSQL compatible

### 1. Configuración

Clona el repositorio y crea el archivo local de entorno:

```bash
cp .env.example .env
```

Edita como mínimo:

```env
SECRET_KEY=una-clave-local-larga-y-aleatoria
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/rincon_del_vino
```

El archivo `.env` contiene credenciales locales y está excluido de Git.

### 2. Backend

```bash
pipenv install
pipenv run upgrade
pipenv run insert-test-data
pipenv run dev
```

La API queda disponible en `http://127.0.0.1:3001`.

### 3. Frontend

En otra terminal:

```bash
npm ci --legacy-peer-deps
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

## Comandos útiles

```bash
pipenv run dev               # Backend con depuración
pipenv run upgrade           # Aplicar migraciones
pipenv run insert-test-data  # Crear catálogo demo de forma idempotente
npm run dev                  # Frontend de desarrollo
npm run build                # Build de producción
```

## Arquitectura

```text
React + Context API + localStorage
                |
                | JSON / HTTP
                v
        API REST con Flask
                |
                v
      SQLAlchemy + PostgreSQL
```

El frontend centraliza las peticiones en `src/front/js/services/api.js`. El backend expone sus rutas bajo `/api`, identifica al usuario mediante JWT y persiste la información con SQLAlchemy.

## Estado del proyecto

El proyecto está en modernización activa para convertirse en una demostración profesional de desarrollo full stack. Las prioridades actuales son completar los flujos de usuario, añadir pruebas automatizadas, mejorar accesibilidad y optimizar los recursos visuales.

## Autoría y evolución

La primera versión fue desarrollada colaborativamente durante el bootcamp por Natalia, Matías, Jorge y Demian. La etapa actual de mantenimiento, refactorización y preparación para portafolio es liderada individualmente por Jorge Oteiza.
