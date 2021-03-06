const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const data = require('./data')
const ext = require('./api')


const app = express()
const jsonMiddleware = bodyParser.json()

app.use(morgan('tiny'))
app.use(express.static('public'))


app.post('/api/auth', jsonMiddleware, (req, res) => {
 const {uid, pwd} = req.body
 const result = data.authTodo(uid, pwd)
 res.send(result)

})


app.get('/api/todos', (req, res) => {
  const todo = data.loadTodo()
  console.log(req.headers)
  res.send(todo)
})

app.post('/api/todos', jsonMiddleware, ext.authMiddleware, (req, res) => {
  const {title} = req.body
  if (title) {
    const todo = data.addTodo({title})
    res.send(todo)
  } else {
    res.status(400)
    res.end()
  }
})

app.patch('/api/todos/:id', jsonMiddleware, ext.authMiddleware, (req, res) => {
  let id;
  try {
    id = parseInt(req.params.id)
  } catch (e) {
    res.status(400)
    res.end()
    return // 바로 라우트 핸들러를 종료합니다.
  }
  const todo = data.updateTodo(id, req.body)
  res.send(todo)
})

app.delete('/api/todos/:id', jsonMiddleware, ext.authMiddleware, (req, res) => {
  let id;
  try {
    id = parseInt(req.params.id)
  } catch (e) {
    res.status(400)
    res.end()
    return // 바로 라우트 핸들러를 종료합니다.
  }
  data.deleteTodo(id)
  res.end()
})

app.listen(3000, () => {
  console.log('listening...')
})
