describe('React App default page', () => {
  it('loads and shows the CRA default content', () => {
    cy.visit('/')
    cy.contains(/learn react/i).should('exist')
  })
})