const express = require('express')
const bodyParser = require('body-parser')
const { generateId } = require('./utils')
const sqlite3 = require('sqlite3').verbose()
const xss = require('xss')
const app = express()
const port = 3000

// Set up EJS as the view engine
app.set('view engine', 'ejs')

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))

// Database
const db = new sqlite3.Database(':memory:')

db.serialize(() => {
  db.run(
    'CREATE TABLE todos (id INTEGER PRIMARY KEY, text TEXT, completed BOOLEAN)'
  )

  db.run(
    'INSERT INTO todos (text, completed) VALUES (?, ?)',
    'Buy groceries',
    false
  )
  db.run(
    'INSERT INTO todos (text, completed) VALUES (?, ?)',
    'Walk the dog',
    false
  )
  db.run(
    'INSERT INTO todos (text, completed) VALUES (?, ?)',
    'Wash the car',
    true
  )
})

// Routes
app.get('/', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      return res
        .status(500)
        .send('An error occurred while fetching todos from the database')
    }

    res.render('index', { todos: rows })
  })
})

app.post('/create', (req, res) => {
  const { todo } = req.body
  const id = generateId()
  db.run(
    'INSERT INTO todos (id, text, completed) VALUES (?, ?, ?)',
    id,
    xss(todo),
    false
  )
  res.redirect('/')
})

app.post('/update/:id', (req, res) => {
  const { id } = req.params
  const { completed } = req.body

  db.run(
    'UPDATE todos SET completed = ? WHERE id = ?',
    completed === 'true',
    id
  )

  res.redirect('/')
})

app.post('/delete/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM todos WHERE id = ?', id)
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

module.exports = app
