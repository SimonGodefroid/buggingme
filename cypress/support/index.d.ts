/// <reference types="cypress" />
import '@testing-library/cypress/add-commands'

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(): Chainable<any>;
  }
}