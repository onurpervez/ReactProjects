import { useState } from 'react'
import type { GithubUser } from './types/github';
import SearchInput from './components/SearchInput';
import ErrorMessage from './components/ErrorMessage';
import ProfileCard from './components/ProfileCard';





function App() {
  const [username,setUsername]= useState('')
  const [user,setUser]= useState<GithubUser |null>(null)
  const [loading,setLoading]= useState(false)
  const [error,setError]= useState('')

  async function fetchUser() {
    if (username.trim()==='') return

    setLoading(true)
    setError('')
    setUser(null)
  
    try{
      const response = await fetch(
        `https://api.github.com/users/${username}`
      )
      if(response.status ===404){
        throw new Error('Kullanici bulunamadi')
      }
      if(response.status ===403){
        throw new Error('API limiti aşıldı, biraz bekle')
      }
      if(response.status ===400){
        throw new Error('Beklenmedik hata: ${response.status}')
      }

      const data: GithubUser= await response.json()
      setUser(data)
    } catch (err){
      if (err instanceof Error){
        setError(err.message)
      } else{
        setError('bilinmeyen bir hata olustu')
      }
    } finally{
      setLoading(false)
    }
  
  
  }

  return (
    <div>
      <h1>Github Profil Arama</h1>
      <SearchInput value={username} onChange={setUsername} onSearch={fetchUser}/>
      {loading && <p>Yükleniyor...</p>}
      {error && <ErrorMessage message={error} />}
      {user && <ProfileCard user={user} />}


    </div>
  )
}

export default App
