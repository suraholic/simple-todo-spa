const ext = require('./api')

function authTodo(uid, pwd){
  const chk = ext.db.get('users').find(user => user.uid===uid && user.pwd===pwd).value()

  if(chk){
    const token = ext.jwt.sign({uid}, ext.SECRET)
    //ext.db.get('users').find({ uid: uid }).assign({ token: token}).write()
    return {ok: true, token}
  } else {
    return {ok: false, error:'Failed Login'}
  }
}

function loadTodo(){
  return ext.db.get('todos')
}

function addTodo({title}) {
  const data = ext.db.get('todos').value()
  let newIdx = 1

  if(data.length>0) {
   newIdx = Math.max(...data.map(item=>item.id))+1
  }

  const newTodo = {
    id: newIdx,
    title,
    complete: false
  }

  ext.db.get('todos').push(newTodo).write()
  return newTodo
}

function updateTodo(id, source) {
  const todo = ext.db.get('todos').find({id:id}).value()

  if (todo) {
    ext.db.get('todos').find({id:id}).assign(source).write()
    return todo
  } else {
    throw new Error('해당 id를 갖는 요소가 없습니다.')
  }

}

function deleteTodo(id) {
 const todo = ext.db.get('todos').find({id:id}).value()
 ext.db.get('todos').remove({id:id}).write()
}

module.exports = {
  loadTodo,
  addTodo,
  updateTodo,
  deleteTodo,
  authTodo
}
