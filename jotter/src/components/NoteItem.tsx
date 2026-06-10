interface Note {
  id: number
  text: string
  date: string
}

interface Props {
  note: Note
  onDelete: (id: number) => void
}

function NoteItem({ note, onDelete }: Props) {
  return (
    <div>
      <p>{note.text}</p>
      <small>{note.date}</small>
      <br />
      <button onClick={() => onDelete(note.id)}>Sil</button>
    </div>
  )
}

export default NoteItem