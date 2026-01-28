// Verifica el flujo completo de agregar, completar, filtrar y 
// eliminar tareas en el tablero de tareas
describe('Task Board e2e', () => {
  // Test para agregar, completar, filtrar y eliminar tareas
  it('adds, completes, filters and deletes tasks', () => {
    // Mock de tareas iniciales
    const mockTasks = [
		{ id: 1, title: 'Video del ambiente', description: 'Grabar un video del ambiente de trabajo funcional', date: '2026-01-29', category: 'reminders', completed: false },
		{ id: 2, title: 'Investigacion para la expo', description: 'Buscar información relevante para la exposición', date: '2026-01-30', category: 'study', completed: false },
		{ id: 3, title: 'Finalizar el reporte', description: '', date: '2026-01-30', category: 'study', completed: true }
    ]

    // Intercepta las llamadas a la API
    cy.intercept('GET', '/api/tasks', mockTasks).as('getTasks')
    cy.intercept('POST', '/api/tasks', (req) => {
		req.reply({ statusCode: 201, body: { ...req.body, id: 999 } })
    }).as('createTask')
    cy.intercept('DELETE', /\/api\/tasks\/.+/, { statusCode: 204 }).as('deleteTask')

	// Visita la aplicación
    cy.visit('/')

	// Espera a que las tareas se carguen
    cy.wait('@getTasks')

    // 1) Agrega una nueva tarea
	// Abre el modal para agregar tarea
    cy.get('[aria-label="add-task"]').click()
	// Llena el formulario de nueva tarea
    cy.get('[aria-label="title-input"]').type('Write tests')
    cy.get('[aria-label="description-input"]').type('unit + e2e')
    cy.get('[aria-label="date-input"]').type('2026-02-02')
    cy.get('[aria-label="category-select"]').select('work')
	// Guarda la nueva tarea
    cy.contains('button', 'Save').scrollIntoView().click({ force: true })
	// Espera a que la tarea se cree
    cy.wait('@createTask')
	// Verifica que la nueva tarea aparezca en la lista
    cy.contains(/Write tests/i).should('exist')

    // 2) Completa la tarea
	// Encuentra la tarea y marca el checkbox de completado
    cy.contains(/Write tests/i).closest('[aria-label="task-item"]').find('[aria-label="complete-checkbox"]').click()
	// Verifica que la tarea esté marcada como completada
    cy.contains(/Write tests/i).should('not.exist')
	// Cambia a la pestaña Done
    cy.get('[role="tab"]').contains('Done').click()
	// Verifica que la tarea aparezca en Done
    cy.contains(/Write tests/i).should('exist')

    // 3) Filtra por categoría y por búsqueda
	// Filtra por categoría "work"
    cy.get('[aria-label="filter-category"]').contains('work').click()
	// Verifica que la tarea filtrada aparezca
    cy.contains(/Write tests/i).should('exist')
	// Filtra por búsqueda
    cy.get('[aria-label="filter-category"]').contains('all').click()
	// Usa el input de búsqueda y escribe "Write"
    cy.get('[aria-label="search-input"]').clear().type('Write')
	// Verifica que la tarea filtrada por búsqueda aparezca
    cy.contains(/Write tests/i).should('exist')

    // 4) Elimina la tarea
	// Encuentra la tarea y hace clic en el botón de eliminar
    cy.contains(/Write tests/i).closest('[aria-label="task-item"]').find('[aria-label="delete-button"]').click()
	// Espera a que la tarea se elimine
    cy.wait('@deleteTask')
	// Verifica que la tarea ya no esté en el documento
    cy.contains(/Write tests/i).should('not.exist')
  })
})