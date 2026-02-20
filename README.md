# Patitas Felices - Backend

Trabajo Práctico Final del curso de Desarrollo Web Back-End UTN

## Descripción general

API RESTful para la gestión de una clínica veterinaria. Permite administrar usuarios (admin/vet), clientes, mascotas y consultas clínicas. Incluye autenticación JWT y control de acceso por roles.

## Estructura de carpetas

```
├── src/
│   ├── config/         # Configuración de base de datos y variables
│   ├── controllers/    # Lógica de negocio y controladores de rutas
│   ├── middlewares/    # Middlewares de autenticación, errores, etc.
│   ├── models/         # Modelos de datos (Mongoose)
│   ├── routes/         # Definición de rutas y endpoints
│   ├── services/       # Lógica de servicios y acceso a datos
│   ├── types/          # Tipos y definiciones TypeScript
│   ├── validators/     # Validaciones de datos de entrada
│   └── index.ts        # Punto de entrada principal
├── public/             # Frontend mínimo (HTML, CSS, JS)
├── curls/              # Ejemplos de pruebas con curl
├── .env                # Variables de entorno (no subir)
├── package.json        # Dependencias y scripts
└── README.md           # Documentación
```

## Tecnologías utilizadas

- Node.js
- TypeScript
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- express-validator

## Instrucciones de instalación y ejecución

1. Clona el repositorio y entra a la carpeta del proyecto.
2. Instala las dependencias:
    ```bash
    npm install
    ```
3. Crea un archivo `.env` en la raíz con las variables necesarias (ver abajo).
4. Para desarrollo, ejecuta:
    ```bash
    npm run dev
    ```
    Para producción:
    ```bash
    npm run build && npm start
    ```

El servidor corre por defecto en [http://localhost:8000](http://localhost:8000)

## Variables de entorno

Ejemplo de archivo `.env`:

```env
PORT=8000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto
JWT_EXPIRES_IN=1d
```

## Ejemplos de endpoints y autorización diferenciada

### Autenticación

```bash
curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d '{"username": "testuser", "email": "test@example.com", "password": "Test123!", "role": "admin"}'
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "Test123!"}'
```

### Usuarios (solo admin)

Solo los usuarios con rol `admin` pueden acceder a estos endpoints:

```bash
# Listar todos los usuarios (requiere token de admin)
curl -X GET http://localhost:8000/api/users -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Crear usuario (requiere token de admin)
curl -X POST http://localhost:8000/api/users -H "Content-Type: application/json" -H "Authorization: Bearer ADMIN_JWT_TOKEN" -d '{"username": "nuevo", "email": "nuevo@example.com", "password": "Password123!"}'
```

### Clientes, Mascotas y Consultas (solo vet)

Solo los usuarios con rol `vet` pueden acceder a estos endpoints:

```bash
# Crear cliente (requiere token de vet)
curl -X POST http://localhost:8000/api/clients -H "Content-Type: application/json" -H "Authorization: Bearer VET_JWT_TOKEN" -d '{"name": "Juan Perez", "email": "juan@example.com", "phone": "123456789"}'

# Crear mascota (requiere token de vet)
curl -X POST http://localhost:8000/api/pets -H "Content-Type: application/json" -H "Authorization: Bearer VET_JWT_TOKEN" -d '{"name": "Fluffy", "species": "cat", "ownerId": "owner_id_here"}'

# Crear consulta clínica (requiere token de vet)
curl -X POST http://localhost:8000/api/clinic -H "Content-Type: application/json" -H "Authorization: Bearer VET_JWT_TOKEN" -d '{"petId": "PET_ID", "consult": "Descripción de la consulta", "treatment": "Tratamiento prescrito"}'
```

Más ejemplos en la carpeta [`curls/`](curls/).

## Opción de frontend

El proyecto incluye una carpeta `public/` con páginas HTML, CSS y JS para pruebas básicas del backend. No es un frontend completo, solo una opción opcional para testear la API desde el navegador.

## Justificación: ¿Por qué modelar usuarios y no solo veterinarios?

Se decidió modelar la entidad principal como "usuarios" en vez de limitarla únicamente a "veterinarios" para permitir mayor flexibilidad y escalabilidad en el sistema. De esta manera, es posible gestionar distintos tipos de roles (por ejemplo: admin, veterinario, recepcionista) bajo una misma estructura, facilitando la autenticación, autorización y el control de acceso. Así, el sistema puede crecer y adaptarse a nuevas necesidades sin requerir grandes cambios en la arquitectura, permitiendo que en el futuro se agreguen otros perfiles de usuario fácilmente.
