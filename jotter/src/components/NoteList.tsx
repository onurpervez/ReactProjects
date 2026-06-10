import NoteItem from "./NoteItem";


interface Note{
  id:number
  text:string
  date:string
}

interface Props{
  notes:Note[]
  onDelete:(id:number)=> void
}

function NoteList({notes,onDelete}:Props) {
  return (
    <div>
      {notes.length===0 && <p>Henuz Not Yok.</p>}
      {notes.map(note=>(
        <NoteItem key={note.id} note={note} onDelete={onDelete} />
      ))}

    </div>
  )
}

export default NoteList