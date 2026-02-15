# Curl para Autenticación

## Registrar a un nuevo usuario

```bash
curl -X POST http://localhost:8000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{
"username": "testuser",
"email": "test@example.com",
"password": "Test123!",
"role": "admin"
}'
```

## Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
"email": "test@example.com",
"password": "Test123!"
}'
```

## Notes

- La contraseña requiere: minimo 8 caracteres, al menos 1 numero, 1 mayúscula, y 1 caracter especial.
- Usuario requiere: minimo 3 caracteres, solo letras, numeros, y guion bajo.
- El email debe tener un formato valido.
