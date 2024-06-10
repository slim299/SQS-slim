// integration spec

const request = require('supertest')
const app = require('../index') // Your Express app

describe('Todo App', () => {
  it('should create a new todo', async () => {
    const response = await request(app)
      .post('/create')
      .send({ todo: 'Buy groceries' })
      .expect(302)

    expect(response.headers.location).toBe('/')
  })

  it('should update a todo', async () => {
    const response = await request(app)
      .post('/update/1')
      .send({ completed: true })
      .expect(302)

    expect(response.headers.location).toBe('/')
  })

  it('should delete a todo', async () => {
    const taskResponse = await request(app)
      .post('/create')
      .send({ todo: 'Buy groceries' })
      .expect(302)

    const response = await request(app).post('/delete/1').expect(302)

    expect(response.headers.location).toBe('/')
  })
})
