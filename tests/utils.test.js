// unit tests for utils.js

const { generateId } = require('../utils')

test('generateId should return a number', () => {
  const id = generateId()
  expect(typeof id).toBe('number')
})
