# Jest: configuración y pruebas

## Archivos involucrados

- `src/App.test.js`
  - Prueba básica de render del componente raíz (`App`).
  - Verifica que el título “Task Board” esté presente.

- `src/__tests__/TaskBoard.test.jsx`
  - Conjunto principal de pruebas del tablero de tareas.
  - Se mockean los endpoints de tareas (`/api/tasks`) usando `global.fetch`.
  - Cubre render inicial, tabs, agregar, filtrar, completar y eliminar tareas.

- `src/setupTests.js`
  - Archivo de configuración de Jest para el entorno de pruebas.
  - Carga matchers de `@testing-library/jest-dom` para asserts de DOM.

## Configuración

- Jest está integrado vía `react-scripts` (Create React App).
- No se usa configuración separada; `react-scripts test` detecta automáticamente:
  - Archivos `*.test.js` / `*.test.jsx`
  - Carpeta `__tests__`

## Comando para ejecutar

```bash
npm --prefix frontend test -- --watchAll=false
npm --prefix frontend test -- --coverage
```

## Resumen de pruebas (TaskBoard)

1. Render inicial y cambio de tabs (ToDo/Done).
2. Agregar tarea y mostrarla en la lista.
3. Filtrar por categoría y por búsqueda.
4. Marcar tarea como completada y moverla a Done.
5. Eliminar tarea de la lista.
