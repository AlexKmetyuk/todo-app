import axios from 'axios';

const baseURL = 'https://63bea75f585bedcb36b3069c.mockapi.io/todos';
const form = document.querySelector('.todo-form');
const todoList = document.querySelector('.todo-list');

form.addEventListener('submit', e => {
  e.preventDefault();
  const value = form.elements[0].value;
  if (value.length > 0 && checkSpaces(value)) {
    createTodo(value);
  } else {
    alert('Fill the field, please');
  }
});

todoList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const button = e.target;
    deleteTodo(button.parentNode);
  } else if (e.target.classList.contains('todo')) {
    const todo = e.target;
    completeTodo(todo);
  }
});

function createTodo(value) {
  axios.post(baseURL, { title: value }).then(({ data }) => {
    createTodoMarkup(data);
  });
}

function deleteTodo(todo) {
  axios.delete(baseURL + `/${todo.dataset.id}`).then(res => {
    console.log(res);
    todo.remove();
  });
}

function completeTodo(todo) {
  axios
    .put(baseURL + `/${todo.dataset.id}`, {
      completed: !(todo.dataset.completed === 'true'),
    })
    .then(res => {
      todo.dataset.completed = !(todo.dataset.completed === 'true');
    });
}

function createTodoMarkup(data) {
  const todo = document.createElement('li');
  todo.dataset.id = data.id;
  todo.dataset.completed = data.completed;
  todo.classList.add('todo');
  const title = document.createElement('p');
  title.textContent = data.title;
  const btn = document.createElement('button');
  btn.classList.add('delete-btn');
  btn.textContent = 'DELETE';

  todo.append(title);
  todo.append(btn);
  todoList.append(todo);
}

function loadTodo() {
  axios.get(baseURL).then(({ data }) => {
    data.forEach(item => {
      createTodoMarkup(item);
    });
  });
}

function checkSpaces(string) {
  return string.trim() !== '';
}

loadTodo();
