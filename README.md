# Colombia Geo App

Aplicación fullstack para gestionar información geográfica de Colombia (departamentos y ciudades) con autenticación de usuarios.

## Tecnologías

- **Backend:** NestJS, TypeScript, Prisma ORM, PostgreSQL
- **Frontend:** Next.js (App Router), Tailwind CSS, shadcn/ui
- **Infraestructura:** Docker, Docker Compose

## Requisitos previos

- Docker y Docker Compose instalados

## Ejecutar el proyecto

```bash
docker-compose up -d --build
```

Una vez levantado:

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Swagger (documentación API):** http://localhost:3000/api/docs

## Variables de entorno

El `docker-compose.yml` ya incluye todas las variables necesarias. Para desarrollo local sin Docker, crear un archivo `.env` en la carpeta `backend/` con:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/colombia_geo
JWT_SECRET=tu_clave_secreta
```

## Migraciones y seed

Las migraciones y el seed se ejecutan automáticamente al levantar el proyecto con Docker. Para ejecutarlas manualmente:

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

El seed carga los 32 departamentos de Colombia con sus ciudades principales.

## Estructura del proyecto

```
├── backend/               # API REST con NestJS
│   ├── src/
│   │   ├── auth/          # Módulo de autenticación (registro/login JWT)
│   │   ├── departamentos/ # CRUD de departamentos
│   │   ├── ciudades/      # CRUD de ciudades
│   │   └── prisma/        # Servicio de Prisma (conexión a BD)
│   └── prisma/
│       ├── schema.prisma  # Modelos de datos
│       ├── seed.ts        # Datos iniciales
│       └── migrations/    # Migraciones SQL
├── frontend/              # Interfaz con Next.js
│   └── src/
│       ├── app/
│       │   ├── login/     # Pantalla de login
│       │   ├── register/  # Pantalla de registro
│       │   └── dashboard/ # CRUD de departamentos y ciudades
│       ├── components/    # Componentes UI (shadcn/ui)
│       └── lib/           # Utilidades y cliente API
└── docker-compose.yml     # Orquestación de servicios
```

## Decisiones técnicas

- **Prisma como ORM:** Tipado fuerte, migraciones automáticas y generación de cliente. Facilita el desarrollo con TypeScript.
- **JWT para autenticación:** Stateless, no requiere sesiones del lado del servidor. El token expira en 24 horas.
- **shadcn/ui:** Componentes accesibles y personalizables con Tailwind, sin dependencia de un framework UI pesado.
- **Relación Departamento-Ciudad con CASCADE:** Al eliminar un departamento, se eliminan automáticamente sus ciudades para evitar registros huérfanos.
- **Módulo global de Prisma:** Un solo servicio de conexión compartido por todos los módulos evita múltiples conexiones a la BD.

## Endpoints de la API

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión |

### Departamentos (requiere autenticación)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/departamentos` | Listar todos |
| GET | `/departamentos/:id` | Obtener uno |
| POST | `/departamentos` | Crear |
| PUT | `/departamentos/:id` | Actualizar |
| DELETE | `/departamentos/:id` | Eliminar |

### Ciudades (requiere autenticación)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/ciudades` | Listar todas |
| GET | `/ciudades/:id` | Obtener una |
| POST | `/ciudades` | Crear |
| PUT | `/ciudades/:id` | Actualizar |
| DELETE | `/ciudades/:id` | Eliminar |
