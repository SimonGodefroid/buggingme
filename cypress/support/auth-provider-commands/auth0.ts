function loginViaAuth0Ui(username: string, password: string) {

  // App landing page redirects to Auth0.
  cy.visit('/')
  cy.get('button').contains('Start now | Company').click().then(() => {

    // Login on Auth0.
    cy.origin(
      Cypress.env('auth0_domain'),
      { args: { username, password } },
      (
        { username, password }
      ) => {
        cy.get('input#username').type(username)
        cy.get('input#password').type(password, { log: false })
        cy.contains('button[value=default]', 'Continue').click()
      }
    )
  })

  // Ensure Auth0 has redirected us back to the RWA.
  cy.url().should('equal', 'http://localhost:3000/')
}

Cypress.Commands.add('loginToAuth0', (username: string, password: string) => {

  const log = Cypress.log({
    displayName: 'AUTH0 LOGIN',
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false,
  })
  log.snapshot('before')

  cy.session(
    `auth0-${username}`,
    () => {
      loginViaAuth0Ui(username, password)
    },
  )

  log.snapshot('after')
  log.end()
})