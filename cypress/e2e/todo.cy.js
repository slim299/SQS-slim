// E2E test for the todo app
// server must be running

describe('Todo App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  afterEach(() => {
    // delete the record
    cy.request('POST', 'http://localhost:3000/delete/1')
  })

  it('create, complete, undo and delete a todo', () => {
    // Creating a new todo
    cy.get('input[name="todo"]').type('Buy groceries')
    cy.get('button[name="add"]').click()
    cy.contains('Buy groceries')

    // Updating a todo
    cy.get('li#todo-1').find('button').contains('Complete').click()
    cy.contains('Buy groceries').should('have.class', 'completed')
    cy.contains('Undo')

    // Undoing a todo
    cy.get('li#todo-1').find('button').contains('Undo').click()
    cy.contains('Buy groceries').should('not.have.class', 'completed')
    cy.contains('Complete')

    // Deleting a todo
    cy.get('li#todo-1').find('button').contains('Delete').click()
    cy.contains('Buy groceries').should('not.exist')
  })
})

describe('Custom Security Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  afterEach(() => {
    // delete the record
    cy.request('POST', 'http://localhost:3000/delete/1')
  })

  it('should sanitize user inputs to prevent XSS', () => {
    cy.get('input[name="todo"]').type('<script>alert("XSS")</script>')
    cy.get('button[name="add"]').click()
    cy.contains('<script>').should('not.exist')
  })
})
