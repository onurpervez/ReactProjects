import React, { useState } from 'react'

interface Props{
    onAdd:(text:string)=>void
}

function TodoInput({onAdd}:Props){
    const[text,setText] =useState('')
    
    function handleSubmit(){
        if(text.trim()==='') return
        onAdd(text)
        setText('')
    } 


return (
    <div>
        <input 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Yeni Gorev..."
        />
        <button onClick={handleSubmit}>Ekle</button>

    </div>
)
}
export default TodoInput