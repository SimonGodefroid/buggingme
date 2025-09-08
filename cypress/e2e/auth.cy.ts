import { UserType } from '@prisma/client';

describe('Auth', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  });
  describe(`${UserType.COMPANY}`, () => {
    beforeEach(() => {
      cy.setSession(UserType.COMPANY);
    });

    it('logs in the user as Company', () => {
      cy.visit('/');
      // Verify that the userType is COMPANY
    });
    // Additional tests...
  });
});
