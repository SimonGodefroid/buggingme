/// <reference types="cypress" />
// import type Chainable from 'cypress'
import "./auth-provider-commands/auth0";
import { UserType } from '@prisma/client';
import cypress = require('cypress');
import { sessions, users } from '../data';
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

declare global {
  namespace Cypress {
    interface Chainable {
      loginToAuth0(username: string, password: string): Chainable<void>
      setSession(userType: UserType): Chainable<void>
    }
  }
}


Cypress.on('uncaught:exception', (err) => {
  console.log('uncaught:exception', err)
  // we check if the error is
  // prompt user to confirm refresh
  if (/Loading chunk [\d]+ failed/.test(err.message)) {
    cy.window().reload()
  }
});

Cypress.Commands.add('setSession', (userType: UserType) => {
  const getUserSessionByType = (userType: UserType) => {
    const user = users.find(user => user.userTypes.includes(userType));
    cy.log(`User type ${userType} found:`, user);
    if (!user) {
      throw new Error(`User type ${userType} not found`);
    }
    return user;
  }
  const loggedInUser = getUserSessionByType(userType);
  cy.log('loggedInUser'.repeat(200) + JSON.stringify(loggedInUser));
  const sessionToLog = sessions.find(session => session.userId === loggedInUser.id);
  cy.log('sessionToLog'.repeat(200) + JSON.stringify(sessionToLog));
  cy.setCookie('authjs.session-token', sessions.find(session => session.userId === loggedInUser.id).sessionToken)
  // cy.setCookie(
  //   'next-auth.session-token',
  //   'a valid cookie from your browser session',
  // )
  // cy.preserveCookieOnce('next-auth.session-token') // works without this, for now
  cy.visit('/')
  // cy.wait('@session')
})