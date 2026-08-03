# El Rincón del Vino

E-commerce full stack de vinos desarrollado con React, Flask y PostgreSQL. Incluye catálogo, búsqueda y filtros, autenticación, carrito, favoritos persistentes, perfil e historial de compras.

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
- Checkout demostrativo que no procesa pagos reales.
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

```text
React + Context API + localStorage
                |
                | JSON / HTTP
                v
        API REST con Flask + JWT
                |
                v
      SQLAlchemy + PostgreSQL
```

El frontend centraliza las peticiones en `src/front/js/services/api.js`. El backend publica sus rutas bajo `/api`, identifica al usuario mediante JWT y persiste la información con SQLAlchemy.

## Alcance del pago

El checkout es una demostración de interfaz y flujo de compra. No se conecta a Webpay, PayPal ni a otros procesadores, y no debe utilizarse para ingresar datos bancarios reales.

## Autoría y evolución

La versión inicial fue desarrollada colaborativamente durante el bootcamp por Natalia, Matías, Jorge y Demian. La etapa actual de mantenimiento, refactorización y preparación para portafolio es liderada individualmente por Jorge Oteiza.
