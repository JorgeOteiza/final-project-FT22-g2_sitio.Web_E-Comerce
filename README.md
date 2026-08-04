# El Rincón del Vino

E-commerce full stack de vinos desarrollado con React, Flask y PostgreSQL. Incluye catálogo, búsqueda y filtros, autenticación, carrito, favoritos persistentes, perfil e historial de compras.

**Estado:** preparado para demostración local y despliegue mediante Render Blueprint. La URL pública se agregará aquí al activar el servicio.

> La primera versión fue creada por un equipo de cuatro estudiantes como proyecto final de 4Geeks Academy. Actualmente Jorge Oteiza lidera individualmente su mantenimiento, estabilización, documentación y evolución para portafolio.

## Funciones principales

- Catálogo realista de vinos chilenos por tipo y categoría.
- Búsqueda, filtros y vista detallada de productos.
- Registro, inicio de sesión con JWT y rutas privadas.
- Contraseñas almacenadas mediante hash seguro.
- Carrito persistente en el navegador.
- Favoritos persistentes por usuario en PostgreSQL.
- Perfil e historial de compras.
- API REST construida con Flask y SQLAlchemy.
- Migraciones de base de datos con Alembic.
- Checkout transaccional demostrativo: valida inventario, descuenta stock y registra la orden completa.
- Diseño adaptable, estados de carga y catálogo accesible desde dispositivos móviles.

## Tecnologías

- **Frontend:** React 18, React Router, Context API, Bootstrap y Webpack.
- **Backend:** Python 3.12, Flask, Flask-JWT-Extended y SQLAlchemy.
- **Datos:** PostgreSQL y Flask-Migrate/Alembic.
- **Calidad:** `unittest`, compilación de producción y GitHub Actions.

## Ejecución local

### Requisitos

- Python 3.12
- Pipenv
- Node.js 20 o 22
- PostgreSQL 16 o compatible

### 1. Configuración

Clona el repositorio y crea el archivo local de entorno a partir de `.env.example`:

```bash
cp .env.example .env
```

Configura como mínimo:

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

## Verificación

```bash
pipenv run python -m unittest discover -s tests -v
npm run build
```

Las pruebas utilizan SQLite en memoria y no modifican la base PostgreSQL local.

## Arquitectura

```mermaid
flowchart LR
    UI[React 18 + React Router] -->|JSON / HTTP| API[API REST Flask]
    API --> AUTH[JWT y control de acceso]
    API --> ORM[SQLAlchemy]
    ORM --> DB[(PostgreSQL)]
    UI --> LOCAL[Carrito en localStorage]
```

El frontend centraliza las peticiones en `src/front/js/services/api.js`. El backend publica sus rutas bajo `/api`, identifica al usuario mediante JWT y persiste la información con SQLAlchemy.

## Alcance del pago

El checkout valida el carrito en el servidor, calcula los precios vigentes, descuenta stock y registra la orden de forma atómica. Sigue siendo una demostración: no se conecta a Webpay, PayPal ni a otros procesadores, y no debe utilizarse para ingresar datos bancarios reales.

Para probar la validación visual utiliza `4242 4242 4242 4242`, una fecha futura y cualquier CVC de tres dígitos. Ningún dato bancario se envía ni se almacena.

## Usuario de demostración

Al ejecutar `pipenv run insert-test-users 1` se crea de forma idempotente:

```text
Correo: test_user1@test.com
Contraseña: Demo1234
```

Usa exclusivamente esta cuenta o correos ficticios. El servicio de recuperación de contraseña está deshabilitado intencionalmente en la demo.

## Calidad y seguridad

- Los precios y el total se recalculan en el servidor.
- El checkout bloquea y valida stock antes de confirmar una orden.
- Perfil, favoritos, historial y compras requieren un JWT vigente.
- Un usuario no puede consultar ni eliminar la cuenta de otro usuario.
- El catálogo público no expone operaciones de escritura.
- GitHub Actions ejecuta pruebas de API, pruebas de validación frontend y el build de producción.
- Los errores de autenticación y disponibilidad muestran estados comprensibles.

## Despliegue

El archivo `render.yaml` crea la aplicación y PostgreSQL, genera una clave secreta, ejecuta las migraciones y carga el catálogo y usuario demo. En Render selecciona **New > Blueprint**, conecta este repositorio y revisa el nombre disponible del servicio antes de confirmar.

Si cambias el nombre `el-rincon-del-vino`, actualiza también `FRONTEND_URL` en `render.yaml` con la URL definitiva.

## Autoría y evolución

La versión inicial fue desarrollada colaborativamente durante el bootcamp por Natalia, Matías, Jorge y Demian. La etapa actual de mantenimiento, refactorización y preparación para portafolio es liderada individualmente por Jorge Oteiza.

### Aportes de la etapa actual

- Sustitución del catálogo artificial por productos y fotografías coherentes.
- Rediseño responsive del inicio, catálogo, producto, perfil, carrito y checkout.
- Corrección de autenticación, favoritos persistentes y aislamiento entre usuarios.
- Implementación de checkout transaccional, control de stock e historial.
- Validaciones de formularios, estados vacíos, carga y error.
- Migraciones, pruebas automáticas, CI y preparación de despliegue.

Consulta la [guía de capturas para el portafolio](docs/PORTFOLIO.md) para presentar el proyecto de manera consistente.
