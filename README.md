# CI4712-IngenieriaDeSoftwareII-Proyecto

Preparación del ambiente y CI con GitHub Actions para React, Go, Jest, Cypress y Postman.

## Requisitos
- Node.js y npm
- Go (>= 1.21)
- Git

## Estructura
- `frontend`: React (CRA) con Jest + Cypress
- `backend`: API Go con endpoint `GET /api/health`
- `postman`: Colección y entorno para pruebas con Newman
- `.github/workflows`: Pipelines de CI

## Desarrollo local
### Frontend
```bash
npm --prefix frontend install
npm --prefix frontend start
```
Pruebas unitarias (Jest):
```bash
CI=true npm --prefix frontend test -- --watchAll=false
```
E2E (Cypress, headless):
```bash
npm --prefix frontend run e2e
```
Abrir Cypress GUI:
```bash
npm --prefix frontend run cypress:open
```

### Backend
```bash
cd backend
go test ./...
go run main.go
```
Endpoint: `http://localhost:8080/api/health`

### Postman / Newman
Con backend corriendo:
```bash
npm install -g newman
newman run postman/collection.json -e postman/env.json
```

## Antes de hacer commit
```bash
# 1) Pruebas unitarias frontend (Jest)
CI=true npm --prefix frontend test -- --watchAll=false

# 2) E2E frontend (Cypress headless)
npm --prefix frontend run e2e

# 3) Pruebas backend
cd backend && go test ./... && cd ..

# 4) (Opcional) Newman contra backend corriendo
go run backend/main.go &
newman run postman/collection.json -e postman/env.json
kill %1
```

## CI (GitHub Actions)
Se ejecuta en `push` y `pull_request` a `main` y `develop`:
- Frontend: `frontend-ci.yml` (Jest + build)
- Backend: `backend-ci.yml` (go test + build + Newman)
- E2E: `e2e.yml` (Cypress contra dev server)

## Flujo de ramas
- `main`: estable
- `develop`: integración
- `feature/*`: desarrollo de funcionalidades (PR hacia `develop`)