import { useEffect, useState } from 'react'
import { jsx } from 'react/jsx-runtime';
import NoteInput from './components/NoteInput';
import NoteList from './components/NoteList';

interface Note{
  id: number
  text: string
  date: string
}


function App() {
  const[notes,setNotes]=useState <Note[]>(()=>{
    const kayitli=localStorage.getItem('notlar')
      return kayitli? JSON.parse(kayitli):[]
    
  })

  useEffect(()=>{
    localStorage.setItem('notlar',JSON.stringify(notes))
  },[notes])

  function addNote(text:string){
    const yeniNot:Note={
      id: Date.now(),
      text:text,
      date: new Date().toLocaleDateString('tr-TR')

    }
    setNotes([...notes,yeniNot])
  }
  function deleteNote(id:number){
    setNotes(notes.filter(notes=>notes.id!==id))
  }


  return (
    <div>
      <h1>Not Defteri</h1>
      <NoteInput onAdd={addNote}/>
      <NoteList notes={notes} onDelete={deleteNote}/>
    </div>
  )
}

export default App
