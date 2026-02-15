# Curls para CRUD de consultas clínicas

## Prerequisitos

- Tenes que estar autenticado como usuario con el rol "vet".
- Primero, logeate para obtener un token JWT (Ver curls-auth.md).
- Reemplaza `YOUR_JWT_TOKEN` con el token de la respuesta de tu login.
- Base URL: http://localhost:8000/api/clinic
- Nota: Los endpoints ahora filtran por el veterinario autenticado. Solo verás/modificarás tus propias consultas.

## Encontrar todas las consultas

```bash
curl -X GET http://localhost:8000/api/clinic \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Encontrar consulta por ID

```bash
curl -X GET http://localhost:8000/api/clinic/CONSULT_ID \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Crear nueva consulta

```bash
curl -X POST http://localhost:8000/api/clinic \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -d '{
"petId": "PET_ID",
"consult": "Descripción de la consulta",
"treatment": "Tratamiento prescrito"
}'
```

## Actualizar consulta

```bash
curl -X PATCH http://localhost:8000/api/clinic/CONSULT_ID \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_JWT_TOKEN" \
 -d '{
"consult": "Descripción actualizada de la consulta",
"treatment": "Tratamiento actualizado"
}'
```

## Borrar consulta

```bash
curl -X DELETE http://localhost:8000/api/clinic/CONSULT_ID \
 -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Notas

- Todas las operaciones requieren autenticación como veterinario.
- Las consultas clínicas pueden ser modificadas usando PATCH.
- petId y vetId deben ser IDs válidos de mascotas y veterinarios existentes.
- consult y treatment son campos de texto obligatorios.
