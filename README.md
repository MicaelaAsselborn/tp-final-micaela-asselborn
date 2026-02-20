# Patitas Felices - Backend

Trabajo Práctico Final del curso de Desarrollo Web Back-End UTN

## Descripción general

API RESTful para la gestión de una clínica veterinaria. Permite administrar usuarios (admin/vet), clientes, mascotas y consultas clínicas. Incluye autenticación JWT y control de acceso por roles.

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

## Ejemplos de endpoints

### Autenticación

```bash
curl -X POST http://localhost:8000/api/auth/register -H "Content-Type: application/json" -d '{"username": "testuser", "email": "test@example.com", "password": "Test123!", "role": "admin"}'
curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "Test123!"}'
```

### Usuarios (admin)

```bash
curl -X GET http://localhost:8000/api/users -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Clientes (vet)

```bash
curl -X POST http://localhost:8000/api/clients -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{"name": "Juan Perez", "email": "juan@example.com", "phone": "123456789"}'
```

### Mascotas (vet)

```bash
curl -X POST http://localhost:8000/api/pets -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{"name": "Fluffy", "species": "cat", "ownerId": "owner_id_here"}'
```

### Consultas clínicas (vet)

```bash
curl -X POST http://localhost:8000/api/clinic -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{"petId": "PET_ID", "consult": "Descripción de la consulta", "treatment": "Tratamiento prescrito"}'
```

Más ejemplos en la carpeta [`curls/`](curls/).

## Opción de frontend

El proyecto incluye una carpeta `public/` con páginas HTML, CSS y JS para pruebas básicas del backend. No es un frontend completo, solo una opción opcional para testear la API desde el navegador.
