# Curls para CRUD de clientes

## Prerequisitos

- Debes estar autenticado como usuario con el rol "vet".
- Primero, logeate para obtener un token JWT (ver curls-auth.md).
- Reemplaza `YOUR_JWT_TOKEN` con el token de la respuesta de tu login.
- Base URL: http://localhost:8000/api/clients

## Crear cliente (POST)

```bash
curl -X POST http://localhost:8000/api/clients \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -d '{
  "name": "Juan Perez",
  "email": "juan@example.com",
  "phone": "123456789"
}'
```

## Obtener todos los clientes (GET)

```bash
curl -X GET http://localhost:8000/api/clients \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Obtener cliente por ID (GET)

```bash
curl -X GET http://localhost:8000/api/clients/{id} \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Reemplaza `{id}` con el ID del cliente.

## Actualizar cliente (PATCH)

```bash
curl -X PATCH http://localhost:8000/api/clients/{id} \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -d '{
  "name": "Juan Perez Modificado",
  "email": "juanmod@example.com",
  "phone": "987654321"
}'
```

## Eliminar cliente (DELETE)

```bash
curl -X DELETE http://localhost:8000/api/clients/{id} \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

> Consultá curls-auth.md para obtener el token JWT y más detalles sobre autenticación.
