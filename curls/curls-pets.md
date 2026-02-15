# Curls para CRUD de mascotas

## Prerequisitos

- Tenes que estar autenticado como usuario con el rol "vet".
- Primero, logeate para obtener un token JWT (Ver curls-auth.md).
- Reemplaza `YOUR_JWT_TOKEN` con el token de la respuesta de tu login.
- Base URL: http://localhost:8000/api/pets
- Nota: Los endpoints ahora filtran por el veterinario autenticado. Solo verás/modificarás tus propias mascotas asignadas.

## Crear mascota (POST)

```bash
curl -X POST http://localhost:8000/api/pets \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -d '{
  "name": "Fluffy",
  "species": "cat",
  "ownerId": "owner_id_here"
}'
```

## Obtener todas las mascotas (GET)

```bash
curl -X GET http://localhost:8000/api/pets \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Obtener mascota por ID (GET)

```bash
curl -X GET http://localhost:8000/api/pets/{id} \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Remplaza `{id}` con el ID de la mascota.

## Actualizar mascota (PATCH)

```bash
curl -X PATCH http://localhost:8000/api/pets/{id} \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -d '{
  "name": "Updated Name"
}'
```

Remplaza `{id}` con el ID de la mascota. Solo incluí los campos que vayas a actualizar.

## Borrar mascota (DELETE)

```bash
curl -X DELETE http://localhost:8000/api/pets/{id} \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Remplaza `{id}` con el ID de la mascota.

## Notas

- Especies: dog, cat, hamster, mice, bunny, bird, lizard, turtle, other
- ownerId y vetId deben ser IDs de usuarios validos.
- Asegurate de que el token JWT sea valido y que sea de un usuario con el rol "vet.
