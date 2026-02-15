# Curls para CRUD de usuarios

## Prerequisitos

- Tenes que estar autenticado como usuario con el rol "admin".
- Primero, logeate para obtener un token JWT (Ver curls-auth.md).
- Reemplaza `YOUR_JWT_TOKEN` con el token de la respuesta de tu login.
- Base URL: http://localhost:8000/api/users

## Encontrar a todos los usuarios

```bash
curl -X GET http://localhost:8000/api/users \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Encontrar usuario por ID

```bash
curl -X GET http://localhost:8000/api/users/USER_ID \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Crear nuevo usuario (default role: client)

```bash
curl -X POST http://localhost:8000/api/users \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -d '{
"username": "newuser",
"email": "newuser@example.com",
"password": "Password123!"
}'
```

## Crear nuevo usuario con role admin

```bash
curl -X POST http://localhost:8000/api/users \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -d '{
"username": "adminuser",
"email": "admin@example.com",
"password": "AdminPass123!",
"role": "admin"
}'
```

## Actualizar usuario

```bash
curl -X PUT http://localhost:8000/api/users/USER_ID \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -d '{
"role": "admin",
"email": "updated@example.com"
}'
```

## Borrar usuario

```bash
curl -X DELETE http://localhost:8000/api/users/USER_ID \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Notas

- Todas las operaciones de usuarios requieren autenticación y autorización.
- Roles validos: "client", "vet", "admin".
- La contraseña requiere: minimo 8 caracteres, al menos 1 numero, 1 mayúscula, y 1 caracter especial.
- Usuario requiere: minimo 3 caracteres, solo letras, numeros, y guion bajo.
- El email debe tener un formato valido.
