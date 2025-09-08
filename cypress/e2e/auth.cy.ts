import { UserType } from '@prisma/client';

describe('Auth', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
    // cy.loginToAuth0(
    //   Cypress.env('auth0_username'),
    //   Cypress.env('auth0_password')
    // )
    // cy.visit('/');
  });
  it('logs in the user as Company', () => {
    cy.setSession(UserType.COMPANY);
    cy.findByText('Last 5 Reports on Your Campaigns').should('be.visible');
  });
});
