import { UserType } from "@prisma/client"

describe('Auth', () => {
  it('logs in the user as Company', () => {
    cy.setSession(UserType.COMPANY)
    cy.visit('/')
    cy.findByText('Last 5 Reports on Your Campaigns').should('be.visible')
  })
})