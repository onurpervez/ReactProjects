import type { Weather } from "../types/weather";

interface Props{
    weather:Weather
}

function WeatherCard({weather}:Props) {
  return (
    <div>
        <h2>{weather.name}</h2>
        <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>{weather.weather[0].description}</p>
      <p>Sicaklik: {Math.round(weather.main.temp)}°C</p>
      <p>Hissedilen: {Math.round(weather.main.fells_like)}°C</p>
      <p>Nem: {weather.main.humidity}%</p>
      <p>Ruzgar: {weather.wind.speed}m/s</p>

    </div>
  )
}

export default WeatherCard