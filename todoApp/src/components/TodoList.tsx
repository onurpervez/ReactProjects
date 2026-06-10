import React from 'react'
import TodoItem from './TodoItem';

interface Todo{
    id:number
    text:string
    tamamlandi:boolean
}

interface Props{
    todos:Todo[]
    onToggle:(id:number)=>void
    onDelete: (id:number)=>void
}   


function TodoList({todos,onToggle,onDelete}:Props) {
  return (
    <ul>
        {todos.map(todo=>(
            <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            />
        ))}
    </ul>
  )
}

export default TodoList