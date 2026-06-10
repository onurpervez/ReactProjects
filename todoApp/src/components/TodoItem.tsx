interface Todo{
    id:number
    text:string
    tamamlandi:boolean
}

interface Props{
    todo:Todo
    onToggle:(id:number)=>void
    onDelete:(id:number)=>void
}

function TodoItem({todo,onToggle,onDelete}:Props) {
  return (
    <li>
        <span
        onClick={()=>onToggle(todo.id)}
        style={{textDecoration:todo.tamamlandi ? 'line-through' : 'none', cursor: 'pointer' }}
        >
            {todo.text}
        </span>
        <button onClick={()=>onDelete(todo.id)}>Sil</button>
    </li>
  )
}

export default TodoItem