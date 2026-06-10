import { useState } from 'react'
import { users, type User } from './data/user';
import SearchInput from './components/SearchInput';
import UserCard from './components/UserCard';



function App() {
  const [search,setSearch] =useState('')

  const filteredUsers: User[]=users.filter(user=>
    user.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1>Kullanicilar</h1>
      <SearchInput value={search} onChange={setSearch} />
      <div>
        {filteredUsers.map(user=>(
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>

  )
}

export default App
