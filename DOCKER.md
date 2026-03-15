# Docker - Nous Ai

## Build y ejecución con Docker Compose

```bash
# Con variables por defecto (API en http://localhost:3000/api)
docker compose up --build

# Con .env (copiar .env.example a .env y configurar)
cp .env.example .env
# Editar .env con VITE_API_URL y credenciales Microsoft
docker compose up --build
```

La app quedará en **http://localhost** (puerto 80).

## Solo imagen Docker

```bash
# Build con API URL para producción
docker build \
  --build-arg VITE_API_URL=https://tu-api.ejemplo.com/api \
  --build-arg VITE_MICROSOFT_CLIENT_ID=xxx \
  --build-arg VITE_MICROSOFT_TENANT_ID=xxx \
  --build-arg VITE_MICROSOFT_REDIRECT_URI=https://tu-dominio/auth/callback \
  -t edu-assistant .

docker run -p 80:80 edu-assistant
```

## Variables de build (Vite)

Se inyectan en **build time**. Para producción, pasa las correctas en `docker build --build-arg` o en el `.env` al usar `docker compose`.

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del API (ej. `https://api.ejemplo.com/api`) |
| `VITE_MICROSOFT_CLIENT_ID` | Client ID de Azure AD |
| `VITE_MICROSOFT_TENANT_ID` | Tenant ID de Azure AD |
| `VITE_MICROSOFT_REDIRECT_URI` | URI de callback (debe coincidir con la URL donde sirves la app) |
