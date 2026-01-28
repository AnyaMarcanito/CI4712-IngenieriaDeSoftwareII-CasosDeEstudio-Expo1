// Verifica que la página principal de la aplicación 
// React carga correctamente
describe('React App default page', () => {
  // Test para verificar que la página principal carga
  it('loads the task board', () => {
    // Visita la página principal
    cy.visit('/')
    // Verifica que el texto "Task Board" esté presente
    cy.contains(/Task Board/i).should('exist')
  })
})