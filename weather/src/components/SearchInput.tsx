import type React from "react";
import type { Dispatch,SetStateAction } from "react";


interface Props{
    value:string
    onChange: Dispatch<SetStateAction<string>>
    onSearch:()=> void
}

function SearchInput({value,onChange,onSearch}:Props) {
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>){
        if(e.key==='Enter'){
            onSearch()
        }
    }

  return (
    <div>
        <input 
            value={value}
            onChange={(e)=> onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Sehir Ara..."
        />
        <button onClick={onSearch}>Ara</button>
    </div>
  )
}

export default SearchInput