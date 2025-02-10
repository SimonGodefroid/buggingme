
describe('Auth', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('logs in the user as Company', () => {
    cy.intercept('/api/auth/session', { fixture: 'auth-session.json' }).as('login')
    cy.wait('@login')
    cy.setCookie('authjs.session-token', 'trilili')
    cy.visit('/')
  })
})