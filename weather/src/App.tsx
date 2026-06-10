import { useState } from 'react'
import type { Weather } from './types/weather';
import SearchInput from './components/SearchInput';
import ErrorMessage from './components/ErrorMessage';
import WeatherCard from './components/WeatherCard';


const API_KEY ='a79c53a39c65661f3899e9b397a89283'

function App() {
  const [city, setCity]= useState('')
  const [weather, setWeather]= useState<Weather|null>(null)
  const [loading, setLoading]=useState(false)
  const [error, setError] = useState('')

  async function fetchWeather() {
    if (city.trim()==='')return

    setLoading(true)
    setError('')
    setWeather(null)

    try{
      const response =await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
      )
      if (!response.ok){
        throw new Error('Sehir Bulanamadi')
      }
      const data: Weather=await response.json()
      setWeather(data)
    } catch(err){
      setError('Sehir bulanamadi, tekrar dene')
    } finally{
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Hava Durumu</h1>
      <SearchInput value={city} onChange={setCity} onSearch={fetchWeather} />
      {loading && <p>yukleniyor...</p>}
      {error && <ErrorMessage message={error}/>}
      {weather && <WeatherCard weather={weather}/>}


    </div>
  )
}

export default App
