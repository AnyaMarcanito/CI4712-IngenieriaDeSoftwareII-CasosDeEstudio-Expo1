# React + Go 

Este proyecto es una infraestructura completa para desarrollo moderno, integrando un backend robusto en Go, un frontend ágil en React y una base de datos automatizada.

## Tecnologías y Características
- **Frontend:** React + TypeScript (Vite).
- **Backend:** Google Go (Standard Library).
- **Base de Datos:** PostgreSQL 15 (vía Docker).
- **Infraestructura:** Docker Compose para servicios persistentes.
- **Calidad:** Jest (Unit), Cypress (E2E) y GitHub Actions (CI).
- **Seguridad:** Configuración por variables de entorno (.env) y CORS habilitado.

##  Requisitos Previos
- **Docker & Docker Desktop** (Indispensable para la BD).
- **Go 1.20+**
- **Node.js 18+**
- **Make** (Opcional, para atajos).

---

## Inicio Rápido (First Run)

1. **Configurar Entorno:**
   Crea un archivo `.env` en la raíz del proyecto basándote en los valores del backend
   ```env
   DB_HOST=localhost
   DB_PORT=5435
   DB_USER=user_admin
   DB_PASSWORD=secret_password
   DB_NAME=mi_base_de_datos
      
2. **Inicializar Proyecto:** 
    Si tienes make, ejecuta:
    ```
    make init
    ```
    Si no
    ```
    docker-compose up -d
    cd backend && go mod tidy
    cd ../frontend && npm install
    ```

3. **Atajos con Make**
    ```
    make init	Levanta DB y descarga dependencias de ambos mundos.
    make dev	Inicia Backend y Frontend simultáneamente.
    make backend	Solo inicia el servidor Go en :8080.
    make frontend-dev	Solo inicia Vite en :5173.
    ```