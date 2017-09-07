/** lowdb 설정 */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ todos: [], users: [
  {
    uid: 'test',
    pwd: '1234',
    token: ""
  }
] }).write()

/** token 설정 */
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const SECRET = 'todospaToken'
const authMiddleware = expressJwt({secret: SECRET})

module.exports = {
  db,
  jwt,
  SECRET,
  authMiddleware
}
