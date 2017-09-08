(function (window, document) {

  /**
   * 서버에서 할일 템플릿과 할일 데이터를 가져온 후, #todos 요소 안에 렌더링하는 함수
   */
  function loadTodos() {
    render({
      target: '#todos',
      templatePath: '/templates/todos.ejs',
      dataPath: '/api/todos'
    }).then(todosEl => {
      todosEl.querySelectorAll('.todo-item').forEach(todoItem => {
        const id = todoItem.dataset.id

        // 체크박스 클릭시
        // 낙관적 업데이트
        const checkboxEl = todoItem.querySelector('.todo-checkbox')
        checkboxEl.addEventListener('click', e => {
          axios.patch(`/api/todos/${id}`, {
            complete: e.currentTarget.checked
          }, {
            "headers": {"Authorization": "Bearer " + localStorage.getItem('token')}
          }).then(res => {
            loadTodos()
          })
          .catch(err=> {
            e.srcElement.checked = !e.srcElement.checked
            alert("로그인 후 이용하세요")

          })
        })

        // 삭제 아이콘 클릭시
        // 비관적 업데이트(Pessimistic) : event 발생=> ajax 요청 => (성공할지 실패할지 모르겠으니) ajax 응답을 기다림 => 화면 갱신
        // 낙관적 업데이트(Optimistic) : event 발생=> ajax 요청, 화면 갱신 => ajax 성공,실패 처리 : 실패 처리가 까다롭다
        // 아래 코드는 비관적 업데이트, 최근엔 낙관적 업데이트 주로 사용
        const removeLink = todoItem.querySelector('.todo-remove')
        removeLink.addEventListener('click', e => {
          axios.delete(`/api/todos/${id}`,{
            "headers": {"Authorization": "Bearer " + localStorage.getItem('token')}
          }).then(res => {
            loadTodos()
          })
          .catch(e=> {
            alert("로그인 후 이용하세요")
          })
        })
      })
    })
  }

  document.querySelector('#todo-form').addEventListener('submit', e => {
    e.preventDefault()
    const form = e.currentTarget
    axios.post('/api/todos', {
      title: form.elements.title.value
    }, {
      "headers": {"Authorization": "Bearer " + localStorage.getItem('token')}
    })
      .then(loadTodos)
      .then(() => {
        form.elements.title.value = null
      })
      .catch(e=> {
        alert("로그인 후 이용하세요")
        form.elements.title.value = null
      })
  })

  document.querySelector('#login-form').addEventListener('submit', e => {
    e.preventDefault()
    const form = e.currentTarget
    axios.post('/api/auth', {
      uid: form.elements.uid.value,
      pwd: form.elements.pwd.value
    })
      .then( res=> {
       if(res.data.ok==false){
         alert("잘못된 계정 정보입니다")
      } else {
        localStorage.setItem('token', res.data.token)
      }
         loadTodos()
      })
      .then( ()=> {
        form.elements.uid.value = null
        form.elements.pwd.value = null
      })

  })

  loadTodos()

})(window, document)
