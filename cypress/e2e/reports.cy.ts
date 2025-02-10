import { UserType } from '@prisma/client';
describe('Reports', () => {

  beforeEach(() => {
    cy.task('seedDatabase')
    // cy.loginToAuth0(
    //   Cypress.env('auth0_username'),
    //   Cypress.env('auth0_password')
    // )
    cy.visit('/')

  })
  // it('renders the reports landing page when user is logged out', () => {
  //   cy.visit('/reports')
  //   cy.get('h1').contains('Report')
  //   cy.screenshot()
  // })
  describe(`${UserType.ENGINEER}`, () => {
    beforeEach(() => {
      cy.setSession(UserType.ENGINEER)
    });

    it('should assign userType ENGINEER to GitHub users', () => {
      cy.visit('/');

      // Verify that the userType is ENGINEER

    });

    // Additional tests...
  });
})