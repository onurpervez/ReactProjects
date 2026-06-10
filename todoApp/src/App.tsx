import { useState } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import './App.css'

interface Todo{
  id:number
  text:string
  tamamlandi:boolean
}



function App() {
  
  const [todos,setTodos]=useState<Todo[]>([])

  function addTodo(text:string){
    const yeniTodo:Todo={
      id:Date.now(),
      text:text,
      tamamlandi:false
    }
    setTodos([...todos,yeniTodo])
  }

  function toggleTodo(id:number){
    setTodos(todos.map(todo=>
      todo.id===id?{...todo,tamamlandi:!todo.tamamlandi} :todo
    ))
  }

  function deleteTodo(id:number){
    setTodos(todos.filter(todo=>todo.id!==id))
  }


  return (
    <div>
      <h1>Todo Listesi</h1>
      <TodoInput onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  )
}

export default App
