import { useState } from "react";
import { PiPlaceholder } from "react-icons/pi";

interface Props{
  onAdd:(text:string)=> void
 
}

function NoteInput({onAdd}:Props) {
  const [text,setText]= useState('')

    function handleSubmit(){
      if (text.trim()==='') return
      onAdd(text)
      setText('')
    }
  
  return (
    <div>
      <textarea 
      value={text}
      onChange={(e)=> setText(e.target.value)}
      placeholder="notunuz yaz..."
      rows={4}
      />
      <br />
      <button onClick={handleSubmit}>Kaydet</button>
    </div>
  )
}

export default NoteInput