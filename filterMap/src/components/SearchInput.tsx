
import type { Dispatch, SetStateAction } from 'react'

interface Props {
  value: string
  onChange: Dispatch<SetStateAction<string>>
}

function SearchInput({value,onChange}:Props) {
  return (
    <input 
        value={value}
        onChange={(e)=> onChange(e.target.value)}
        placeholder="isme gore ara"
    />
  )
}

export default SearchInput