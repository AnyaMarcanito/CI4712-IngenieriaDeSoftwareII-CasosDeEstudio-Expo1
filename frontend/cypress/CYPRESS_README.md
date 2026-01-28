# Cypress: configuración y pruebas

## Archivos involucrados

- `cypress.config.js`
  - Configuración principal de Cypress (baseUrl, paths, etc.).

- `cypress/e2e/app.cy.js`
  - Prueba de carga de la vista principal (Task Board).

- `cypress/e2e/tasks.cy.js`
  - Pruebas E2E del flujo de tareas (agregar, completar, filtrar, eliminar).
  - Incluye mocks de `/api/tasks` para no depender del backend.

## Configuración

- Cypress se ejecuta desde el frontend.
- El archivo `cypress.config.js` define la configuración base de E2E.
- Las pruebas están en `cypress/e2e/*.cy.js`.

## Comandos para ejecutar

```bash
# Interactivo
npm --prefix frontend run cypress:open

# Headless
npm --prefix frontend run cypress:run
```

## Resumen de pruebas (E2E)

1. Carga de la app y validación del título “Task Board”.
2. Flujo completo de tareas:
   - Crear tarea desde el modal.
   - Completar tarea y moverla a Done.
   - Filtrar por categoría (botones).
   - Buscar por texto.
   - Eliminar tarea.
